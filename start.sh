docker run -it \
  --name wat-wat-container \
  -v $(pwd):/opt/app \
  -u $(id -u):$(id -g) \
  -e PORT=3000 \
  -e NODE_ENV=development \
  -p 3000:3000 \
  wat-wat \
  npm start
