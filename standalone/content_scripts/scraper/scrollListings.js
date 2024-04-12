window.dex8.scrollListings = async (x, lib) => {
  const domPlus = lib.domPlus;

  console.log('----- scrollListings ----');
  await domPlus.scrollElement('div#search-page-list-container', 500, 1000);
  await domPlus.sleep(1300);
  console.log(' scrolling finished');

  return x;
};
