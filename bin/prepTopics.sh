kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_raw  --config retention.ms=-1
kafka-topics --bootstrap-server localhost:9092 --create \
  --topic bus_prepped  --config retention.ms=-1
kafka-topics --bootstrap-server localhost:9092 --create \
  --topic GEO_HEAT_MAP  --config retention.ms=-1

tar -Oxzf data/wmata.csv.tgz | kafka-console-producer --bootstrap-server localhost:9092 --topic bus_raw > /dev/null
