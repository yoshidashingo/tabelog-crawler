# Tabelog Crawler

食べログクローラーで新規営業リスト作成

[![Node.js CI](https://github.com/yoshidashingo/tabelog-crawler/actions/workflows/node.js.yml/badge.svg)](https://github.com/yoshidashingo/tabelog-crawler/actions/workflows/node.js.yml)

### Local Development

```sh
npm i
cp .env.example .env
npm run db:start
npm start
```

### Deployment

```sh
npm start
```

### Docs

-   http://cheeriojs.github.io/cheerio/
-   https://www.chaijs.com/guide/styles/#should
-   https://crontab.guru/examples.html
-   https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
-   https://blog.csdn.net/m0_64393446/article/details/130861264

### Note

1. Create or add a user to rabbitmq:

```sh
rabbitmqctl add_user myUser myPass
rabbitmqctl set_user_tags myUser administrator
rabbitmqctl delete_queue hello
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl start_app
```

### EC2 for url consumer

**setup**

```sh
apt update

# .env file for production env
vim .env

vim run.sh
chmod +x run.sh

git config --global user.name "tabelog"
git config --global user.email "tabelog@example.com"
ssh-keygen -t rsa -b 4096 -C "tabelog@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
node -v
npm i -g pm2
# for geting ssh knows
git clone git@github.com:yoshidashingo/tabelog-crawler.git
cd tabelog-crawler
vim .env
cd
vim run.sh
chmod +x run.sh
cd .ssh
# download tablelog-crawler-dev.pem to here
chmod 0400 *.pem
cd
mkdir .aws
cd .aws
vim credentials
```

**run.sh**

```sh
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.11.0/bin
cd ~
cd tabelog-crawler
git pull
npm i
pm2 start rabbitmq/url-consumer.js
```
