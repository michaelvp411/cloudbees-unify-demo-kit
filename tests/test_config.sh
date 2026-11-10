F=src/config.py

test_db_port_is_postgres_default() { assert_grep '^DB_PORT = 5432$' "$F" "orders DB is Postgres on 5432"; }

test_database_url_is_postgres() { assert_grep 'postgresql://' "$F" "database_url() must build a postgresql:// URL"; }

test_db_name_is_orders() { assert_grep '^DB_NAME = "orders"$' "$F" "DB_NAME must be orders"; }

test_settings_overridable_from_env() { skip "env overrides not implemented yet (ORD-112)"; }
