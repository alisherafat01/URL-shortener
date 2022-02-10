FROM node:14.16.0-alpine3.13
RUN addgroup -S app && adduser -S app -G app
RUN npm install -g sequelize-cli
USER app
WORKDIR /app
RUN mkdir data
COPY package*.json .
RUN npm install


# changing instructions
COPY . .
EXPOSE 3000
CMD ["npm","start"]
