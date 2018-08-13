FROM node:8

RUN mkdir /db

RUN mkdir /opt/app
WORKDIR /opt/app

ENV NODE_ENV=production

RUN mkdir /opt/app/web
COPY web/package.json /opt/app/web/package.json
COPY package.json /opt/app/package.json
RUN yarn

COPY . /opt/app

RUN yarn sequelize db:migrate
RUN yarn sequelize db:seed:all

ARG REACT_APP_OMDB_API_KEY
ARG REACT_APP_API_URL

RUN yarn build

ENTRYPOINT ["node", "main.js"]
