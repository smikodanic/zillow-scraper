import HTTPClientBro from '@mikosoft/httpclient-bro';
import ChromeStorage from '../libs/chromeStorage';


const saveListings = async (x, lib) => {

  console.log('----- saveListings ----');
  // get DEX8 JointAPI Key
  const chromeStorage = new ChromeStorage('sync');
  const storageObj = await chromeStorage.get(['dex8JointapiKey', 'dex8JointapiUrl', 'databaseId', 'collectionName']);
  const dex8JointapiKey = storageObj.dex8JointapiKey;
  const dex8JointapiUrl = storageObj.dex8JointapiUrl;
  const databaseId = storageObj.databaseId;
  const collectionName = storageObj.collectionName || 'general';

  // save data in the MongoDB
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
  const answer = httpClientBro.askJSON(`${dex8JointapiUrl}/joint-api/mongo/${databaseId}/${collectionName}/update`);
  console.log('answer::', answer);


  return x;
};



export default saveListings;
