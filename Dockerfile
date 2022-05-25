FROM debian:bullseye-slim as oracle
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install ca-certificates axel unzip
RUN axel -q https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basiclite-linux.x64-19.6.0.0.0dbru.zip
RUN unzip -qq -j -d instantclient instantclient-basiclite-linux.x64-19.6.0.0.0dbru.zip

FROM node:16.15.0-bullseye-slim
RUN apt-get -y update && apt-get -y install libaio1 && rm -rf /var/lib/apt/lists/*
COPY --from=oracle /instantclient/libclntshcore.so.19.1 /instantclient/libclntsh.so.19.1 /instantclient/libnnz19.so /instantclient/libociicus.so /opt/oracle/instantclient/
RUN echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && ldconfig
WORKDIR /home/node
COPY --chown=node package.json package-lock.json ./
USER node
RUN npm ci
COPY index.js .
CMD [ "node", "." ]
