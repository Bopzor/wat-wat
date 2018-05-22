FROM node:8

RUN mkdir /db

RUN mkdir /opt/app
WORKDIR /opt/app

COPY . /opt/app

ARG REACT_APP_OMDB_API_KEY
ARG REACT_APP_API_URL

ENV NODE_ENV=production

RUN yarn
RUN yarn build

ENTRYPOINT ["node", "main.js"]
