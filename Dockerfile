FROM node:13
USER root

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN git clone https://github.com/ernstvdhoeven/n8n-nodes-scw
WORKDIR /usr/src/app/n8n-nodes-scw
RUN npm -g config set user root
RUN npm install -g n8n-node-dev
RUN npm install n8n -g
RUN n8n-node-dev build
CMD [ "n8n" ]
EXPOSE 5678

