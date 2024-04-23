import { createApp } from 'vue';
import Popup from './popup.vue';

createApp(Popup).mount('#app');


// execute every time the popup is opened
const onInit = () => {
  console.log('[popup.js] INIT POPUP');
  chrome.runtime.sendMessage('INIT POPUP'); // send message to service_worker.js and call dex8 joint-api to fetch saved data
};
onInit();
