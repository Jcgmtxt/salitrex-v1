#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until nc -z "$DB_HOST" 5432; do
    echo "Database is unavailable - sleeping"
    sleep 2
done
echo "Database is ready!"

echo "Running database migrations..."
python -m alembic upgrade head

exec "$@"
