SET 'auto.offset.reset'='earliest';

CREATE TABLE geo_heat_map AS
  SELECT
    windowstart ws,
    windowend we,
    geohash rowkey,
    AS_VALUE(geohash) as geohash,
    1 unity,
    COUNT(*) total
  FROM  bus
  WINDOW HOPPING (SIZE 30 SECONDS, ADVANCE BY 10 SECONDS)
  GROUP BY geohash
  EMIT CHANGES;

