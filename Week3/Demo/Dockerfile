FROM ubuntu:22.04

# Install Java, Maven, and MySQL
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk maven mysql-server && \
    apt-get clean

WORKDIR /app

# Copy project
COPY . /app

# Build the application
RUN mvn clean package -DskipTests

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080 3306

CMD ["/start.sh"]
