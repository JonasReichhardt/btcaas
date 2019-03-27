const fetch = require('node-fetch');
const serial = require('serialport')

const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'; //Powered by CoinDesk
const sleepTime = 60000; //one minute in millis
const timeout = 200; //timeout between serial messages
const shockLength = 150;

let serialPort;
let lastVal;
let curVal;
let count = 1;
let difLength;
let debugMode = false;

async function main() {
    let signal;

    if (process.argv.length > 2) {
        if (process.argv[2] === "-debug") {
            debugMode = true;
        } else {
            serialPort = new serial('COM4');
        }
    }

    while (true) {
        console.log(count + ". iteration")
        count++;

        await getData();
        signal = calculateDif();
        await sendSignals(signal);
        console.log('-------------------------------');
        await sleep(sleepTime);
    }
}

//sending signals according to price change
async function sendSignals(signal) {
    var shockTime = shockLength + difLength;

    if (signal === 12) {

        if (!debugMode) {
            serialPort.write(shockTime + 'r', serialCallback);
            await sleep(timeout);
            serialPort.write(shockTime + 'l', serialCallback);
        }
        console.log('shock length:' + shockTime);
        console.log('price fall ↓');
    } else if (signal === 21) {

        if (!debugMode) {
            serialPort.write(shockTime + 'l', serialCallback);
            await sleep(timeout);
            serialPort.write(shockTime + 'r', serialCallback);
        }
        console.log('shock length:' + shockTime);
        console.log('price rise ↑')
    } else {
        console.log('not a right signal');
    }
}

function serialCallback(err) {
    if (err) {
        console.log('error writing to serial port: ' + err);
    }
}

//calculate price differences
function calculateDif() {
    dif = curVal - lastVal;

    if (dif < 0) {
        console.log('price difference: ' + JSON.stringify(dif))

        difLength = dif * 10;

        /* return 12 because the upper electrode is fired first  *|
        |* represents an arrow which points downwards            */
        return 12;
    } else if (dif > 0) {
        console.log('price difference: +' + JSON.stringify(dif))

        difLength = dif * 10;

        /* return 21 because the lower electrode is fired first  *|
        |* represents an arrow which points upwards              */
        return 21;
    } else {
        return 0;
    }
}

//retrieves Data from API
async function getData() {
    lastVal = curVal;

    curVal = await fetch(url)
    curVal = await curVal.json()

    curVal = curVal.bpi.EUR.rate_float
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

exports.start = main();

