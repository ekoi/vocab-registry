import sys

sys.path.append("/opt/libsaxon-HEC-11.4/Saxon.C.API/python-saxon")
import saxonc

with saxonc.PySaxonProcessor(license=False) as proc:
    print(proc.version)

    document = proc.parse_xml(xml_file_name='/app/ah-juso.cmdi')
    if document is None:
        print('Document not loaded')
    else:
        xp = proc.new_xpath_processor()
        xp.declare_namespace("cmd", "http://www.clarin.eu/cmd/")
        xp.set_context(xdm_item=document)

        item = xp.evaluate_single("//cmd:Components/cmd:Vocabulary/cmd:title[@xml:lang='en']")
        if isinstance(item, saxonc.PyXdmNode):
            print(item.string_value)
        else:
            print('No node found')
