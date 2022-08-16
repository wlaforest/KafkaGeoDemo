SET 'auto.offset.reset'='earliest';

CREATE STREAM BUS_RAW
    (VehicleID VARCHAR,
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
    BlockNumber VARCHAR,
    LoadTime BIGINT)
WITH
    (KAFKA_TOPIC='bus_raw', VALUE_FORMAT='JSON', TIMESTAMP='LoadTime');


CREATE STREAM BUS
WITH (KAFKA_TOPIC='bus_prepped', TIMESTAMP='DTIME', PARTITIONS=1, REPLICAS=1) AS
    SELECT
      CAST((b.ROWTIME - STRINGTOTIMESTAMP(TIMESTAMPTOSTRING(b.ROWTIME, 'yyyy-MM-dd'), 'yyyy-MM-dd'))*.1 +
                UNIX_TIMESTAMP() - 86400000 AS BIGINT) DTIME,
        TIMESTAMPTOSTRING(b.ROWTIME, 'yyyy-MM-dd HH:mm:ss') HTIME,
        as_value(geo_geohash(Lat,Lon,5)) GEOHASH,
      *
    FROM BUS_RAW b
    PARTITION BY geo_geohash(Lat,Lon,5)
    EMIT CHANGES;
