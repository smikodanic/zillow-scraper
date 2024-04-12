window.dex8.main = async (input) => {
  // libs
  const domPlus = window.dex8.domPlus;
  const FunctionFlow = window.dex8.FunctionFlow;

  // functions
  const scrollListings = window.dex8.scrollListings;
  const extractListings = window.dex8.extractListings;
  const nextPage = window.dex8.nextPage;

  // event emitter
  const eventEmitter = window.dex8.eventEmitter;

  // functionflow
  const ff = new FunctionFlow({ debug: false, msDelay: 3400 }, eventEmitter);

  const x = {
    listingElems: [],
    listings: []
  };

  /* FF injections */
  ff.xInject(x);
  ff.libInject({ input, domPlus, eventEmitter, ff });


  await ff.serial([scrollListings, extractListings, nextPage]);
  await ff.repeat(1000);
};
