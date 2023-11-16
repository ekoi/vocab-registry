import json
import os
import uuid
import operator
import elementpath
import unicodedata

from lxml import etree
from random import randint
from datetime import datetime
from lorem_text import lorem


def parse(id):
    ns = {"cmd": "http://www.clarin.eu/cmd/"}
    voc_root = './cmd:Components/cmd:Vocabulary'

    def grab_value(path, root, func=None):
        content = elementpath.select(root, path, ns)
        if content and type(content[0]) == str:
            content = unicodedata.normalize("NFKD", content[0]).strip()
        elif content and content[0].text is not None:
            content = unicodedata.normalize("NFKD", content[0].text).strip()
        else:
            content = None

        if content and func:
            content = func(content)

        return content

    def grab_first(path, root):
        content = elementpath.select(root, path, ns)
        return content[0] if content else None

    def create_summary_for(elem):
        return {
            "count": grab_value("./cmd:count", elem, int),
            "stats": [{
                "uri": grab_value("./cmd:URI", ns_elem),
                "prefix": grab_value("./cmd:prefix", ns_elem),
                "count": grab_value("./cmd:count", ns_elem, int),
            } for ns_elem in elementpath.select(elem, "./cmd:Namespaces/cmd:Namespace", ns)]
        }

    def create_list_for(elem):
        return {
            "list": [{
                "uri": grab_value("./cmd:URI", list_item_elem),
                "prefix": grab_value("./cmd:prefix", list_item_elem),
                "name": grab_value("./cmd:name", list_item_elem),
                "count": grab_value("./cmd:count", list_item_elem, int),
            } for list_item_elem in elementpath.select(elem, "./cmd:NamespaceItems/cmd:NamespaceItem", ns)]
        }

    def create_location_for(elem):
        return {
            "location": grab_value("./cmd:uri", elem),
            "type": grab_value("./cmd:type", elem),
            "recipe": grab_value("./cmd:recipe", elem),
        }

    file = os.environ.get('RECORDS_PATH', '../data/records/') + id + '.cmdi'
    parsed = etree.parse(file)
    root = parsed.getroot()
    f_reviews_path = os.environ.get('RECORDS_PATH', '../data/records/') + id + '-reviews.json'
    if os.path.exists(f_reviews_path):
        with open(f_reviews_path) as f:
            f_content = f.read()
            reviews_json = json.loads(f_content)
    else:
        reviews_json = []

    return {
        "id": id,
        "title": grab_value(
            f"({voc_root}/cmd:title[@xml:lang='en'][normalize-space(.)!=''],base-uri(/cmd:CMD)[normalize-space(.)!=''])[1]",
            root),
        "description": grab_value(f"{voc_root}/cmd:Description/cmd:description[@xml:lang='en']", root),
        "license": grab_value(f"{voc_root}/cmd:License/cmd:url", root) or 'http://rightsstatements.org/vocab/UND/1.0/',
        "versioningPolicy": None,
        "sustainabilityPolicy": None,
        "created": datetime.utcfromtimestamp(os.path.getctime(file)).isoformat(),
        "modified": datetime.utcfromtimestamp(os.path.getmtime(file)).isoformat(),
        "locations": [create_location_for(elem) for elem in elementpath.select(root, f"{voc_root}/cmd:Location", ns)],
        "user":"123",#user_session = UserSession(flask.session, 'default')
        "reviews": reviews_json,
        "usage": {
            "count": 0,
            "outOf": 0
        },
        "recommendations": [{
            "publisher": grab_value("./cmd:name", elem),
            "rating": None
        } for elem in elementpath.select(root, f"{voc_root}/cmd:Assessement/cmd:Recommendation/cmd:Publisher", ns)],
        "summary": {
            "namespace": {
                "uri": grab_value(f"{voc_root}/cmd:Summary/cmd:Namespace/cmd:URI", root),
                "prefix": grab_value(f"{voc_root}/cmd:Summary/cmd:Namespace/cmd:prefix", root)
            },
            "stats": create_summary_for(grab_first(f"{voc_root}/cmd:Summary", root)),
            "subjects": create_summary_for(grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Subjects", root)),
            "predicates": {
                **create_summary_for(grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Predicates", root)),
                **create_list_for(grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Predicates", root)),
            },
            "objects": {
                **create_summary_for(grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects", root)),
                "classes": {
                    **create_summary_for(
                        grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects/cmd:Classes", root)),
                    **create_list_for(
                        grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects/cmd:Classes", root)),
                },
                "literals": {
                    **create_summary_for(
                        grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects/cmd:Literals", root)),
                    **create_list_for(
                        grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects/cmd:Literals", root)),
                    "languages": [{
                        "code": grab_value("./cmd:code", lang_elem),
                        "count": grab_value("./cmd:count", lang_elem, int),
                    } for lang_elem in
                        elementpath.select(root,
                                           f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects/cmd:Literals/cmd:Languages/cmd:Language",
                                           ns)],
                },
            },
        } if grab_first(f"{voc_root}/cmd:Summary", root) is not None else None,
        "versions": sorted([{
            "version": grab_value("./cmd:version", elem),
            "validFrom": grab_value("./cmd:validFrom", elem),
            "locations": [create_location_for(loc_elem) for loc_elem in elementpath.select(elem, "./cmd:Location", ns)],
        } for elem in elementpath.select(root, f"{voc_root}/cmd:Version", ns)],
            key=operator.itemgetter('validFrom', 'version'), reverse=True)
    }
