import os
import uuid
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

    def create_summary_for(elem, is_obj=False):
        summary = {
            "count": grab_value("./cmd:count", elem, int),
            "stats": [{
                "uri": grab_value("./cmd:URI", ns_elem),
                "prefix": grab_value("./cmd:prefix", ns_elem),
                "count": grab_value("./cmd:count", ns_elem, int),
            } for ns_elem in elementpath.select(elem, "./cmd:Namespaces/cmd:Namespace", ns)]
        }

        if is_obj:
            classes_root = grab_first("./cmd:Classes", elem)
            literals_root = grab_first("./cmd:Literals", elem)

            summary.update(
                classes=create_summary_for(classes_root) if classes_root else None,
                literals=create_summary_for(literals_root) if literals_root else None
            )

        return summary

    file = os.environ.get('RECORDS_PATH', '../data/records/') + id
    parsed = etree.parse(file)
    root = parsed.getroot()

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
        "locations": [{
            "location": grab_value("./cmd:uri", elem),
            "type": grab_value("./cmd:type", elem),
            "recipe": None
        } for elem in elementpath.select(root, f"{voc_root}/cmd:Location", ns)],
        "reviews": [{
            "id": str(uuid.uuid4()),
            "rating": randint(1, 6),
            "review": lorem.paragraphs(randint(1, 6)),
            "nickname": None,
            "moderation": None,
            "user": str(uuid.uuid4())
        } for i in range(0, randint(0, 4))],
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
            "predicates": create_summary_for(grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Predicates", root)),
            "objects": create_summary_for(grab_first(f"{voc_root}/cmd:Summary/cmd:Statements/cmd:Objects", root),
                                          is_obj=True),
        } if grab_first(f"{voc_root}/cmd:Summary", root) else None
    }
