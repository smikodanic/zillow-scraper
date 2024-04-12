import EventEmitter from './libs/EventEmitter.js';
import main from './scraper/main.js';


console.log('ZILLOW SCRAPER - forground script works !');

window.dex8 = {};
let isRunning = false;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // define event emitter
  const eventEmitter = new EventEmitter();
  window.dex8.eventEmitter = eventEmitter; // inject in the FunctionFlow (see main.js)


  console.log(request);


  // routes
  if (request === 'scraper/start') {
    if (isRunning) { console.error('The scraper is already started'); return; }
    isRunning = true;

    const input = {};
    await main(input);

    isRunning = false;

  } else if (request === 'scraper/pause') {
    eventEmitter.emit('ff-pause');

  } else if (request === 'scraper/stop') {
    eventEmitter.emit('ff-stop');

  } else if (request === 'scraper/resume') {
    eventEmitter.emit('ff-start');

  }


});
