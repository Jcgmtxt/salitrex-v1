#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-salitrex_user}" -d "${DB_DATABASE:-salitrex}"; do
    echo "Database is unavailable - sleeping"
    sleep 2
done
echo "Database is ready!"

echo "Running database migrations..."
python -m alembic upgrade head

exec "$@"