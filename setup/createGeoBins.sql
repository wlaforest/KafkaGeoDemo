CREATE TABLE geo_heat_map AS
  SELECT windowstart ws, windowend we, geohash, COUNT(*) total
  FROM  cta
  WINDOW HOPPING (SIZE 60 SECONDS, ADVANCE BY 10 SECONDS)
  GROUP BY geohash
  EMIT CHANGES;