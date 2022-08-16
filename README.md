# KafkaGeoDemo

This repo has a demonstration of the KSQLGeo UDF.  The data presently in this demo come from WMATA but can easily be 
adapated from other data like from Chicago Transit Authority (CTA). This demonstration provides a node.js script that 
queries the WMATA REST API provides and publishes it into Kafka. For the purposes of the demo script provided, however, 
a pre-saved data set will be used.  The bus event data will then be pre-processed 
in KSQL to transform it and enrich it with a geo hash.  One of the transformations is to speed the timeline up 10X 
to make the routes draw more rapidly so its more to watch in the user interface.  The geo hash is calculated using the 
geo_geohash() UDF in the geo library found in the [KSQLGeo](https://github.com/wlaforest/KSQLGeo) repo.

This data is then served up to a webapp built using the javascript mapping library Leaflet through an event rest service
that sits in front of Kafka ([KafkaEventService](https://github.com/wlaforest/KafkaEventService).  The KafkaEventService 
is a vert.x web app and, in addition to proxying access to Kafka events via SSE, it allows you to serve up static 
content (in this case the demo app). The web app interface allows one to define shapes on the map that represent 
geo fences.  Those geo fences are sent to the KafkaEventService which publishes them into a Kafka topic.  The geo_fence 
topic is joined with the bus data topic to find instances when buses have entered the fences.

The map also displays bus densities based off a KSQL aggregated on the geo hashes.

<img width="966" alt="Screen Shot 2021-10-04 at 9 35 13 AM" 
src="https://user-images.githubusercontent.com/1627780/135860931-8d887f14-9285-4f72-ada1-8a88f02ce384.png">


## Steps To Run Demo.

This will work against CP running from a tarball installation or against a dockerized version with the UDF and selected
containers installed.  

### Containerized

This is likely the easiest path and has been tested on Intel and M1.
From the root of the repo run `docker-compose up -d`

### Non-containerized

#### Requirements

If you are running this from tar ball then the requirements for your local system is

* Confluent Platform 6.0 (tar installation)
* Java 11 or higher

#### Install the geospatial UDF

If you are running against the tarball installation than you must install the UDF in ksql.  To do so go to the root 
of the github directory.  Make sure that <code>CONFLUENT_HOME</code> is set and then  run the 
following command <code>bin/install-geo-udf.sh</code>.  This two line command assumes you have not set the 
<code>ksql.extension.dir</code> variable in your <code>ksql-server.properties</code>.  If you have then you can manually
install <code>jars/ksqlgeo-1.3.1.jar</code>.

### Run the demo
From the root directory of the project 
 
1. run <code>start.sh</code> 
2. In a web browser goto localhost:8080/home.html

The start script prepares the topics, load the data, and creats the ksqlDB processing pipeline.  One can kill the
launched service when you are done with <code>^c</code>

It is more instructive to create the ksqlDB pipeline manually.  This can be done with the following steps:

1. run <code>bin/prepTopics.sh</code>
2. run each of the KSQL commands in the same order seen in bin/prepKsql.sh.  This can be done on the command line with 
a command like <code>ksql < ksql/2-createGeoFence.sql</code> or you can copy and past the contents into the ksql console
confluent control center at http://localhost:9021/ or by executing <code>ksql</code> from the command line and going
interactive mode.
3. run <code>java -jar jars/KafkaEventService-1.0.1-fat.jar -conf conf/kesConfig.json</code>

After you are done you can clean all the demo state by running <code>bin/clean.sh</code>

## Optional Steps 
If you with to run the data loader yourself you will need to install node.js and then run the following

1. npm init --yes
2. npm install request --save
3. npm install kafkajs





 
