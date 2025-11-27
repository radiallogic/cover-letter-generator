FROM node:24-alpine

WORKDIR /app/

RUN apk update && apk add bash openntpd
# RUN apk add postgresql

CMD ["tail", "-f", "/dev/null"]
# CMD ["yarn", "dev"]