const miio = require('miio');
const express = require('express')
const app = express()

// Resolve a device, resolving the token automatically or from storage
miio.device({ address: '192.168.199.32', token: 'bebd745b66dbe73c99d3b08346f4e270' })
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
