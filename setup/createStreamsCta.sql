CREATE STREAM CTA_RAW
      ( vid INTEGER,
        tmstmp VARCHAR,
        lat DOUBLE,
        lon DOUBLE,
        hdg VARCHAR,
        pid INTEGER,
        rt VARCHAR,
        des VARCHAR,
        pdist INTEGER,
        dly BOOLEAN,
        tatripid STRING,
        tablockid STRING,
        zone STRING
      )
WITH (KAFKA_TOPIC='cta', VALUE_FORMAT='JSON', TIMESTAMP='tmstmp',
      TIMESTAMP_FORMAT='yyyyMMdd HH:mm');

CREATE STREAM CTA
WITH (KAFKA_TOPIC='ctaPrepped', TIMESTAMP='DTIME')
  AS
    SELECT CAST((C.ROWTIME*.1 + 1000000000000) as BIGINT) DTIME,
      1 UNITY,
      geo_hash(lat,lon,6) geohash,
      *
    FROM CTA_RAW C
    EMIT CHANGES;
