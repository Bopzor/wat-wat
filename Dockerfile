FROM node:8

RUN mkdir /opt/app
RUN mkdir /opt/app/db
RUN mkdir /opt/app/web

WORKDIR /opt/app

ENV NODE_ENV=production

COPY package.json /opt/app/package.json
COPY web/package.json /opt/app/web/package.json
RUN yarn

COPY . /opt/app

ARG REACT_APP_OMDB_API_KEY
ARG REACT_APP_API_URL

RUN yarn build

CMD ["npm", "run", "prod"]
