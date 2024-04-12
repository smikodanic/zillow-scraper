/** get options from storage's "opts" parameter and set it on the page **/
function setOpts() {
  chrome.storage.sync.get(['opts'], function (result) {
    const opts = result.opts;
    console.log('setOpts-opts::', opts);

    // set attributes
    const checkbox_elems = document.querySelectorAll('input[name="attrs"]');
    for (let i = 0; i < checkbox_elems.length; i++) {
      const checkbox_elem = checkbox_elems[i];
      checkbox_elem.checked = opts.attrs.includes(checkbox_elem.value);
    }

    // set nth radio
    const radio_elems = document.querySelectorAll('input[name="nth"]');
    for (let i = 0; i < radio_elems.length; i++) {
      const radio_elem = radio_elems[i];
      radio_elem.checked = opts.nth === radio_elem.value;
    }

    // set attributes
    const checkbox2_elems = document.querySelectorAll('input[name="debug"]');
    for (let i = 0; i < checkbox2_elems.length; i++) {
      const checkbox2_elem = checkbox2_elems[i];
      checkbox2_elem.checked = opts.debug;
    }

  });
}
setOpts();




/** save in storage as 'opts' parameter **/
function saveOpts() {
  // get attributes
  const attrs = [];
  const checkbox_elems = document.querySelectorAll('input[name="attrs"]');
  for (let i = 0; i < checkbox_elems.length; i++) {
    const checkbox_elem = checkbox_elems[i];
    if (checkbox_elem.checked) { attrs.push(checkbox_elem.value); }
  }

  // get nth
  let nth = '';
  const radio_elems = document.querySelectorAll('input[name="nth"]');
  for (let i = 0; i < radio_elems.length; i++) {
    const radio_elem = radio_elems[i];
    if (radio_elem.checked) { nth = radio_elem.value; }
  }

  // get debug
  let debug = false;
  const checkbox2_elems = document.querySelectorAll('input[name="debug"]');
  for (let i = 0; i < checkbox2_elems.length; i++) {
    const checkbox2_elem = checkbox2_elems[i];
    if (checkbox2_elem.checked) { debug = true; }
  }

  const opts = { attrs, nth, debug };
  console.log('saveOpts-opts::', opts);

  chrome.storage.sync.set({ opts }, () => { });
}

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', saveOpts);



