from ubuntu:latest

run apt-get update && \
    apt-get install -y apache2 && \
    rm -rf /var/lib/apt/lists/*

expose 80

cmd ["apache2ctl","-D","FOREGROUND"]


