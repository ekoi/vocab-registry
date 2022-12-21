class parser:
    def parse(self, rec):
        file = etree.parse("/data/records/"+rec)
        root = file.getroot()
        ns = {"cmd": "http://www.clarin.eu/cmd/","xml": "http://www.w3.org/XML/1998/namespace"}
        ttl = grab_value("./cmd:Components/cmd:Vocabulary/cmd:title[@xml:lang='en']", root, ns)
        desc = grab_value("./cmd:Components/cmd:Vocabulary/cmd:Description/cmd:description[@xml:lang='en']", root, ns)
        retStruc = {"record": rec,"title": ttl, "description": desc}
        return retStruc
