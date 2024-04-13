import { Controller, corelib } from '@mikosoft/dodo';
import navbar from '../views/inc/navbar.html?raw';
import main from '../views/pages/popup/main.html?raw';



export default class PopupCtrl extends Controller {

  constructor(app) {
    super();
  }

  async __loader(trx) {
    this.setTitle('DoDo - Single Page App Framework');
    this.setDescription('DoDo is JS framework for single page applications.');
    this.setKeywords('dodo, framework, javascript, js, single page app, spa');
    this.setLang('en');
    this.loadView('#navbar', navbar);
    this.loadView('#main', main);
  }

  async __init(trx) {
    this.scraperStatus = 'stop'; // start, stop, pause
    this.showcontrols = {
      start: true,
      stop: false,
      pause: false,
      resume: false
    };
    console.log('init');
  }



  startScraper() {
    console.log('Start the scraping process');
    this.sendMessageToContentScript('scraper/start');
    this.scraperStatus = 'start';
    this._showControls();
  }

  pauseScraper() {
    console.log('Pause the scraping process');
    this.sendMessageToContentScript('scraper/pause');
    this.scraperStatus = 'pause';
    this._showControls();
  }

  stopScraping() {
    console.log('Stop the scraping process');
    this.sendMessageToContentScript('scraper/stop');
    this.scraperStatus = 'stop';
    this._showControls();
  }

  resumeScraper() {
    console.log('Resume the paused scraping process');
    this.sendMessageToContentScript('scraper/resume');
    this.scraperStatus = 'start';
    this._showControls();
  }


  // Send message to the content script using chrome.tabs.sendMessage()
  sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log('tabs::', tabs);
      const activeTab = tabs[0]; // Query for the active tab in the current window
      chrome.tabs.sendMessage(activeTab.id, message); // Send message to the content script of the active tab
    });
  }

  _showControls() {
    if (this.scraperStatus === 'start') {
      this.showControls = {
        start: false,
        stop: true,
        pause: true,
        resume: false
      };
    } else if (this.scraperStatus === 'pause') {
      this.showControls = {
        start: false,
        stop: false,
        pause: false,
        resume: true
      };
    } else if ((this.scraperStatus === 'stop')) {
      this.showControls = {
        start: true,
        stop: false,
        pause: false,
        resume: false
      };
    }
  }


  // listen messages from content script
  listenMessageFromContentScript(message) {

  }

}
