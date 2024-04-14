<template>
  <div class="container">
    <h2>Scraper Options</h2>

    <form @submit.prevent="saveOpts" class="form-horizontal">
      <div class="form-group">
        <label for="apiKey" class="col-sm-2 control-label">API Key:</label>
        <div class="col-sm-10">
          <input type="text" id="apiKey" v-model="dex8JointapiKey" class="form-control">
        </div>
      </div>

      <div class="form-group">
        <label for="collName" class="col-sm-2 control-label">Collection (table):</label>
        <div class="col-sm-10">
          <input type="text" id="collName" v-model="collectionName" @keyup="removeEmptySpaces" class="form-control">
        </div>
      </div>

      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" class="btn btn-primary">SAVE</button>
          <span class="text-muted text-success" style="font-weight:bold;margin-left:13px;" v-if="msg">{{ msg }}</span>
        </div>
      </div>
    </form>

  </div>
</template>




<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    ///// DEFINE VARS /////
    const dex8JointapiKey = ref('');
    const collectionName = ref('');
    const msg = ref('');


    ///// DEFINE FUNCS /////
    /**
     * Get options from storage and set it on the page
     */
    const setOpts = () => {
      chrome.storage.sync.get(['dex8JointapiKey', 'collectionName'], function (result) {
        const apiKey = result.dex8JointapiKey || '';
        const collName = result.collectionName || '';
        console.log('setOpts-dex8JointapiKey::', apiKey);
        console.log('setOpts-collectionName::', collName);
        dex8JointapiKey.value = apiKey;
        collectionName.value = collName;
      });
    }


    /**
    * Submit form and save options in storage.
    */
    const saveOpts = () => {
      const apiKey = dex8JointapiKey.value;
      const collName = collectionName.value;
      console.log('saveOpts-dex8JointapiKey::', apiKey);
      console.log('saveOpts-collectionName::', collName);
      chrome.storage.sync.set({ dex8JointapiKey: apiKey }, () => { });
      chrome.storage.sync.set({ collectionName: collName }, () => { });
      showMessage('The options are saved!')
    };


    /**
     *
     * @param {number} ms - how long the messge will be displayed
     */
    const showMessage = async (message, ms = 3000) => {
      msg.value = message;
      await new Promise(r => setTimeout(r, ms));
      msg.value = '';
    };


    const removeEmptySpaces = () => {
      collectionName.value = collectionName.value.replace(' ', '_');
    }


    ///// INIT /////
    setOpts();


    //// RETURN /////
    return {
      dex8JointapiKey,
      collectionName,
      msg,
      saveOpts,
      removeEmptySpaces
    };

  }
});
</script>
