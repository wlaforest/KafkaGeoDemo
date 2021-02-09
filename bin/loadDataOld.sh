tar -Oxzf data/wmata.csv.tgz | kafka-console-producer --broker-list localhost:9092 --topic bus_raw > /dev/null
