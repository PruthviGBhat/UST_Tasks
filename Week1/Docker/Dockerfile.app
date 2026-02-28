# Small Java runtime image
FROM eclipse-temurin:17-jre

# Set a working directory
WORKDIR /app

# Copy your jar into the image
COPY HelloWorld.jar /app/app.jar

# Make the JAR the default program the container runs
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# (Optional) default args — you can override at `docker run ...`
# CMD ["default1", "default2"]




