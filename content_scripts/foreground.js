console.log('ZILLOW SCRAPER - forground script works !');

window.dex8 = {};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const input = request; // from action/popup.js
  window.dex8.main(input);
});
