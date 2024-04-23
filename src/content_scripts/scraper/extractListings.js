import HTTPClientBro from '@mikosoft/httpclient-bro';
import ChromeStorage from '../libs/chromeStorage';


const extractListings = async (x, lib) => {
  const ff = lib.ff;
  const $ = lib.$;
  const { listElemsUniq, clickElement, waitForSelector, getCurrentUrl, sleep } = lib.domPlus;

  chrome.runtime.sendMessage({ route: 'echo', payload: '----- extractListings ----' }).catch(err => console.error('[extractListings.ja]', err.message));
  // get DEX8 JointAPI Key and the collection name
  const chromeStorage = new ChromeStorage('sync');
  const storageObj = await chromeStorage.get(['dex8JointapiKey', 'dex8JointapiUrl', 'databaseId', 'collectionName']);
  const dex8JointapiKey = storageObj.dex8JointapiKey;
  const dex8JointapiUrl = storageObj.dex8JointapiUrl;
  const databaseId = storageObj.databaseId;
  const collectionName = storageObj.collectionName || 'general';

  // HTTP Client
  const opts = {
    encodeURI: false,
    timeout: 8000,
    responseType: '', // 'blob' for file download (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
    retry: 3,
    retryDelay: 5500,
    maxRedirects: 3,
    headers: {
      authorization: `Bearer ${dex8JointapiKey}`,
      accept: '*/*' // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    }
  };
  const httpClientBro = new HTTPClientBro(opts);


  let listing_elems = listElemsUniq('div#grid-search-results>ul>li article>div>div>a', 'href');
  listing_elems = Array.from(listing_elems); // unique elems
  const listing_hrefs = listing_elems.map(le => le.getAttribute('href'));

  console.log('listing_hrefs::', listing_hrefs);
  chrome.runtime.sendMessage({ route: 'echo', payload: `Listings found: ${listing_hrefs.length}` }).catch(err => console.error('[extractListings.ja]', err.message));

  let i = 1;
  for (const listing_elem of listing_elems) {
    // PAUSE - 365 days
    if (ff.status === 'pause') { await ff._delayPause(365 * 24 * 60 * 60 * 1000); }
    if (ff.status === 'stop') { chrome.runtime.sendMessage({ route: 'echo', payload: 'STOP' }).catch(err => console.error('[extractListings.ja]', err.message)); break; }

    /* open listing */
    await clickElement(listing_elem);
    await waitForSelector('div.data-column-container h1', 5000, 'appear').catch(err => console.error(err.message));

    /* extract listing data */
    let title = '';
    let location = '';
    let address = '';
    let city = '';
    let state = '';
    let zip = '';


    // detect page type
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


    const listed_by_elem = await waitForSelector('div.ds-listing-agent-header', 5000, 'appear').catch(err => console.error(err.message));
    const listed_by = listed_by_elem ? $('div.ds-listing-agent-header')?.text().replace('Listed by ', '').trim() : ''; // management company

    const display_name = $('li > span.ds-listing-agent-display-name').text() || ''; // Leasing Agent
    const business_name = $('li > span.ds-listing-agent-business-name').text() || ''; // Pepper Pike Capital Partners
    const phone = $('li.ds-listing-agent-info-text').text() || ''; // (947) 223-2425

    const listing_url = getCurrentUrl();

    const listing_msg = `${i}. | ${title} | ${address} | ${city} | ${state} | ${zip} || ${display_name} | ${business_name} | ${phone} | ${listed_by} | ${rent_price} |`;
    console.log(listing_url);
    console.log(`%c ${listing_msg}`, 'background: #ffe257; color: Black');
    chrome.runtime.sendMessage({ route: 'echo', payload: listing_url }).catch(err => console.error('[extractListings.ja]', err.message));
    chrome.runtime.sendMessage({ route: 'echo', payload: listing_msg }).catch(err => console.error('[extractListings.ja]', err.message));

    const listing = { title, address, city, state, zip, display_name, business_name, phone, listed_by, rent_price, listing_url };
    x.listings.push(listing);
    console.log(' listing::', listing);

    await sleep(2100);


    /* save listing */
    console.log(' save listings ...');
    const apiURL = `${dex8JointapiUrl}/joint-api/mongo/${databaseId}/${collectionName}/update`;
    const apiBody = {
      moQuery: { listing_url },
      docNew: listing,
      updOpts: {
        new: true, // return updated document as 'result'
        upsert: true, // whether to create the doc if it doesn't match (false)
        runValidators: false, // validators validate the update operation against the model's schema
        strict: false // values not defined in schema will not be saved in db (default is defined in schema options, and can be overwritten here)
      }
    };
    const answer = await httpClientBro.askJSON(apiURL, 'PUT', apiBody);
    console.log(' DEX8 JointAPI answer::', answer);


    /* close listing */
    const closeBtn_sel = 'button.ds-close-lightbox-icon';
    const closeBtn_elem = await waitForSelector(closeBtn_sel, 5000, 'appear').catch(err => console.error(err.message));
    await clickElement(closeBtn_elem);
    await waitForSelector(closeBtn_sel, 8000, 'disappear').catch(err => console.error(err.message));

    // some delay
    await sleep(1300);

    i++;
  }


  return x;
};



export default extractListings;
