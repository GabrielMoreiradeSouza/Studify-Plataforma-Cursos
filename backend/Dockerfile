FROM gradle:jdk-25-and-26 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test

FROM eclipse-temurin:26-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
