window.dex8.nextPage = async (x, lib) => {
  const domPlus = lib.domPlus;
  const ff = lib.ff;

  console.log('----- nextPage ----');
  const nextPageLink_elem = document.querySelector('ul>li>a[title="Next page"]:not([disabled])'); // next page link which is not disabled
  if (nextPageLink_elem) {
    await domPlus.clickElement(nextPageLink_elem);
    await domPlus.sleep(1300);
    console.log(' +Next page clicked');
  } else {
    console.log(' -No new pages.The scraper reach the end.');
    ff.stop();
  }


  return x;
};
