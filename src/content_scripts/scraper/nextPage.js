const nextPage = async (x, lib) => {
  const domPlus = lib.domPlus;
  const ff = lib.ff;


  chrome.runtime.sendMessage({ route: 'echo', payload: '----- nextPage ----' }).catch(err => console.error('[nextPage.js]', err.message));
  console.log('----- nextPage ----');

  const nextPageLink_elem = document.querySelector('ul>li>a[title="Next page"]:not([disabled])'); // next page link which is not disabled
  if (nextPageLink_elem) {
    await domPlus.clickElement(nextPageLink_elem);
    await domPlus.sleep(1300);
    chrome.runtime.sendMessage({ route: 'echo', payload: ' +Next page clicked' }).catch(err => console.error('[nextPage.js]', err.message));
    console.log(' +Next page clicked');
  } else {
    chrome.runtime.sendMessage({ route: 'echo', payload: ' -No new pages.The scraper reach the end.' }).catch(err => console.error('[nextPage.js]', err.message));
    console.log(' -No new pages.The scraper reach the end.');
    ff.stop();
  }


  return x;
};


export default nextPage;
