## Doc

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
