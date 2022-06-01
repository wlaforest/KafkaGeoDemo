kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_raw --partitions 1 --config retention.ms=-1

kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_prepped --partitions 1 --config retention.ms=-1