FROM node:8

RUN mkdir /opt/app
WORKDIR /opt/app

COPY . /opt/app

ENV REACT_APP_API_URL=

RUN yarn
RUN yarn build

EXPOSE 4269
EXPOSE 3000

ENTRYPOINT ["node", "main.js"]
