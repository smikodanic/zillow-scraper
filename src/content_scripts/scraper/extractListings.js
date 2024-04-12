const extractListings = async (x, lib) => {
  const ff = lib.ff;
  const { listElemsUniq, clickElement, waitForSelector, getCurrentUrl, sleep } = lib.domPlus;

  console.log('----- extractListings ----');
  let listing_elems = listElemsUniq('div#grid-search-results>ul>li article>div>div>a', 'href');
  listing_elems = Array.from(listing_elems); // unique elems
  const listing_hrefs = listing_elems.map(le => le.getAttribute('href'));

  console.log('listing_hrefs::', listing_hrefs);

  let i = 1;
  for (const listing_elem of listing_elems) {
    // PAUSE - 365 days
    if (ff.status === 'pause') { await ff._delayPause(365 * 24 * 60 * 60 * 1000); }
    if (ff.status === 'stop') { break; }

    console.log('START');
    // open listing
    await clickElement(listing_elem);
    await waitForSelector('div.data-column-container h1', 5000, 'appear').catch(err => console.log(err.message));

    // extract listing data
    let title = '';
    let location = '';
    let address = '';
    let city = '';
    let state = '';
    let zip = '';


    /// detect page type
    const rent_price = $('span[data-testid="price"]').text();
    console.log(`%c ${i}. rent_price: ${rent_price}`, 'background: #ffe257; color: Black');

    if (!rent_price) {
      title = $('h1[data-test-id="bdp-building-title"]').text();
      location = $('h2[data-test-id="bdp-building-address"]').text() || $('p[data-test-id="bdp-building-address"]').text();
    } else {
      location = $('div[data-testid="summary"] h1').text();
    }

    const location_parts = location?.split(',') || [];

    if (location_parts.length === 3) {
      address = location_parts[0] || '';
      city = location_parts[1] || '';
      const state_zip = location_parts[2] || '';
      const state_zip_parts = state_zip?.trim().split(' ') || [];
      state = state_zip_parts[0] || '';
      zip = state_zip_parts[1] || '';
    } else if (location_parts.length === 2) {
      city = location_parts[0] || '';
      const state_zip = location_parts[1] || '';
      const state_zip_parts = state_zip?.trim().split(' ') || [];
      state = state_zip_parts[0] || '';
      zip = state_zip_parts[1] || '';
    } else if (location_parts.length === 4) {
      address = `${location_parts[0]} ${location_parts[1]}` || '';
      city = location_parts[2] || '';
      const state_zip = location_parts[3] || '';
      const state_zip_parts = state_zip?.trim().split(' ') || [];
      state = state_zip_parts[0] || '';
      zip = state_zip_parts[1] || '';
    }



    const listed_by_elem = await waitForSelector('div.ds-listing-agent-header', 5000, 'appear').catch(err => console.log(err.message));
    const listed_by = listed_by_elem ? $('div.ds-listing-agent-header')?.text().replace('Listed by ', '').trim() : '';
    const phone = listed_by_elem ? $('li.ds-listing-agent-info-text').text() : '';

    const url = getCurrentUrl();


    console.log(`%c ${i}. | ${title} | ${address} | ${city} | ${state} | ${zip} | ${phone} | ${listed_by} | ${rent_price} |`, 'background: #ffe257; color: Black');
    console.log(url);

    const listing = { title, address, city, state, zip, listed_by, rent_price };
    x.listings.push(listing);
    console.log('listings::', x.listings);

    await sleep(2100);

    // close listing
    const closeBtn_sel = 'button.ds-close-lightbox-icon';
    const closeBtn_elem = await waitForSelector(closeBtn_sel, 5000, 'appear');
    await clickElement(closeBtn_elem);
    await waitForSelector(closeBtn_sel, 5000, 'disappear');
    console.log('END\n\n');

    // some delay
    await sleep(1300);

    i++;
  }


  return x;
};



export default extractListings;
