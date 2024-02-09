export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.11.0/bin
cd ~
cd tabelog-crawler
git pull
npm i
pm2 start rabbitmq/first-step-consumer.js