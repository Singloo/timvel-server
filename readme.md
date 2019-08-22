
## 等待重构



#### Instal docker on Ubuntu

```
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-get update -y
sudo apt-get install software-properties-common -y
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
sudo apt-get install dmsetup
sudo dmsetup mknodes
apt-cache policy docker-engine
sudo systemctl status docker
sudo apt-get install docker-engine -y
docker ps

```
#### run server
docker run -v /apps/timvel-server:/apps/timvel-server -w /apps/timvel-server -d --name timvel-server -p 0.0.0.0:8080:8080 --env-file /apps/env.list --restart always node:latest npm run start

#### run nginx
docker run -d \
  --name timvel-nginx
  -p 80:80 \
  -p 443:443 \
  --net="host" \
  --env-file /apps/env.list \
  -v /apps/timvel-server/nginx.conf:/etc/nginx/nginx.conf:ro \
  --restart always \
  nginx
