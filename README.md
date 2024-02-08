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

npm run script:gen-fifty-json       # get all fities and save to fifty.json file
npm run script:init-diff            # init diffs collection

npm run mq:first-step-producer      # mq producer for get all url of stores
npm run mq:first-step-consumer      # mq consumer for get all url of stores

npm run mq:second-step-producer     # mq producer for update the store by url
npm run mq:second-step-consumer     # mq consumer for update the store by url
```

### Use one PC as the first step worker

```sh
git pull
npm i
cp .env.example .env
npm run mq:first-step-consumer
```

### Diagram

##### 一段階

![](./assets/first-step-diagram.svg)

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
