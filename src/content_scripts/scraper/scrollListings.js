const scrollListings = async (x, lib) => {
  const domPlus = lib.domPlus;
  const echo = lib.echo;

  echo.log('----- scrollListings ----');
  await domPlus.scrollElement('div#search-page-list-container', 500, 1000);
  await domPlus.sleep(1300);
  echo.log(' scrolling finished');

  return x;
};


export default scrollListings;
