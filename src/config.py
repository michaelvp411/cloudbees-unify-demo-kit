"""
orders-api configuration.

NOTE (demo): this file intentionally contains a hardcoded credential so that
CloudBees Unify's automatic security scanning flags a finding in the
component's Security tab. Do NOT hardcode secrets in real code — load them
from a secrets manager or environment variables.
"""

DB_HOST = "db.internal.example.com"
DB_PORT = 5432
DB_NAME = "orders"
DB_USER = "orders_service"

# Hardcoded password — intentional demo finding.
DB_PASSWORD = "P@ssw0rd123!"

# Payment gateway used by checkout retries.
PAYMENT_GATEWAY_URL = "https://payments.internal.example.com/v2"
PAYMENT_GATEWAY_API_KEY = "pgw-demo-7c41e2a9d03b"
PAYMENT_GATEWAY_TIMEOUT_SECONDS = 5


def database_url():
    return f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
