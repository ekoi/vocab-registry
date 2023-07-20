import os


def get_doc_html(id):
    try:
        path = os.environ.get('DOCS_PATH', '../data/docs/') + id + '.html'
        with open(path, 'r') as f:
            return f.read()
    except IOError:
        return None
