from flask import Flask, request, jsonify
from flask_cors import CORS
from elastic_index import Index
from cmdi_parser import parse

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
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


@app.get('/detail')
def get_detail():
    rec = request.args.get("rec")
    return jsonify(parse(rec))


if __name__ == '__main__':
    app.run()
