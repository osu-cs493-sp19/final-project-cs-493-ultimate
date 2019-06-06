FROM node:11
WORKDIR /usr/src/app

# Seperating npm install from copying over our code prevents docker from redownloading everything on changes
COPY package.json package.json
RUN npm install
 
COPY . .
ENV PORT=8000
EXPOSE ${PORT}
CMD [ "npm", "start" ]
