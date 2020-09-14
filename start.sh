echo "JDK 11 or greater required"
echo "Starting with config in conf/kesConfig.json"
echo "To access go to http://localhost:8080 (or whatever port is configured)"

java -jar jars/KafkaEventService-1.0.1-fat.jar -conf conf/kesConfig.json
