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

kafka-topics --bootstrap-server localhost:9092 --delete --topic ctaPrepped,alert,fence_raw,fence,GEO_HEAT_MAP,MAX_BIN_COUNT
# kafka-topics --bootstrap-server localhost:9092 --delete --topic alert
# kafka-topics --bootstrap-server localhost:9092 --delete --topic fence_raw
# kafka-topics --bootstrap-server localhost:9092 --delete --topic fence
# kafka-topics --bootstrap-server localhost:9092 --delete --topic GEO_HEAT_MAP