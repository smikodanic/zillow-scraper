import EventEmitter from './libs/EventEmitter.js';
import main from './scraper/main.js';


console.log('[foreground.js] ZILLOW SCRAPER - forground script works !');

window.dex8 = {};
let isRunning = false;

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // define event emitter as global variable
  const eventEmitter = new EventEmitter();
  window.dex8.eventEmitter = eventEmitter; // inject in the FunctionFlow (see main.js)

  console.log('[foreground.js] request::', request);


  // routes
  if (request === 'scraper/start') {
    if (isRunning) { console.error('[foreground.js] The scraper is already started'); return; }
    isRunning = true;

    try {
      const input = {};
      await main(input);
    } catch (err) {
      const payload = `[foreground.js] main ERROR: ${err.message}`;
      console.error(payload);
      chrome.runtime.sendMessage({ route: 'echo-error', payload }).catch(err => console.error('[foreground.js]', err.message));
    }


    isRunning = false;

  } else if (request === 'scraper/pause') {
    eventEmitter.emit('ff-pause');

  } else if (request === 'scraper/stop') {
    eventEmitter.emit('ff-stop');

  } else if (request === 'scraper/resume') {
    eventEmitter.emit('ff-start');

  }

});
