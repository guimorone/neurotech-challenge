#!/bin/bash

set -e

echo "${0}: Running migrations..."
python manage.py makemigrations --merge --no-input
python manage.py migrate --no-input

echo "${0}: Config static files..."
python manage.py collectstatic --no-input

gunicorn backend.wsgi:application \
  --name backend \
  --bind 0.0.0.0:8000 \
  --timeout 3600 \
  --workers 4 \
  --log-level=info \
  --reload
