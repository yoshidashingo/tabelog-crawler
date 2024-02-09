# Tabelog Crawler

食べログクローラーで新規営業リスト作成

[![Node.js CI](https://github.com/yoshidashingo/tabelog-crawler/actions/workflows/node.js.yml/badge.svg)](https://github.com/yoshidashingo/tabelog-crawler/actions/workflows/node.js.yml)

### Local Development

```sh
npm i
cp .env.example .env
npm run arch:start
npm start
```

### Commands

```sh
npm start                           # run http server
npm test                            # run test

npm run arch:start                  # run mongodb and rabbitmq
npm run arch:stop                   # stop mongodb and rabbitmq

npm run script:cron                 # run crawler task every day

npm run mq:url-ec2-producer         # produce url and ec2 queues
npm run mq:ec2-consumer             # handle ec2 queue
```

### Distrubuted deployment

```sh
npm run script:cron
npm run mq:url-ec2-producer
npm run mq:ec2-consumer

```

### Docs

-   http://cheeriojs.github.io/cheerio/
-   https://www.chaijs.com/guide/styles/#should
-   https://crontab.guru/examples.html
-   https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue

### Note

1. Create or add a user to rabbitmq:

```sh
$ rabbitmqctl add_user myUser myPass
$ rabbitmqctl set_user_tags myUser administrator
```
