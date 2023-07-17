FROM python:3.11.4

WORKDIR /api

COPY ./requirements.txt /api/
COPY ./dockerScript.sh /api/

RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y redis
RUN chmod +x /api/dockerScript.sh

COPY ./app ./app
WORKDIR /api/app
ENTRYPOINT [ "/api/dockerScript.sh" ]
