FROM python:3.14.0b4-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN apt-get update && \
    apt-get install -y gcc libxml2-dev libxslt1-dev python3-dev && \
    pip install --upgrade pip && \
    pip install -r requirements.txt && \
    apt-get remove -y gcc && \
    apt-get autoremove -y && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . /app

EXPOSE 5000

CMD ["flask", "--app", "server", "run"]