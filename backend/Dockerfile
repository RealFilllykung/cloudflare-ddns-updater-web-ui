# Backend Dockerfile for Java 21 Spring Boot
FROM openjdk:21-jdk-slim as build
WORKDIR /app
COPY . .
RUN ./gradlew build -x test

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
