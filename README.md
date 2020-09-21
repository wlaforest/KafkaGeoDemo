# KafkaGeoDemo

This repo has a demonstration of the KSQLGeo UDF.  The data presently in this demo come from WMATA but can easily be 
adapated from other data like from Chicago Transit Authority (CTA). This demonstration provides a node.js script that 
queries the REST API WMATA provides (and one for CTA) and publishes it into Kafka.  That data will then be pre-processed 
in KSQL to transform it slightly and enrich with a geo hash.  One of the transformations is to speed the timeline up 10X 
to make the routes draw more rapidly so its more interesting.  The geo hash is calculated using the geo_hash() UDF 
function.

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
* Java

## Steps To Run Demo.

This demo assumes that you have Confluent Platform running on your local machine with the default ports.  If not you 
can download it and find installation instructions at https://www.confluent.io/download/  

From the root directory of the project 

1. run <code>start.sh</code> 
2. In a web browser goto localhost:8080/home.html

The start script prepares the topics, load the data, and creats the ksqlDB processing pipeline.  One can kill the
launched service when you are done with <code>^c</code>

It is more intructive to create the ksqlDB pipeline manually.  This can be done with the following steps:

1. run <code>bin/prepTopics.sh</code>
2. run <code>bin/loadData.sh</code>
3. run each of the KSQL commands in the same order seen in bin/prepKsql.sh.  This can be done on the command line with 
a command like <code>ksql < ksql/createGeoFence.sql</code> or you can copy and past the contents into the ksql console
confluent control center at http://localhost:9021/ or by executing <code>ksql</code> from the command line and going
interactive mode.

After you are done you can clean all the demo state by running <code>bin/clean.sh</code>



 
