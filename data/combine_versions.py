import os
import elementpath

from lxml import etree

ns = {"cmd": "http://www.clarin.eu/cmd/"}
ns_prefix = '{http://www.clarin.eu/cmd/}'
voc_root = './cmd:Components/cmd:Vocabulary'


def grab_first(path, root):
    content = elementpath.select(root, path, ns)
    return content[0] if content else None


files = [os.path.join('records', f) for f in os.listdir('records')
         if os.path.isfile(os.path.join('records', f)) and '@' in f]

for file in files:
    new_file = file.split('@')[0] + '.cmdi'

    if not os.path.exists(new_file):
        os.rename(file, new_file)
    else:
        parsed = etree.parse(file)
        root = parsed.getroot()
        vocab = grab_first(voc_root, root)
        version_comp = grab_first("./cmd:Version", vocab)

        if version_comp is not None:
            parsed_org = etree.parse(new_file)
            root_org = parsed_org.getroot()
            vocab_org = grab_first(voc_root, root_org)
            vocab_org.append(version_comp)

            fh = open(new_file, 'wb')
            fh.write(etree.tostring(root_org, pretty_print=True))
            fh.close()

        os.remove(file)
