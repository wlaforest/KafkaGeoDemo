# Walk through of constructing the app


* wmata rest service
  * Show what the WMATA services returns
  * It updates onces every 10 seconds and is providing data for all buses
  * We need to ingest and could use custom code but instead will use a connector
* C3
  * Bring up C3
  * This is a console for Confluent Platform
  * Brief walk through
* Connect
  * show Confluent Hub
  * No running connectors
  * could manually add one with the UI
  * instead we will use the connect API to spin up the RestSource source connector
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
  * show that there is no schema in the schema registry
* Walk through and execute queries 
  * [ksql/1-createBusStream.sql](ksql/1-createBusStream.sql)
  * [ksql/2-createGeoFence.sql](ksql/2-createGeoFence.sql)
  * [ksql/3-createGeoBins.sql](ksql/3-createGeoBins.sql)
  * [ksql/4-createAlertStream.sql](ksql/4-createAlertStream.sql)
* execute the vert.x app by running run.sh
* goto to http://localhost:8080/home.html


