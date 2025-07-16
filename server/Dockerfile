FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc libxml2-dev libxslt1-dev python3-dev && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y --auto-remove gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 5000

CMD ["flask", "--app", "server", "run", "--host=0.0.0.0", "--port=5000"]
