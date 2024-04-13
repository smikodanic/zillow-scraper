<template>
  <div class="container">
    <h2>Scraper Options</h2>

    <form @submit.prevent="saveOpts" class="form-horizontal">
      <div class="form-group">
        <label for="apiKey" class="col-sm-2 control-label">API Key:</label>
        <div class="col-sm-10">
          <input type="text" id="apiKey" v-model="formFields.dex8JointapiKey" class="form-control">
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
    const formFields = ref({ dex8JointapiKey: '' });
    const msg = ref('');


    ///// DEFINE FUNCS /////
    /**
     * Get options from storage's "opts" parameter and set it on the page
     */
    const setOpts = () => {
      chrome.storage.sync.get(['opts'], function (result) {
        const opts = result.opts;
        console.log('setOpts-opts::', opts);
        formFields.value = opts && opts.dex8JointapiKey ? opts : { dex8JointapiKey: '' };
      });
    }


    /**
    * Submit form and save in storage as 'opts' parameter.
    */
    const saveOpts = () => {
      const opts = formFields.value; // {dex8JointapiKey, }
      console.log('saveOpts-opts::', opts);
      chrome.storage.sync.set({ opts }, () => { });
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


    ///// INIT /////
    setOpts();


    //// RETURN /////
    return {
      formFields,
      msg,
      saveOpts
    };

  }
});
</script>
