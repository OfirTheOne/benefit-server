# https://redis.io/docs/stack/get-started/install/docker/

docker run -d \
  --name redis-stack \
  -v /Users/og8217/redis-data:/data \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest


## validate connection 
## docker exec -it redis-stack redis-cli
## ping 


# docker run \
#   -p 6379:6379 \
#   -v /Users/og8217/redis-data:/data \
#   redislabs/redismod
