// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js');

import { getSavedData, deleteAllSavedData } from './service_worker_jointAPIcaller';


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('service-Worker:request::', request);
  // console.log('sender::', sender);
  // sendResponse({ success: true, request }); // return message back to sender

  try {
    if (request.route === 'joint-api/delete-all-data') { await deleteAllSavedData(); }

    const savedData_count = await getSavedData();
    chrome.runtime.sendMessage({ route: 'saved-data', payload: savedData_count });

  } catch (err) {
    console.error(err);
  }

});
