# nestjs-graphql with reverse proxy

Tried to replicate the AWS gateway using nginx as reverse proxy. 

## Working
Exposes nestjs with a global prefix `nest/global/prefix` and let graphql use this global prefix and expose it on `/graphql-prefix`. The reverse proxy adds an extra `reverse-proxy-prefix` in front, we do not control the proxy, it is configured in `nginx.conf` in the `nginx` directory but in production by a third party. The playground should respect the prefixes of the reverse proxy and the global prefixes.

So the endpoint is `reverse-proxy-prefix/nest/global/prefix/graphql-prefix`. 

### Start

```bash
docker-compose up

# this works fine
# note the reverse-proxy-prefix is handled
# correctly
curl 'http://localhost:8080/reverse-proxy-prefix/nest/global/prefix/graphql-prefix' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:8080' --data-binary '{"query":"# Write your query or mutation here\nquery recipe($id: String!) {\n  recipe(id: $id){\n    id,\n  }\n}","variables":{"id":"1"}}' --compressed
```

### Opening the playground
Open `http://localhost:8080/reverse-proxy-prefix/nest/global/prefix/graphql-prefix` in the browser to access the playground throws a bunch of errors. The `GET` returns a 200, but the `POST` does not respect the `reverse-proxy-prefix`. And thus it throws an error: server cannot be reached, as it can not find the endpoint: `http://localhost:8080/nest/global/prefix/graphql-prefix`, note it removed the `reverse-proxy-prefix` from the POST request.

