# react-data-app
Data page

[![Docker Pulls](https://img.shields.io/docker/pulls/vinils/react-data-app.svg)](https://hub.docker.com/r/vinils/react-data-app)
[![Docker Stars](https://img.shields.io/docker/stars/vinils/react-data-app.svg)](https://hub.docker.com/r/vinils/react-data-app)
<a href="https://hub.docker.com/r/vinils/react-data-app/builds" target="_blank">Docker Builds</a>

docker build -t vinils/react-data-app .  
docker run -p 3001:3001 -it -d -e REACT_APP_DATA_POINT=192.168.15.147:8002/odata vinils/react-data-app  
