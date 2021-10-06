 curl -s -X "POST" "http://localhost:8088/ksql" \
         -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
         -d '{"ksql": "SHOW QUERIES;"}' | \
  jq '.[].queries[].id' | \
  xargs -Ifoo curl -X "POST" "http://localhost:8088/ksql" \
           -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
           -d '{"ksql": "TERMINATE 'foo';"}'

curl -s -X "POST" "http://localhost:8088/ksql" \
           -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
           -d '{"ksql": "SHOW STREAMS;"}' | \
    jq '.[].streams[].name' | \
    xargs -Ifoo curl -X "POST" "http://localhost:8088/ksql" \
             -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
             -d '{"ksql": "DROP STREAM 'foo';"}'

curl -s -X "POST" "http://localhost:8088/ksql" \
           -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
           -d '{"ksql": "SHOW TABLES;"}' | \
    jq '.[].tables[].name' | \
    xargs -Ifoo curl -X "POST" "http://localhost:8088/ksql" \
             -H "Content-Type: application/vnd.ksql.v1+json; charset=utf-8" \
             -d '{"ksql": "DROP TABLE 'foo';"}'

kafka-topics --bootstrap-server localhost:9092 --delete --topic bus_raw,bus_prepped,alert,fence_raw,fence,GEO_HEAT_MAP,MAX_BIN_COUNT,exploded_bus,wmata_rest

# TODO remove connectors in case this is the walk through