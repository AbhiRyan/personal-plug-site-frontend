FROM node:20-alpine as build


WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN timeout 15m npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist/personal-plug-site ./
CMD node server/server.mjs
EXPOSE 4000
