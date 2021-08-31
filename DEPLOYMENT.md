# DEPLOYMENT INSTRUCTIONS

prerequisites: Have EC2 instance up on AWS ($1.30)
Instance public IPv4 DNS is ssh id
Create key pair and download
Got to security options
    -> inbound rules have 
        port range: 80   Protocol: TCP   Source : 0.0.0.0/0  Security groups: launch-wizard-1
        portrange : 22   Protocol: TCP   Source : 0.0.0.0/0  Security groups: launch-wizard-1

    -> outbound rules have
        portrange : All   Protocol: All   Source : 0.0.0.0/0  Security groups: launch-wizard-1

open git bash
$ cd Downloads
$ ssh -i "agar-remake.pem" ubuntu@ec2-3-98-138-251.ca-central-1.compute.amazonaws.com\

Set up ssh key-gen for virtual machine and git repository. Pull in repository and name  folder 'bootleg-agar'

install node.js (allows npm use)
install dependencies for project
install ngnix
install pm2 

$ cd ~/bootleg-agar
$ pm2 start backend/server.js

$ sudo vim /etc/nginx/sites-available/default

Edit file to this:

#####
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        # BENSON root /var/www/bootleg-agar;

        # BENSON index index.html index.htm index.nginx-debian.html;

        server_name 3.98.138.251;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                # BENSON try_files $uri /index.html;

                ## if node server started on cli
                # BENSON_THIS_ONE proxy_pass http://localhost:3000/;

                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection “upgrade”;
                proxy_max_temp_file_size 0;

                ## if run on pm2
                proxy_pass http://127.0.0.1:3000/; 
                proxy_redirect off;
                proxy_read_timeout 240s;
        }
}
#####

make sure compiles ok
$ sudo nginx -t

$ sudo sysmtemctl restart nginx

DONE!
