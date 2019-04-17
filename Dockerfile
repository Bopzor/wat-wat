FROM node:8

RUN mkdir /opt/app
RUN mkdir /opt/app/db

WORKDIR /opt/app

ENV NODE_ENV=production

COPY package.json /opt/app/package.json
RUN yarn

COPY . /opt/app

CMD ["npm", "run", "prod"]
