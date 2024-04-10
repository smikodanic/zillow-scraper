


window.dex8.main = async (input) => {
  console.log('input::', input);
  if (input !== 'start scraper') { return; }

  // libs
  const domPlus = window.dex8.domPlus;
  const EventEmitter = window.dex8.EventEmitter;
  const FunctionFlow = window.dex8.FunctionFlow;

  // functions
  const scrollListings = window.dex8.scrollListings;
  const extractListings = window.dex8.extractListings;

  // event emitter
  const ee = new EventEmitter();

  // functionflow
  const ff = new FunctionFlow({ debug: false, msDelay: 3400 }, ee);

  const x = {
    listingElems: [],
    listings: []
  };

  /* FF injections */
  ff.xInject(x);
  ff.libInject({ input, domPlus, ee, ff });


  await ff.serial([scrollListings, extractListings]);
};
