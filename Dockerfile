FROM node:alpine as frontend-build

WORKDIR /app
COPY ./frontend/ /app
RUN npm install && npm run build

FROM python:3.7-slim

ENV PYTHONPATH /app/backend/src
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y procps locales

RUN echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen &&\
  echo "de_DE.UTF-8 UTF-8" >> /etc/locale.gen &&\
  locale-gen

ENV LC_ALL de_DE.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

WORKDIR /app
COPY ./backend/ /app/backend
COPY --from=frontend-build /app/build /app/frontend/build

RUN pip3 install --trusted-host pypi.python.org -r /app/backend/requirements.txt

ENV FLASK_APP=/app/backend/src/app.py
ENV FLASK_ENV=production

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "-t", "60", "-w", "4", "app:app"]
