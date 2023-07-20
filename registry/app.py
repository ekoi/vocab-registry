from werkzeug.http import parse_date
from flask import Flask, request, jsonify, abort, redirect, Response
from flask_cors import CORS
from elastic_index import Index
from cmdi_parser import parse
from datetime import datetime
from doc import get_doc_html

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
CORS(app)

index = Index()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@app.route("/search/<path>")
@app.route("/detail/<path>")
def catch_all(path):
    return app.send_static_file("index.html")


@app.get('/facet')
def get_facet():
    facet = request.args.get("name")
    amount = request.args.get("amount")
    ret_struc = index.get_facet(facet + ".keyword", amount)
    return jsonify(ret_struc)


@app.post('/browse')
def browse():
    struc = request.get_json()
    ret_struc = index.browse(struc["page"], struc["page_length"], struc["sortorder"] + ".keyword",
                             struc["searchvalues"])
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


if __name__ == '__main__':
    app.run()
