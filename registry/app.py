from flask import Flask, request, jsonify, abort, redirect, session
from flask_cors import CORS
from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.provider_configuration import ProviderConfiguration, ClientMetadata
from flask_pyoidc.user_session import UserSession
from werkzeug.http import parse_date
from functools import wraps
from config import app_domain, secret_key, oidc_server, oidc_client_id, oidc_client_secret
from elastic_index import Index
from cmdi import get_record, create_basic_cmdi
from datetime import datetime
from doc import get_doc_html
import os
import json
import flask

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
app.config.update(
    OIDC_REDIRECT_URI=app_domain + '/signin-callback',
    SECRET_KEY=secret_key,
)

CORS(app)

auth = OIDCAuthentication({'default': ProviderConfiguration(
    issuer=oidc_server,
    client_metadata=ClientMetadata(
        client_id=oidc_client_id,
        client_secret=oidc_client_secret),
    auth_request_params={'scope': ['openid', 'email', 'profile']},
)}, app) if oidc_server is not None else None

index = Index()


def authenticated(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if auth:
            user_session = UserSession(session, 'default')
            if user_session.last_authenticated is None:
                return jsonify(result='not_authenticated', error='Please login!'), 401

        return func(*args, **kwargs)

    return wrapper


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@app.route("/search/<path>")
@app.route("/detail/<path>")
def catch_all(path):
    return app.send_static_file("index.html")


if auth:
    @app.get('/login')
    @auth.oidc_auth('default')
    def login():
        destination = request.values.get('redirect-uri', default='/')
        return redirect(destination)


    @app.get('/user-info')
    @authenticated
    def user_info():
        user_session = UserSession(session, 'default')
        return jsonify(user_session.userinfo)


@app.post('/facet')
def get_facet():
    struc = request.get_json()
    ret_struc = index.get_facet(struc["name"], struc["amount"], struc["filter"], struc["searchvalues"])
    return jsonify(ret_struc)


@app.post('/browse')
def browse():
    struc = request.get_json()
    ret_struc = index.browse(struc["page"], struc["page_length"], struc["searchvalues"])
    return jsonify(ret_struc)


@app.get('/vocab/<id>')
def get_vocab(id):
    return jsonify(get_record(id).model_dump())


@app.post('/vocab/new')
def post_vocab():
    if 'title' in request.values and 'homepage' in request.values and 'description' in request.values:
        if create_basic_cmdi(request.values['title'], request.values['homepage'], request.values['description']):
            # TODO: send email
            return jsonify(success=True), 201

    return jsonify(success=False), 400


@app.get('/proxy/<recipe>/<id>')
def proxy(recipe, id):
    # Proxy for cache: /{regex:[a-z0-9-_]+[^@](\\.[a-z]+)?}
    # Proxy to: /proxy/cache/$1 for regex: /([a-z0-9-_]+)(\\.[a-z]+)?

    # Proxy for skosmos: /{regex:[a-z0-9-]+[^_]*}
    # Proxy to: /proxy/skosmos/$1 for regex: /([a-z0-9-_]+)(/.*)?

    record = get_record(id)
    if not record:
        abort(404)

    request_date = parse_date(request.headers['accept-datetime']).replace(tzinfo=None) \
        if 'accept-datetime' in request.headers else None

    locations = None
    if request_date:
        for version in record.versions:
            if not locations and version.validFrom and version.validFrom <= request_date:
                locations = version.locations
    else:
        locations = record.versions[0].locations

    redirect_uri = next(loc.location for loc in locations if loc.recipe == recipe) if locations else None
    if not redirect_uri:
        abort(404)

    return redirect(redirect_uri, code=302)


@app.post('/review/<id>')
# @auth.oidc_auth('default')
def review_form(id):
    data = request.get_json()

    f_reviews_path = os.environ.get('RECORDS_PATH', '../data/records/') + id + '-reviews.json'
    if os.path.exists(f_reviews_path):
        with open(f_reviews_path, "r+") as f:
            f_content = f.read()
            reviews_file_json = json.loads(f_content)
            data.update({"id": str(len(reviews_file_json)+1), "nickname": "", "moderation": ""})
            reviews_file_json.append(data)
            f.seek(0)
            f.write(json.dumps(reviews_file_json))
            f.truncate()
    else:
        data.update({"id": "1", "nickname": "", "moderation": ""})
        reviews_file_json = [data]
        with open(f_reviews_path, "w") as f:
            f.write(json.dumps(reviews_file_json))

    data = {"status":"OK", "id": id}
    return jsonify(data)

@app.get('/user-info')
# @auth.oidc_auth('default')
def user_info():
    user_session = UserSession(flask.session, 'default')
    if user_session.last_authenticated:
        return jsonify(user_session.userinfo)
    else:
        return "NOT LOGIN", 401


@app.get('/login')
@auth.oidc_auth('default')
def login():
    return redirect('/', 302)


@app.route('/logout')
@auth.oidc_logout
def logout():
    return "You\'ve been successfully logged out!"


if __name__ == '__main__':
    app.run()
