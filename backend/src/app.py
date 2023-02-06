from flask import Flask, request, jsonify, send_from_directory
from elastic_index import Index
from cmdi_parser import parser


app = Flask(__name__, static_folder='../../frontend/build', static_url_path='')

config = {
    "url" : "localhost",
    "port" : "9200",
    "doc_type" : "vocab"
}

index = Index(config)
parser = parser()

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    return response

@app.get("/")
@app.get("/search/<code>")
@app.get("/detail/<code>")
def hello_world(code=''):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/facet", methods=['GET'])
def get_facet():
    facet = request.args.get("name")
    amount = request.args.get("amount")
    ret_struc = index.get_facet(facet + ".keyword", amount)
    return jsonify(ret_struc)

# @app.route("/nested_facet", methods=['GET'])
# def get_nested_facet():
#     facet = request.args.get("name")
#     amount = request.args.get("amount")
#     path = request.args.get("path")
#     ret_struc = index.get_nested_facet(path, facet + ".keyword", amount)
#     return json.dumps(ret_struc)

@app.route("/filter-facet", methods=['GET'])
def get_filter_facet():
    facet = request.args.get("name")
    amount = request.args.get("amount")
    facet_filter = request.args.get("filter")
    ret_struc = index.get_filter_facet(facet + ".keyword", amount, facet_filter)
    return jsonify(ret_struc)

@app.route("/browse", methods=['POST'])
def browse():
    struc = request.get_json()
    ret_struc = index.browse(struc["page"], struc["page_length"], struc["sortorder"] + ".keyword", struc["searchvalues"])
    return jsonify(ret_struc)

@app.route("/item", methods=['GET'])
def manuscript():
    id = request.args.get('id')
    manuscript = index.item(id)
    return jsonify(manuscript)

@app.route("/get_collection", methods=["POST"])
def get_collection():
    data = request.get_json()
    collection_items = index.get_collection_items(data["collection"])
    return jsonify(collection_items)

@app.route("/detail", methods=['GET'])
def get_detail():
    rec = request.args.get("rec")
    return jsonify(parser.parse(rec))



#Start main program

if __name__ == '__main__':
    app.run()

