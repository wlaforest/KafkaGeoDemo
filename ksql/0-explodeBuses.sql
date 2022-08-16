SET 'auto.offset.reset'='earliest';

CREATE STREAM WMATA_RAW
    (BusPositions ARRAY<
       STRUCT<
         VehicleID VARCHAR,
         Lat DOUBLE,
         Lon DOUBLE,
         Deviation BIGINT,
         DateTime VARCHAR,
         TripID VARCHAR,
         RouteID VARCHAR,
         DirectionNum BIGINT,
         DirectionText VARCHAR,
         TripHeadSign VARCHAR,
         TripStartTime VARCHAR,
         TripEndTime VARCHAR,
         BlockNumber VARCHAR>>)
WITH
    (KAFKA_TOPIC='wmata_rest', VALUE_FORMAT='JSON', PARTITIONS=1, REPLICAS=1);

CREATE STREAM EXPLODED_BUS
WITH (KAFKA_TOPIC='exploded_bus', VALUE_FORMAT='AVRO', PARTITIONS=1, REPLICAS=1) AS
SELECT EXPLODE(BUSPOSITIONS) from WMATA_RAW EMIT CHANGES;