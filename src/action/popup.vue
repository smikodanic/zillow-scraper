<template>
  <header class="row">
    <div class="col-md-12">
      <!-- image -->
      <div class="text-center">
        <img src="/resources/img/zillow-long.png" height="54" alt="Zillow">
      </div>

      <!-- commands -->
      <div class="text-center" style="margin-top:21px;">
        <button class="btn btn-sm btn-primary" @click="startScraper" v-if="btnStart">
          <i class="fa fa-play"></i> START
        </button>
        <button class="btn btn-sm btn-primary" @click="resumeScraper" v-if="btnResume">
          <i class="fa fa-play-circle"></i> RESUME
        </button>
        <button class="btn btn-sm btn-primary" @click="pauseScraper" v-if="btnPause">
          <i class="fa fa-pause"></i> PAUSE
        </button>
        <button class="btn btn-sm btn-primary" @click="stopScraper" v-if="btnStop">
          <i class="fa fa-stop"></i> STOP
        </button>
      </div>

      <!-- spinner -->
      <p class="text-center" style="margin-top:21px;">
        <i class="fa fa-refresh fa-spin fa-fw" style="color: gray" v-if="btnPause"></i>
      </p>

      <!-- echo -->
      <p class="text-center overflow-x-auto" style="margin-top:21px;">
        <span class="text-success">{{ echoMsg }}</span>
      </p>
    </div>
  </header>

  <main class="row"></main>

  <footer class="row">
    <p class="text-center">
      <a :href="urlPopup" target="_blank">Preview data</a> &middot;
      <a :href="urlOptions" target="_blank">Options</a>
    </p>
  </footer>

</template>



<script>
import { defineComponent, ref } from "vue";
import { BrowserStorage } from "@mikosoft/cookie-storage";

export default defineComponent({
  setup() {
    // browser local storage
    const storageOpts = { storageType: "local" };
    const browserStorage = new BrowserStorage(storageOpts);

    // chrome extension ID
    const urlPopup = `chrome-extension://${chrome.runtime.id}/action/popup.html`;
    const urlOptions = `chrome-extension://${chrome.runtime.id}/options/opt.html`;

    // INIT
    let btnStart = ref(true);
    let btnStop = ref(false);
    let btnPause = ref(false);
    let btnResume = ref(false);
    let echoMsg = ref('');

    const showButtons = () => {
      if (scraperStatus === "start") {
        btnStart.value = false;
        btnStop.value = true;
        btnPause.value = true;
        btnResume.value = false;
      } else if (scraperStatus === "pause") {
        btnStart.value = false;
        btnStop.value = false;
        btnPause.value = false;
        btnResume.value = true;
      } else if (scraperStatus === "stop") {
        btnStart.value = true;
        btnStop.value = false;
        btnPause.value = false;
        btnResume.value = false;
      } else {
        btnStart.value = true;
        btnStop.value = false;
        btnPause.value = false;
        btnResume.value = false;
      }
      console.log("scraperStatus::", scraperStatus);
    };


    let scraperStatus = browserStorage.get("scraperStatus"); // start, stop, pause
    console.log("scraperStatus::", scraperStatus);
    showButtons();

    const startScraper = () => {
      console.log("Start the scraping process");
      sendMessageToContentScript("scraper/start");
      scraperStatus = "start";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    const pauseScraper = () => {
      console.log("Pause the scraping process");
      sendMessageToContentScript("scraper/pause");
      scraperStatus = "pause";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    const stopScraper = () => {
      console.log("Stop the scraping process");
      sendMessageToContentScript("scraper/stop");
      scraperStatus = "stop";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    const resumeScraper = () => {
      console.log("Resume the paused scraping process");
      sendMessageToContentScript("scraper/resume");
      scraperStatus = "start";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    // Send message to the content script using chrome.tabs.sendMessage()
    const sendMessageToContentScript = (message) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("tabs::", tabs);
        const activeTab = tabs[0]; // Query for the active tab in the current window
        chrome.tabs.sendMessage(activeTab.id, message); // Send message to the content script of the active tab
      });
    };

    // listen for message sent from content_scripts/foreground.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('foreground message:', message);
      echoMsg.value = message;
    });

    return {
      urlPopup,
      urlOptions,
      btnStart,
      btnStop,
      btnPause,
      btnResume,
      echoMsg,
      startScraper,
      stopScraper,
      pauseScraper,
      resumeScraper,
    };
  },
});
</script>
