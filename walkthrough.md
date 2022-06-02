# Walk through of constructing the app

Before starting the walk through run prep topics 

* wmata rest service
  * Show what the WMATA services returns
  * It updates once every 10 seconds and is providing data for all buses
  * We need to ingest and could use custom code but instead will use a connector
  * Show Connect Hub and explain
* C3
  * This is a console for Confluent Platform
  * Brief walk through
  * No connectors running
  * Could spin up the rest source connector here
* Launch connector through API
  * Open terminal 
  * show [bin/wmataSourceRestConnector.sh](bin/wmataSourceRestConnector.sh)
  * run bin/wmataSourceRestConnector.sh
* Show wmata topic
  * each event represents all buses
  * We want to split this into seperate events per bus to track them individually
  * Show [ksql/0-explodeBuses.sql](ksql/0-explodeBuses.sql) and explain it
  * Explain that the data ingestion is too slow will use saved data
* Load the pre-saved data with bin/wmataSourceFileStreamConnector.sh
  * explain that we are going to use the filestream connector
  * show data in topic
* Walk through and execute queries 
  * [ksql/1-createBusStream.sql](ksql/1-createBusStream.sql)
    * Query the stream in ksql
  * [ksql/2-createGeoFence.sql](ksql/2-createGeoFence.sql)
  * [ksql/3-createGeoBins.sql](ksql/3-createGeoBins.sql)
    * Query the table
  * [ksql/4-createAlertStream.sql](ksql/4-createAlertStream.sql)
* Go back and show the topics
  * bus_prepped
  * show there is nothing in the fence
* execute the vert.x app by running run.sh
* goto to http://localhost:8080/home.html
  * Demo app
* Go back and show the fence and alert topic

