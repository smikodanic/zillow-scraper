const nextPage = async (x, lib) => {
  const domPlus = lib.domPlus;
  const ff = lib.ff;
  const sendMessage = lib.sendMessage;


  sendMessage({ route: 'echo', payload: '----- nextPage ----' });
  console.log('----- nextPage ----');

  const nextPageLink_elem = document.querySelector('ul>li>a[title="Next page"]:not([disabled])'); // next page link which is not disabled
  if (nextPageLink_elem) {
    await domPlus.clickElement(nextPageLink_elem);
    await domPlus.sleep(1300);
    sendMessage({ route: 'echo', payload: ' +Next page clicked' });
    console.log(' +Next page clicked');
  } else {
    sendMessage({ route: 'echo', payload: ' -No new pages.The scraper reach the end.' });
    console.log(' -No new pages.The scraper reach the end.');
    ff.stop();
  }


  return x;
};


export default nextPage;
