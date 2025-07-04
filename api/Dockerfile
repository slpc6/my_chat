
FROM python:3.12-alpine

WORKDIR /src

COPY . .

RUN python -m venv /src/venv \
    && /src/venv/bin/pip install --upgrade pip \
    && /src/venv/bin/pip install -r requirements.txt

EXPOSE 8000

CMD ["/src/venv/bin/python", "main.py"]
