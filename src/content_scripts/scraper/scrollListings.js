const scrollListings = async (x, lib) => {
  const domPlus = lib.domPlus;

  chrome.runtime.sendMessage({ route: 'echo', payload: '----- scrollListings ----' }).catch(err => console.error('[scrollListings.js]', err.message));
  await domPlus.scrollElement('div#search-page-list-container', 500, 1000);
  await domPlus.sleep(1300);
  chrome.runtime.sendMessage({ route: 'echo', payload: 'scrolling finished' }).catch(err => console.error('[scrollListings.js]', err.message));

  return x;
};


export default scrollListings;
