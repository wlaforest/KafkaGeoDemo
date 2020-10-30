const request = require('request');
const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'wmata-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const wmataKey = "939c01312c384533be90522cce82b05b";
const baseVehicleUrl = "https://api.wmata.com/Bus.svc/json/jBusPositions?api_key=" + wmataKey + "&format=json";


timerFunc();
setInterval(timerFunc, 10000);

function timerFunc() {
  var routes = {};

  request(baseVehicleUrl, {json: true}, (err, res, body) => {
    if (err) {
      return console.log(JSON.stringify(err));
    }

    vehicles = body["BusPositions"];
     if (vehicles) {
       publishToKafka(vehicles, "VehicleID");
       }
  });
}

function publishToKafka(jsonObjs, idPath)
{
  var messagesArray = [];
  for (i of jsonObjs)
  {
    i.LoadTime = Date.now();
    var message = {}
    message.key = i[idPath];
    message.value = JSON.stringify(i);
    messagesArray.push(message);
  }

  var data = {
    topic: "bus",
    messages: messagesArray
  }
  producer.connect();
  producer.send(data);
  console.log(data);
  producer.disconnect();
}
