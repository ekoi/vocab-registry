import os
import uuid

app_domain = os.environ.get('APP_DOMAIN', 'http://localhost:5000')
secret_key = os.environ.get('SECRET_KEY', uuid.uuid4().hex)

oidc_server = os.environ.get('OIDC_SERVER')
oidc_client_id = os.environ.get('OIDC_CLIENT_ID')
oidc_client_secret = os.environ.get('OIDC_CLIENT_SECRET')

es_host = os.environ.get("ES_HOST", "http://localhost:9200")
es_user = os.environ.get("ES_USER")
es_password = os.environ.get("ES_PASSWORD")
es_index = os.environ.get("ES_INDEX", "vocab")

records_path = os.environ.get('RECORDS_PATH', '../data/records/')
docs_path = os.environ.get('DOCS_PATH', '../data/docs/')
