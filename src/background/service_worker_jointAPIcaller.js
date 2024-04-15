// This file can be imported inside the service worker,
// which means all of its functions and variables will be accessible
// inside the service worker.
// The importation is done in the file `service-worker.js`.

import ChromeStorage from '../content_scripts/libs/chromeStorage.js';


const askJSON = async (url, dex8JointapiKey, method = 'GET') => {
  const requestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${dex8JointapiKey}`
    }
  };
  const fetchObj = await fetch(url, requestOptions);
  const apiResp = await fetchObj.json();
  return apiResp;
};


const getSavedData = async () => {
  // get DEX8 JointAPI Key and the collection name
  const chromeStorage = new ChromeStorage('sync');
  const storageObj = await chromeStorage.get(['dex8JointapiKey', 'collectionName']);
  const dex8JointapiKey = storageObj.dex8JointapiKey;
  const collectionName = storageObj.collectionName || 'general';

  const apiResp = await askJSON(`http://localhost:8001/joint-api/mongo/661b8006581671204326cd81/${collectionName}/list`, dex8JointapiKey);

  return apiResp;
};


const deleteAllSavedData = async () => {
  // get DEX8 JointAPI Key and the collection name
  const chromeStorage = new ChromeStorage('sync');
  const storageObj = await chromeStorage.get(['dex8JointapiKey', 'collectionName']);
  const dex8JointapiKey = storageObj.dex8JointapiKey;
  const collectionName = storageObj.collectionName || 'general';

  const apiResp = await askJSON(`http://localhost:8001/joint-api/mongo/661b8006581671204326cd81/${collectionName}/empty`, dex8JointapiKey, 'DELETE');
  console.log('delete-apiresp::', apiResp);

  return apiResp;
};




export { askJSON, getSavedData, deleteAllSavedData };
