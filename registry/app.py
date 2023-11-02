from werkzeug.http import parse_date
from flask import Flask, request, jsonify, abort, redirect, Response
from flask_cors import CORS
from elastic_index import Index
from cmdi_parser import parse
from datetime import datetime
from doc import get_doc_html
import os
import json

from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.provider_configuration import ProviderConfiguration, ClientMetadata
from flask_pyoidc.user_session import UserSession

import flask

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
CORS(app)
app.config.update({'OIDC_REDIRECT_URI': 'http://127.0.0.1:5000/signin-callback',
                   'SECRET_KEY': 'dev_key12345',  # make sure to change this!!
                   'DEBUG': True})
client_metadata = ClientMetadata(
    client_id='vocab-registry-auth',
    client_secret='VIbBpImJrfabtcdYkPBWpDyrJ2NEus9w', #From clickloack client credentials
    post_logout_redirect_uris=['http://127.0.0.1:5000/login'])


provider_config = ProviderConfiguration(issuer='http://localhost:9090/realms/vocab-registry',
                                        client_metadata=client_metadata)

auth = OIDCAuthentication({'default': provider_config}, app)
index = Index()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@app.route("/search/<path>")
@app.route("/detail/<path>")
def catch_all(path):
    return app.send_static_file("index.html")


@app.post('/facet')
def get_facet():
    struc = request.get_json()
    facet = struc["name"]
    amount = struc["amount"]
    ret_struc = index.get_facet(facet + ".keyword", amount)
    return jsonify(ret_struc)


@app.post('/browse')
def browse():
    struc = request.get_json()
    ret_struc = index.browse(struc["page"], struc["page_length"], struc["searchvalues"])
    return jsonify(ret_struc)


@app.get('/vocab/<id>')
def get_vocab(id):
    return jsonify(parse(id))


@app.get('/doc/<id>')
def get_doc(id):
    doc_bytes = get_doc_html(id)
    if not doc_bytes:
        abort(404)
    return Response(doc_bytes, mimetype='text/html')


@app.get('/proxy/<recipe>/<id>')
def proxy(recipe, id):
    # Proxy for cache: /{regex:[a-z0-9-_]+[^@](\\.[a-z]+)?}
    # Proxy to: /proxy/cache/$1 for regex: /([a-z0-9-_]+)(\\.[a-z]+)?

    # Proxy for skosmos: /{regex:[a-z0-9-]+[^_]*}
    # Proxy to: /proxy/skosmos/$1 for regex: /([a-z0-9-_]+)(/.*)?

    record = parse(id)
    if not record:
        abort(404)

    request_date = parse_date(request.headers['accept-datetime']).replace(tzinfo=None) \
        if 'accept-datetime' in request.headers else None

    locations = None
    if request_date:
        for version in record['versions']:
            if not locations and version['validFrom'] and datetime.fromisoformat(version['validFrom']) <= request_date:
                locations = version['locations']
    else:
        locations = record['versions'][0]['locations']

    redirect_uri = next(loc['location'] for loc in locations if loc['recipe'] == recipe) if locations else None
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
