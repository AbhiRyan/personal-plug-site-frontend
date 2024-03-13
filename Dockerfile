FROM node:20-alpine
WORKDIR /app
COPY ./dist/personal-plug-site ./
CMD node server/server.mjs
EXPOSE 4000
