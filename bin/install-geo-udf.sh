 mkdir -p "$CONFLUENT_HOME/ksql-ext" && cp jars/ksqlgeo-1.3.0.jar "$CONFLUENT_HOME/ksql-ext"
 echo "ksql.extension.dir=$CONFLUENT_HOME/ksql-ext" >> "$CONFLUENT_HOME/etc/ksqldb/ksql-server.properties"