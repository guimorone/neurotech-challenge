# Build the Django back end
FROM python:3.12.2-slim

ENV PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_VERSION=1.8.2

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
  && echo "pt_BR.UTF-8 UTF-8" >> /etc/locale.gen \
  && locale-gen

# System deps:
RUN pip install gunicorn "poetry==$POETRY_VERSION"

WORKDIR /backend

# Copy local code to the container image.
COPY pyproject.toml poetry.lock ./

# Install production dependencies.
RUN poetry config virtualenvs.create false \
  && poetry install --no-ansi --no-interaction --only main

COPY ./ ./

RUN chmod +x ./entrypoint.sh 

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]