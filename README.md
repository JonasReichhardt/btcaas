# Bitcoin as a Sense

##### [Powered by CoinDesk](https://www.coindesk.com/price/bitcoin)

This project aims to use the human skin, the biggest receptor for stimulations to create a sense whichs focus is the current development of the Bitcoin price.  The price is recovered from the CoinDesk API every minute. The node.js application calculates the price difference to last minute and accordingly sends specific signals over a serial port to an Arduino.  The microcontroller activates a tens unit to draw an arrow on the user's back with electronic muscle stimulation.

[The project is inspired by this Ted Talk from David Eagleman](https://www.youtube.com/embed/4c1lqFXHvqI)



## Install the package

```json
npm install btcaas
```



## Configure the package

### Attributes

`port` port for the communication with the Arduino.

`timeout` time between the two shocks which are drawing the arrow

`shockLength` the base shock time. Note that the base shock time gets added with the price difference multiplied by 10.

```javascript
var btcaas = require('btcaas')

btcaas.port = "COM4" 
btcaas.timeout = 200 
btcaas.shockLength = 150
```



## Usage

After setting up the attributes you can run the package with

```javascript
var btcaas = require('btcaas')

btcaas.start()
```



The method start an infinite loop in which the price is retrieved and logged every minute.