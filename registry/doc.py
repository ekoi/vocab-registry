from config import docs_path


def get_doc_html(id):
    try:
        path = docs_path + id + '.html'
        with open(path, 'r') as f:
            return f.read()
    except IOError:
        return None
