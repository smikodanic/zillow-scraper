// Importing and using functionality from external files is also possible.
// importScripts('service-worker-utils.js');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log('request::', request);
  // console.log('sender::', sender);
  // sendResponse({ success: true, request }); // return message back to sender
});
