// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js');

import { getSavedData, deleteAllSavedData } from './service_worker_jointAPIcaller';


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('[service_worker.js] request::', request);
  // console.log('sender::', sender);
  // sendResponse({ success: true, request }); // return message back to sender

  try {
    if (request.route === 'joint-api/delete-all-data') { await deleteAllSavedData(); }

    const savedData_count = await getSavedData();
    console.log('savedData_count::', savedData_count);
    chrome.runtime.sendMessage({ route: 'saved-data', payload: savedData_count }).catch(err => console.error('[service_worker.js]', err.message));

  } catch (err) {
    console.error(err);
  }

});





// This will not work if "default_popup": "./action/popup.html" is defined in manifest.json
// chrome.action.onClicked.addListener((tab) => {
//   console.log('Action button clicked 1');
// });
