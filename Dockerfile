FROM node:14.9.0-alpine3.10

# docker workdir
WORKDIR /home/usr/app

# copy files
COPY . .

# build the app
RUN npm ci && npm run build && npm prune --production

# expose at port 3000
EXPOSE 3000

# default command is starting the server
CMD ["npx", "pm2-runtime", "npm", "--", "start"]
