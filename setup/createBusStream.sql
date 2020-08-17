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
    (KAFKA_TOPIC='bus', VALUE_FORMAT='JSON', TIMESTAMP='LoadTime', PARTITIONS=1, REPLICAS=1);

CREATE STREAM BUS
WITH (KAFKA_TOPIC='busPrepped') AS
    SELECT CAST((b.ROWTIME - STRINGTOTIMESTAMP(TIMESTAMPTOSTRING(b.ROWTIME, 'yyyy-MM-dd'), 'yyyy-MM-dd'))*.1 +
                STRINGTOTIMESTAMP(TIMESTAMPTOSTRING(b.ROWTIME, 'yyyy-MM-dd'), 'yyyy-MM-dd') as BIGINT)DTIME, 1 UNITY,
            geo_hash(Lat,Lon,5) geohash, *
    FROM BUS_RAW b
    EMIT CHANGES;

