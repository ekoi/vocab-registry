from lxml import etree
import elementpath
import unicodedata


def grab_value(path, root, ns):
    # content = root.findall(path, ns)
    content = elementpath.select(root, path, ns)
    #print(f"content[{type(content[0])}][{content[0]}]")
    if content and type(content[0]) == str:
        return unicodedata.normalize("NFKD", content[0]).strip()
    elif content and content[0].text is not None:
        return unicodedata.normalize("NFKD", content[0].text).strip()
    else:
        return ""

def grab_list(name, path, root, ns):
    ret_arr = []
    # content = root.findall(path, ns)
    content = elementpath.select(root, path, ns)
    for item in content:
        buffer = {name : unicodedata.normalize("NFKD", item.text).strip()}
        if buffer not in ret_arr:
            ret_arr.append(buffer)
    return ret_arr


class parser:
    def parse(self, rec):
        file = etree.parse("/data/records/"+rec)
        root = file.getroot()
        ns = {"cmd": "http://www.clarin.eu/cmd/","xml": "http://www.w3.org/XML/1998/namespace"}
        ttl = grab_value("(//cmd:Components/cmd:Vocabulary/cmd:title[@xml:lang='en'][normalize-space(.)!=''],base-uri(/cmd:CMD)[normalize-space(.)!=''],'Hallo Wereld!')[1]", root, ns)
        desc = grab_value("./cmd:Components/cmd:Vocabulary/cmd:Description/cmd:description[@xml:lang='en']", root, ns)
        home = grab_value("./cmd:Components/cmd:Vocabulary/cmd:Location[cmd:type='homepage']/cmd:uri", root, ns)
        retStruc = {"record": rec,"title": ttl, "description": desc, "homepage": home}
        return retStruc
