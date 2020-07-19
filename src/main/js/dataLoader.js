const request = require('request');
const {Kafka} = require('kafkajs');
const kafka = new Kafka({
  clientId: 'cta-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
//vPfbikZwhUMXtJCuhuJqARRBG
const ctaKey = "wW3a8UQcqJhcireSBnujBAm7e";
const routesUrl = "http://www.ctabustracker.com/bustime/api/v2/getroutes?key=" + ctaKey + "&format=json";
const baseVehhicleUrl = "http://www.ctabustracker.com/bustime/api/v2/getvehicles?key=" + ctaKey + "&format=json&rt=";

//
timerFunc();
setInterval(timerFunc, 60000);

function timerFunc() {
  var routes = {};

  request(routesUrl, {json: true}, (err, res, body) => {
    if (err) {
      return console.log(JSON.stringify(err));
    }

    if (!body["bustime-response"].routes)
    {
      console.log("No bustime-response returned in " + JSON.stringify(body));
      console.log("res = " + JSON.stringify(res));
      return;
    }

    for (b of body["bustime-response"].routes) {
      request(baseVehhicleUrl + b.rt, {json: true}, (errv, resv, bodyv) => {

        try {
          var vehicles = bodyv["bustime-response"]["vehicle"];
          if (vehicles && vehicles.length > 0) {
            publishToKafka(vehicles, "vid");
          }
        }
        catch(err) {
          console.log("route response = " + JSON.stringify(bodyv));
        }
      });
    }
  });
}

function publishToKafka(jsonObjs, idPath)
{
  var messagesArray = [];
  for (i of jsonObjs)
  {
    var message = {}
    message.key = i[idPath];
    message.value = JSON.stringify(i);
    messagesArray.push(message);
  }

  var data = {
    topic: "cta",
    messages: messagesArray
  }
  producer.connect();
  producer.send(data);
  console.log(data);
  producer.disconnect();
}