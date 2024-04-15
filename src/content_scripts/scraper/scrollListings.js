const scrollListings = async (x, lib) => {
  const domPlus = lib.domPlus;
  const sendMessage = lib.sendMessage;

  sendMessage({ route: 'echo', payload: '----- scrollListings ----' });
  await domPlus.scrollElement('div#search-page-list-container', 500, 1000);
  await domPlus.sleep(1300);
  sendMessage({ route: 'echo', payload: 'scrolling finished' });

  return x;
};


export default scrollListings;
