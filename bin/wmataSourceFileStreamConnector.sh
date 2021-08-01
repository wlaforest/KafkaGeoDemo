 # Uncomrpess the data file
 tar -xzf data/wmata.txt.tgz
 mv wmata.txt /tmp

 # Spin up the source filsetream converter
 curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ \
  -d '{
        "name": "bus-source",
        "config": {
          "connector.class": "FileStreamSource",
          "tasks.max": "1",
          "file": "/tmp/wmata.txt",
          "topic": "bus_raw",
          "key.converter":"org.apache.kafka.connect.storage.StringConverter",
          "value.converter":"org.apache.kafka.connect.storage.StringConverter"
        }
      }'

