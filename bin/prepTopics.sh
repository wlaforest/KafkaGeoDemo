kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_raw  --config retention.ms=-1

bin/loadData.sh