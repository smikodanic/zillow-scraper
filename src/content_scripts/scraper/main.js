// libs
import $ from 'jquery';
import domPlus from '../libs/domPlus.js';
import FunctionFlow from '../libs/FunctionFlow.js';

// functions
import scrollListings from './scrollListings.js';
import extractListings from './extractListings.js';
// import saveListings from './saveListings.js';
import nextPage from './nextPage.js';


const main = async (input) => {
  // event emitter
  const eventEmitter = window.dex8.eventEmitter;

  // define send message to popup method
  const sendMessage = window.dex8.sendMessage; // send response to popup (see popup.vue)


  // functionflow
  const ff = new FunctionFlow({ debug: false, msDelay: 3400 }, eventEmitter);

  const x = {
    listingElems: [],
    listings: []
  };

  /* FF injections */
  ff.xInject(x);
  ff.libInject({ input, domPlus, eventEmitter, ff, sendMessage, $ });


  await ff.serial([scrollListings, extractListings, nextPage]);
  await ff.repeat(1000);
};


export default main;
