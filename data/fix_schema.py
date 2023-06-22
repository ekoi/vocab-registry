import os
import elementpath

from lxml import etree
from datetime import datetime

ns = {"cmd": "http://www.clarin.eu/cmd/"}
ns_prefix = '{http://www.clarin.eu/cmd/}'
voc_root = './cmd:Components/cmd:Vocabulary'


def grab_first(path, root):
    content = elementpath.select(root, path, ns)
    return content[0] if content else None


files = [os.path.join('records', f) for f in os.listdir('records') if os.path.isfile(os.path.join('records', f))]

for file in files:
    filename = os.path.splitext(os.path.basename(file))[0]

    parsed = etree.parse(file)
    root = parsed.getroot()
    vocab = grab_first(voc_root, root)

    type = grab_first("./cmd:type", vocab)
    if type is None:
        type = etree.SubElement(vocab, f"{ns_prefix}type", nsmap=ns)
        type.text = 'owl'

    version_comp = grab_first("./cmd:Version", vocab)
    location_comp = grab_first("./cmd:Location[cmd:type[contains(text(), 'endpoint')]]", vocab)
    if version_comp is None and location_comp is not None:
        version_comp = etree.SubElement(vocab, f"{ns_prefix}Version", nsmap=ns)
        yalc_version = filename.split('@')[1] if '@' in filename else '1.0'

        version = etree.SubElement(version_comp, f"{ns_prefix}version", nsmap=ns)
        version.text = yalc_version

        try:
            date = datetime.strptime(yalc_version, '%Y-%m-%d')
            valid_from = etree.SubElement(version_comp, f"{ns_prefix}validFrom", nsmap=ns)
            valid_from.text = date.isoformat()
        except:
            try:
                date = datetime.strptime(yalc_version, '%Y-%m')
                valid_from = etree.SubElement(version_comp, f"{ns_prefix}validFrom", nsmap=ns)
                valid_from.text = date.isoformat()
            except:
                try:
                    date = datetime.strptime(yalc_version, '%Y')
                    valid_from = etree.SubElement(version_comp, f"{ns_prefix}validFrom", nsmap=ns)
                    valid_from.text = date.isoformat()
                except:
                    pass

        version_comp.append(location_comp)

    tree = etree.ElementTree(root)
    etree.indent(tree, space='    ', level=0)
    tree.write(file, encoding='utf-8')
