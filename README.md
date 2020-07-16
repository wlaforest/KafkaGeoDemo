# KafkaGeoDemo

This repo has a demonstration of the KSQLGeo UDF.  The data comes from Chicago Transit Authority (CTA) which publishes 
information updated on a minute basis.  This demonstration provides a node.js script that queries the REST API CTA 
provides and publishes it into Kafka.  That data will then be pre-processed in KSQL to transform it slightly and enrich 
with a geo hash.  One of the transformations is to speed the timeline up 10X since minute upates are rather slow.  The 
geo hash is calculated using the geo_hash() UDF function.

This data is then served up to a webapp built using the javascript mapping library Leaflet through an event rest service
that sits in front of Kafka (KafkaEventService https://github.com/wlaforest/KafkaEventService).  The KafkaEventService 
is a vert.x web app and allows you to serve up static content.  In this case the static content is the webb app.  The 
web app interface allows one to define shapes on the map that represent geo fences.  Those geo fences are sent to the 
KafkaEventService which publishes them into a Kafka topic.  The geo_fence topic is joined with the cta bus data topic to
find instances when buses have entered the fences.

The map also displays bus densities based off a KSQL aggregated on the geo hashes.
 

## Requirements

* Confluent Platform 
* Node.js
* Java 11 or greater
* Install KSQLGeo and add extenstion to ksql: https://github.com/wlaforest/KSQLGeo

## Steps To setup project
1. npm init --yes
2. npm install request --save
3. npm install kafkajs

## Steps To Run Demo.

From the root directory of the project

1. <code>node src/main/js/dataLoader.js</code> - Let this run until you have hit the maximum requests for a day.
2. <code>setup/prepare.sh</code> - This will pre-create some of the topics 
3. In KSQL execute the commands in setup/createStreamsCta.sql 
4. In KSQL execute the commands in setup/createGeoFences.sql
5. In KSQL execute the commands in setup/createGeoBins.sql
6. In KSQL execute the commands in setup/createAlertStream.sql
7. <code>java -jar jars/KafkaEventService-1.0.0-SNAPSHOT-fat.jar -conf conf/kesConfig.json</code> - This runs the KafkaEventService
8. In a web browser hit localhost:8080/home.html 
