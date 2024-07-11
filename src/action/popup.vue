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
        <i class="fa fa-refresh fa-spin fa-fw" style="color: gray" v-if="showSpinner"></i>
      </p>

      <!-- echo -->
      <p class="text-center" style="margin-top:21px; white-space:nowrap; overflow-x:scroll;">
        MESSAGES
        <br><span :class="echoClass">{{ echoMsg }}</span>
      </p>
    </div>
  </header>

  <main class="row">
    <div class="col-md-12">

      <!-- download -->
      <p class="text-center" style="margin-top:34px;">
        <a id="downloadCVSfile" class="btn btn-md btn-success">
          <i class="fa fa-download"></i> DOWNLOAD ({{ savedData_count }})
        </a>
      </p>

      <!-- delete -->
      <p class="text-center" style="margin-top:13px;">
        <button class="btn btn-md btn-danger" @click="deleteAllData">
          <i class="fa fa-times"></i> DELETE ALL ({{ savedData_count }})
        </button>
      </p>
    </div>
  </main>

  <footer class="row">
    <p class="text-center">
      <!-- <a :href="urlPopup" target="_blank">Preview data</a> &middot; -->
      <a :href="urlOptions" target="_blank">Options</a>
    </p>
  </footer>

</template>



<script>
import { defineComponent, ref } from "vue";
import { BrowserStorage } from "@mikosoft/cookie-storage";
import Csv from './lib/Csv.js'

export default defineComponent({
  setup() {
    // browser local storage
    const storageOpts = { storageType: "local" };
    const browserStorage = new BrowserStorage(storageOpts);

    // chrome extension ID
    const urlPopup = `chrome-extension://${chrome.runtime.id}/action/data.html`;
    const urlOptions = `chrome-extension://${chrome.runtime.id}/options/opt.html`;

    // INIT
    let btnStart = ref(true);
    let btnStop = ref(false);
    let btnPause = ref(false);
    let btnResume = ref(false);
    let echoMsg = ref('');
    let echoClass = ref('text-success');
    let savedData_count = ref(0);
    let savedData = []; // array of objects
    let showSpinner = ref(false);


    const showButtons = () => {
      if (scraperStatus === "start") {
        btnStart.value = false;
        btnStop.value = true;
        btnPause.value = true;
        btnResume.value = false;
        showSpinner.value = true;
      } else if (scraperStatus === "pause") {
        btnStart.value = false;
        btnStop.value = false;
        btnPause.value = false;
        btnResume.value = true;
        showSpinner.value = false;
      } else if (scraperStatus === "stop") {
        btnStart.value = true;
        btnStop.value = false;
        btnPause.value = false;
        btnResume.value = false;
        showSpinner.value = false;
      } else {
        btnStart.value = true;
        btnStop.value = false;
        btnPause.value = false;
        btnResume.value = false;
        showSpinner.value = false;
      }
      console.log("[popup.vue]scraperStatus::", scraperStatus);
    };


    let scraperStatus = browserStorage.get("scraperStatus"); // start, stop, pause
    console.log("[popup.vue]initial scraperStatus::", scraperStatus);
    showButtons();

    const startScraper = () => {
      console.log("[popup.vue] Start the scraping process");
      sendMessageToContent_script("scraper/start");
      scraperStatus = "start";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    const pauseScraper = () => {
      console.log("[popup.vue] Pause the scraping process");
      sendMessageToContent_script("scraper/pause");
      scraperStatus = "pause";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    const stopScraper = () => {
      console.log("[popup.vue] Stop the scraping process");
      sendMessageToContent_script("scraper/stop");
      scraperStatus = "stop";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };

    const resumeScraper = () => {
      console.log("[popup.vue] Resume the paused scraping process");
      sendMessageToContent_script("scraper/resume");
      scraperStatus = "start";
      browserStorage.put("scraperStatus", scraperStatus);
      showButtons();
    };



    // Send message to the content script using chrome.tabs.sendMessage()
    const sendMessageToContent_script = (message) => {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const activeTab = tabs[0]; // Query for the active tab in the current window

        // Send message to the content script of the active tab
        await chrome.tabs.sendMessage(activeTab.id, message).catch(err => {
          if (err.message === 'Could not establish connection. Receiving end does not exist.') {
            echoMsg.value = 'Reload Zillow page and start again.';
            // chrome.tabs.reload(activeTab.id); // reload zillow.com page
          } else {
            echoMsg.value = err.message;
          }
          echoClass.value = 'text-danger';
          stopScraper();
        });

      });
    };



    /*** --- ROUTER --- (listen for message sent from content_scripts/foreground.js and backgroun/service-worker.js) ***/
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[popup.vue] foreground message:', message);
      const payload = message.payload;
      if (message.route === 'echo') {
        echoMsg.value = payload;
        echoClass.value = 'text-success';

      } else if (message.route === 'echo-error') { // see content_scripts/foreground.js
        echoMsg.value = payload;
        echoClass.value = 'text-danger';
        stopScraper();

      } else if (message.route === 'saved-data') {

        if (payload.data) {
          savedData_count.value = payload.count || 0;
          savedData = payload.data;
          console.log('[popup.vue]savedData::', savedData);
          createBlob(savedData);

        } else if (payload.error_message) {
          echoMsg.value = payload.error_message;
          echoClass.value = 'text-danger';
          stopScraper();
        }

      }

    });


    /*** CSV DOWNLAD ***/
    const createBlob = (savedData) => {
      // const first = savedData[0];
      // if (!first) { return; }
      // delete first._id;
      // delete first.__v;
      // delete first.created_at;
      // delete first.updated_at;
      // const fields = Object.keys(first) || [];
      const fields = ['address', 'city', 'state', 'zip', 'display_name', 'business_name', 'phone', 'listed_by', 'listing_url'];
      const csvOpts = {
        fields,
        fieldDelimiter: ',',
        fieldWrapper: '"',
        rowDelimiter: '\n'
      };
      const csv = new Csv(csvOpts);
      const csvString = fields + '\n' + csv._rows2str(savedData); // Convert the JSON data to a CSV string
      const blob = new Blob([csvString], { type: 'text/csv' }); // Create a Blob object from the CSV string

      const url = URL.createObjectURL(blob); // Create a URL for the Blob object

      // anchor element
      const a = document.querySelector('a#downloadCVSfile');
      a.href = url;
      a.download = 'zillowData.csv'; // Specify the filename for the downloaded file

      setTimeout(() => {
        URL.revokeObjectURL(url); // Cleanup the URL object
      }, 8000)
    }


    /*** DELET ALL DATA FROM MONGO COLLECTION */
    const deleteAllData = () => {
      chrome.runtime.sendMessage({ route: "joint-api/delete-all-data", payload: "" }).catch(err => console.error('[popup.vue]', err.message)); // send message to background service_worker
    }


    return {
      savedData_count,
      urlPopup,
      urlOptions,
      btnStart,
      btnStop,
      btnPause,
      btnResume,
      showSpinner,
      echoMsg,
      echoClass,
      startScraper,
      stopScraper,
      pauseScraper,
      resumeScraper,
      deleteAllData
    };
  },
});


</script>
