# react-data-app
Data page

docker build -t vinils/data_app .<BR>
docker run -p 3001:3001 -it -d -e REACT_APP_DATA_POINT=192.168.15.35:8002/odata/v4 vinils/data_app
