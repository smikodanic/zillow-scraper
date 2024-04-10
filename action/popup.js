// import HTTPClient from './assets/js/HTTPClient.js';



class Popup {

  constructor() {
    // const opts = {
    //   encodeURI: false,
    //   timeout: 8000,
    //   responseType: '', // 'blob' for file download (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
    //   retry: 3,
    //   retryDelay: 5500,
    //   maxRedirects: 3,
    //   headers: {
    //     'authorization': '',
    //     'accept': '*/*', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    //     'content-type': 'text/html; charset=UTF-8'
    //   }
    // };
    // this.httpClient = new HTTPClient(opts);

    this.registerListeners();
  }


  startScraping() {
    console.log('Start the scraping process');
    this.sendMessageToContentScript('start scraper');
  }



  // Send message to the content script using chrome.tabs.sendMessage()
  sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('tabs::', tabs);
      const activeTab = tabs[0]; // Query for the active tab in the current window
      chrome.tabs.sendMessage(activeTab.id, message); // Send message to the content script of the active tab
    });
  }


  // LISTENERS
  registerListeners() {
    $(document).ready(() => {
      $('button#startScraping').click(this.startScraping.bind(this));
    });
  }


  // UTILS
  async blinkMsg(css_sel, msg) {
    $(css_sel).text(msg);
    await this.sleep(2100);
    $(css_sel).text('');
  }

  async sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
  }

}


new Popup();
