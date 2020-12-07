kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_raw  --config retention.ms=-1

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_prepped  --config retention.ms=-1