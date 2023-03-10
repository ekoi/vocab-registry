import os
import uuid
import elementpath
import unicodedata

from lxml import etree
from random import randint
from datetime import datetime
from lorem_text import lorem

ns = {"cmd": "http://www.clarin.eu/cmd/"}
voc_root = './cmd:Components/cmd:Vocabulary'


def parse(id):
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
        "usage": [{
            "count": 0,
            "outOf": 0
        }],
        "recommendations": [{
            "publisher": grab_value("./cmd:name", elem),
            "rating": None
        } for elem in elementpath.select(root, f"{voc_root}/cmd:Assessement/cmd:Recommendation/cmd:Publisher", ns)],
    }


def grab_value(path, root):
    content = elementpath.select(root, path, ns)
    if content and type(content[0]) == str:
        return unicodedata.normalize("NFKD", content[0]).strip()
    elif content and content[0].text is not None:
        return unicodedata.normalize("NFKD", content[0].text).strip()
    else:
        return None
