class i{constructor(e="sync"){this.storageType=e}get(e){return new Promise((o,t)=>{chrome.storage[this.storageType].get(e,n=>{n||t(new Error("No storageObj")),o(n)})})}set(e){return new Promise((o,t)=>{chrome.storage[this.storageType].set(e,()=>{o()})})}}const r=async(a,e,o="GET")=>{const t={method:o,headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}};return await(await fetch(a,t)).json()},d=async()=>{const e=await new i("sync").get(["dex8JointapiKey","dex8JointapiUrl","databaseId","collectionName"]),o=e.dex8JointapiKey,t=e.dex8JointapiUrl,n=e.databaseId,s=e.collectionName||"general";return await r(`${t}/joint-api/mongo/${n}/${s}/list`,o)},l=async()=>{const e=await new i("sync").get(["dex8JointapiKey","dex8JointapiUrl","databaseId","collectionName"]),o=e.dex8JointapiKey,t=e.dex8JointapiUrl,n=e.databaseId,s=e.collectionName||"general",c=await r(`${t}/joint-api/mongo/${n}/${s}/empty`,o,"DELETE");return console.log("delete-apiresp::",c),c};chrome.runtime.onMessage.addListener(async(a,e,o)=>{console.log("service-Worker:request::",a);try{a.route==="joint-api/delete-all-data"&&await l();const t=await d();chrome.runtime.sendMessage({route:"saved-data",payload:t})}catch(t){console.error(t)}});console.log("chrome.action 1",chrome.action);chrome.action.onClicked.addListener(a=>{console.log("Action button clicked 1")});
