FROM node


WORKDIR /usr/app

COPY package.json ./

RUN npm install
# check how to use yarn from the node image

COPY . .

EXPOSE 3333

CMD ["npm","run","dev"]