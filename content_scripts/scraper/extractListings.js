window.dex8.extractListings = async (x, lib) => {
  const { listElemsUniq, clickElement, waitForSelector, getCurrentUrl, sleep } = lib.domPlus;

  console.log('----- extractListings ----');
  let listing_elems = listElemsUniq('div#grid-search-results>ul>li article>div>div>a', 'href');
  listing_elems = Array.from(listing_elems); // unique elems
  const listing_hrefs = listing_elems.map(le => le.getAttribute('href'));

  console.log('listing_hrefs::', listing_hrefs);


  for (const listing_elem of listing_elems) {
    console.log('START');
    // open listing
    await clickElement(listing_elem);
    await waitForSelector('h1[data-test-id="bdp-building-title"]', 5000, 'appear');

    // extract listing data
    const title = $('h1[data-test-id="bdp-building-title"]').text();

    const location = $('h2[data-test-id="bdp-building-address"]').text();
    const location_parts = location?.split(',') || [];
    const address = location_parts[0] || '';
    const city = location_parts[1] || '';
    const state_zip = location_parts[2] || '';
    const state_zip_parts = state_zip?.trim().split(' ') || [];
    const state = state_zip_parts[0] || '';
    const zip = state_zip_parts[1] || '';

    await waitForSelector('div.ds-listing-agent-header', 5000, 'appear');
    let listed_by = $('div.ds-listing-agent-header').text();
    listed_by = listed_by?.replace('Listed by ', '').trim();

    const phone = $('li.ds-listing-agent-info-text').text();

    const url = getCurrentUrl();


    console.info(`${title} | ${address} | ${city} | ${state} | ${zip} | ${phone} | ${listed_by}`);
    console.info(url);

    // close listing
    const closeBtn_sel = 'button.ds-close-lightbox-icon';
    const closeBtn_elem = await waitForSelector(closeBtn_sel, 5000, 'appear');
    await clickElement(closeBtn_elem);
    await waitForSelector(closeBtn_sel, 5000, 'disappear');
    console.log('END\n\n');

    // some delay
    await sleep(1300);
  }

};
