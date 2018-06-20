#!/usr/bin/env node
const miio = require('miio');
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

if (process.argv.length !== 4) {
  throw "wrong args"
}
const address = process.argv[2]
const token = process.argv[3]

// Resolve a device, resolving the token automatically or from storage
miio.device({ address: address, token: token })
  .then(device => {
    console.log('Connected to', device)

    app.get('/power', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      device.power()
        .then(isOn => 
          res.send(JSON.stringify({"status": "ok", "power": isOn}))
        )
        .catch(err => {
          res.status(500);
          res.send(JSON.stringify({"status": "error", "reason": err}));
        });
    })
    app.post('/power/:action', (req, res) => { 
      res.setHeader('Content-Type', 'application/json');

      var on = true
      if (req.params.action === "on") {
        on = true;
      } else if (req.params.action === "off") {
        on = false;
      } else {
        res.status(400);
        res.send(JSON.stringify({"status": "error", "reason": "invalid parameters"}));
        return;
      }
      device.setPower(on)
        .then(data => { 
          res.send(JSON.stringify({"status": "ok"}));
        })
        .catch(err => {
          console.log(err)
          res.status(500);
          res.send(JSON.stringify({"status": "error", "reason": err}));
        })
    })
    app.listen(3000, () => console.log('Example app listening on port 3000!'))

  })
  .catch(err => {
    console.log("Failed to connect to mi power strip")
    console.log(err)
  });
