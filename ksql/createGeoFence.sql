SET 'auto.offset.reset'='earliest';

CREATE STREAM FENCE_RAW
  (ROWKEY VARCHAR KEY, type VARCHAR, "properties" MAP<VARCHAR, VARCHAR>,
   geometry MAP<VARCHAR, VARCHAR>, _raw_data VARCHAR)
WITH
  (kafka_topic='fence_raw', value_format='JSON', PARTITIONS=1);

CREATE STREAM FENCE WITH (KAFKA_TOPIC='fence', PARTITIONS=1, REPLICAS=1) AS
  SELECT geo_covering_geohashes(_raw_data, 5) GEOHASH KEY, *
  FROM FENCE_RAW;
