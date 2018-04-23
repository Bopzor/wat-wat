FROM node:8

RUN mkdir /opt/app
WORKDIR /opt/app

COPY . /opt/app

RUN yarn
RUN yarn build

EXPOSE 4269
EXPOSE 3000

ENTRYPOINT ["node", "main.js"]
