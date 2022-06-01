SET 'auto.offset.reset'='earliest';

CREATE STREAM FENCE_RAW
  (ROWKEY VARCHAR KEY, type VARCHAR, "properties" MAP<VARCHAR, VARCHAR>,
   geometry MAP<VARCHAR, VARCHAR>, _raw_data VARCHAR)
WITH
  (kafka_topic='fence_raw', value_format='JSON', PARTITIONS=1);

CREATE STREAM FENCE WITH (KAFKA_TOPIC='fence', PARTITIONS=1, REPLICAS=1) AS
  SELECT *, 1 "UNITY"
  FROM FENCE_RAW;
