FROM python:3.11.4

WORKDIR /api

COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

WORKDIR /api/app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80","--reload"]