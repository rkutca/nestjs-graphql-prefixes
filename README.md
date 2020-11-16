# nestjs-graphql with reverse proxy

Tried to replicate the AWS gateway using nginx as reverse proxy. 

## Working
Exposes nestjs with a global prefix `api/company/v1` and let graphql use this global prefix and expose it on `/search`. The reverse proxy adds an extra `v1` in front, we do not control the proxy, it is configured in `nginx_include.conf` but in production by a third party. The playground should respect the prefixes of the reverse proxy and the global prefixes.

So the endpoint is `v1/api/company/v1/search`. 

### Start

```bash
docker-compose up

# this works fine
curl 'http://localhost:8080/v1/api/company/v1/search' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:8080' --data-binary '{"query":"# Write your query or mutation here\nquery recipe($id: String!) {\n  recipe(id: $id){\n    id,\n  }\n}","variables":{"id":"1"}}' --compressed
```

### Opening the playground
Open http://localhost:8080/v1/api/company/v1/search in the browser to access the playground throws a bunch of errors. The main, error: server cannot be reached. The playground tries to connect with the global prefix of nestjs only, and not take the prefix of the reverse proxy into consideration. See network tab.

