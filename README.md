# nginx-lb-proxy

This is an extremely simplified dockerised example of, nginx as a load balancing proxy to redirect requests on a node server running on multiple containers.

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](LICENSE)

---

## Setup

1. Clone this repository and cd into the directory.

```
$ git clone https://github.com/nisarg73/nginx-lb-proxy.git
$ cd nginx-lb-proxy
```

2. To see the project in action using concurrent multiple requests, we'll use `loadtest` package from npm.

```
$ sudo npm install -g loadtest
```

3. Build all the containers.

```
$ docker-compose build
```

---

## Usage

1. Run the proxy container and your desired number of app containers (n) using `docker-compose up` along with `scale` flag. (We are using `n=10` here.)

```
$ docker-compose up --scale app=10
```

2. Now, to see if our proxy server redirects the requests correctly, open another terminal window and execute `loadtest`

```
$ loadtest -t 5 -c 50 --rps 100 http://localhost:3110
```

Here flags that we are using are,

```
-t      timelimit           Number of requests to send out
-c      concurrency         Number of clients
--rps   requestsPerSecond   Number of requests per second that are sent
```

You can read about more parameters on [loadtest repo](https://github.com/alexfernandez/loadtest)

3. After this, in the terminal you ran the containers, you can clearly see how each request is first going to the proxy server and then subsequently redirected to one of the app servers!

![lb-demo](lb-demo.gif)

---

## How it works?

- When we ran `docker-compose up --scale app=10` it created 10 app containers and 1 proxy container under the `load-balancer` network as defined in `docker-compose.yml`.

- Note that even though all the app servers are running on `port 3110`, because all of them are in different containers, each container will have different ip address under network. This can be easily viewed from the proxy container.

```
$ docker-compose exec proxy sh
/ # nslookup app

Name:      app
Address 1: 172.19.0.4 nginx-lb-proxy_app_3.nginx-lb-proxy_load-balancer
Address 2: 172.19.0.11 nginx-lb-proxy_app_7.nginx-lb-proxy_load-balancer
Address 3: 172.19.0.6 nginx-lb-proxy_app_9.nginx-lb-proxy_load-balancer
Address 4: 172.19.0.5 nginx-lb-proxy_app_2.nginx-lb-proxy_load-balancer
Address 5: 172.19.0.3 nginx-lb-proxy_app_5.nginx-lb-proxy_load-balancer
Address 6: 172.19.0.8 nginx-lb-proxy_app_10.nginx-lb-proxy_load-balancer
Address 7: 172.19.0.7 nginx-lb-proxy_app_4.nginx-lb-proxy_load-balancer
Address 8: 172.19.0.9 nginx-lb-proxy_app_1.nginx-lb-proxy_load-balancer
Address 9: 172.19.0.12 nginx-lb-proxy_app_8.nginx-lb-proxy_load-balancer
Address 10: 172.19.0.10 nginx-lb-proxy_app_6.nginx-lb-proxy_load-balancer
```

- Here localhost's `port 3110` was binded to proxy container's `port 3110`. So all the requests from `localhost:3110` will be mapped to `proxy-server:3110`. Also, none of the app containers are not binded to localhost, so all the app servers are running independently on `port 3110` for their _respective containers_.

```
$ docker ps
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                            NAMES
2b480b6f083e        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_4
544a2ced179a        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_8
ca7d8efba5b9        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_1
4680a08e07fc        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_7
60a5d13d283b        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_10
8d8c98b75019        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_3
a808c432d4da        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_9
0c854a082a05        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_2
f687300baaac        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_6
78017f08ea1e        nginx-lb-proxy_proxy   "nginx -g 'daemon of…"   35 minutes ago      Up 35 minutes       80/tcp, 0.0.0.0:3110->3110/tcp   proxy-server
d3222e0a4ed5        nginx-lb-proxy_app     "docker-entrypoint.s…"   35 minutes ago      Up 35 minutes       3110/tcp                         nginx-lb-proxy_app_5
```

- Now finally, in `proxy.conf` we defined the proxy server to listen to its `port 3110` and redirect all the requests to app server. Since we are having multiple app in our `load-balancer` network, proxy server will use DNS resolver to decide the ip address of the app server to which it will redirect the request.

---

## Misc

1. Performances of a single server vs multiple servers using `loadtest`.
    - For starting a single server, simply go to the `app/` directory and run `npm start`.
    - Now execute a `loadtest` as before and compare its performance with multiple servers under different conditions.
