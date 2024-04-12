class R{constructor(){this.activeOns=[]}emit(t,e={}){const s=new CustomEvent(t,{detail:e});window.dispatchEvent(s)}on(t,e){const s=i=>{e.call(null,i)};this._removeOne(t,e),this.activeOns.push({eventName:t,listener:e,listenerWindow:s}),window.addEventListener(t,s)}once(t,e){const s=i=>{e.call(null,i),this._removeOne(t,e,s)};window.addEventListener(t,s,{once:!0})}off(t,e){this._removeOne(t,e)}offAll(t){let e=0;for(const s of this.activeOns)s.eventName===t&&(window.removeEventListener(s.eventName,s.listenerWindow),this.activeOns.splice(e,1)),e++}getListeners(t){let e=[...this.activeOns];return e=e.filter(s=>s.eventName===t),e}_removeOne(t,e){if(!e)throw new Error("eventEmitter._removeOne Error: listener is not defined");let s=0;for(const i of this.activeOns)i.eventName===t&&i.listener.toString()===e.toString()&&(window.removeEventListener(i.eventName,i.listenerWindow),this.activeOns.splice(s,1)),s++}}const A=n=>new Promise((t,e)=>{if(document.readyState==="complete"||document.readyState==="interactive")t();else{const s=setTimeout(()=>{e(new Error("Timeout waiting for DOMContentLoaded"))},n);document.addEventListener("DOMContentLoaded",()=>{clearTimeout(s),t()})}}),j=(n,t,e="appear")=>new Promise((s,i)=>{const r=Date.now(),l=document.querySelector(n);if(e==="appear"&&l||e==="disappear"&&!l){s(l);return}const d=new MutationObserver(x=>{const u=document.querySelector(n);(e==="appear"&&u||e==="disappear"&&!u)&&(d.disconnect(),s(u))});d.observe(document.body,{childList:!0,subtree:!0});const c=()=>{Date.now()-r>=t?(d.disconnect(),i(new Error(`Timeout waiting for selector to ${e}: ${n}`))):setTimeout(c,100)};c()}),F=n=>new Promise((t,e)=>{const s=document.querySelector(n);if(!s){e(new Error(`Element with selector "${n}" not found`));return}function i(r){s.removeEventListener("click",i),t(r)}s.addEventListener("click",i),s.click()}),C=n=>new Promise((t,e)=>{if(!n||!(n instanceof Element)){e(new Error("Invalid element provided"));return}function s(i){n.removeEventListener("click",s),t(i)}n.addEventListener("click",s),n.click()}),M=(n,t)=>{const e=document.querySelectorAll(n),s=[],i=new Set;return e.forEach(r=>{const l=r.getAttribute(t);l&&!i.has(l)&&(i.add(l),s.push(r))}),s},B=()=>new Promise(n=>{const t=()=>{window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}),window.innerHeight+window.pageYOffset<document.body.offsetHeight?setTimeout(t,1e3):n()};t()}),H=(n,t,e)=>new Promise(s=>{const i=document.querySelector(n);if(!i)throw new Error(`Element with selector "${n}" not found`);const r=()=>{t?i.scrollTop+=t:i.scrollTop=i.scrollHeight,i.scrollTop+i.clientHeight<i.scrollHeight?setTimeout(r,e):s()};r()}),N=()=>window.location.href||document.URL,U=async n=>{await new Promise(t=>setTimeout(t,n))},W={waitForDOMLoad:A,waitForSelector:j,clickSelector:F,clickElement:C,listElemsUniq:M,scrollPageToBottom:B,scrollElement:H,getCurrentUrl:N,sleep:U};class q{constructor(t={},e){this.debug=t.debug,this.msDelay=t.msDelay||0,this.eventEmitter=e,this.eventEmitter.on("ff-start",()=>{this.debug&&this._debugger3(this.start.name),this.status="start"}),this.eventEmitter.on("ff-stop",()=>{this.debug&&this._debugger3(this.stop.name),this.status="stop"}),this.eventEmitter.on("ff-pause",()=>{this.debug&&this._debugger3(this.pause.name),this.status="pause"}),this.x,this.lib,this.status="start",this.delayID1,this.delayID2,this.goTo,this.lastExecuted={method:"",args:[]},this.iteration=0,this.iteration_max,this.jumpTo,this.msPause=365*24*60*60*1e3,this.runtimeTest=!1}xInject(t){this.x=t}libInject(t){this.lib=t}libAdd(t){this.lib=Object.assign(this.lib,t)}libRemove(){this.lib=null}libList(){return this.lib?Object.keys(this.lib):[]}async _serialExe(t,e){let s=0;for(;s<t.length&&(this.goTo&&this.goTo>=0&&this.goTo<t.length&&(s=this.goTo,this.goTo=void 0),this.status==="pause"&&!this.runtimeTest&&await this._delayPause(this.msPause),!(this.status==="stop"&&!this.runtimeTest));){if(this.status==="next"&&!this.runtimeTest){this.status="start";break}const i=t[s];this.debug&&this._debugger1(e,i,s),this.x=await i(this.x,this.lib),this.msDelay&&await this._delayFunction(this.msDelay),s++}}async serial(t){return this.lastExecuted={method:this.serial.name,args:Array.from(arguments)},await this._serialExe(t,this.serial.name),this.x}async serialEach(t,e){this.lastExecuted={method:this.serialEach.name,args:Array.from(arguments)};let s=0;for(const i of e)this.lib.serialEachElement=i,this.lib.serialEachKey=s,await this._serialExe(t,this.serialEach.name),s++;return delete this.lib.serialEachElement,delete this.lib.serialEachKey,this.x}async serialRepeat(t,e){this.lastExecuted={method:this.serialRepeat.name,args:Array.from(arguments)};for(let s=1;s<=e;s++)this.lib.serialRepeatIteration=s,await this._serialExe(t,this.serialRepeat.name);return delete this.lib.serialRepeatIteration,this.x}async one(t){return this.lastExecuted={method:this.one.name,args:Array.from(arguments)},this.status==="pause"&&await this._delayPause(this.msPause),this.status==="stop"?this.x:(this.debug&&this._debugger1(this.one.name,t,0),this.x=await t(this.x,this.lib),this.msDelay&&await this._delayFunction(this.msDelay),this.x)}async parallelAll(t){this.lastExecuted={method:this.parallelAll.name,args:Array.from(arguments)},this.debug&&this._debugger1(this.parallelAll.name,{name:""},"all");const e=t.map(s=>s(this.x,this.lib));return this.x=await Promise.all(e),this.msDelay&&await this._delayFunction(this.msDelay),this.x}async parallelRace(t){this.lastExecuted={method:this.parallelRace.name,args:Array.from(arguments)},this.debug&&this._debugger1(this.parallelRace.name,{name:""},"race");const e=t.map(s=>s(this.x,this.lib));return this.x=await Promise.race(e),this.msDelay&&await this._delayFunction(this.msDelay),this.x}async repeat(t){this.iteration=0,this.iteration_max=t;const e=this.lastExecuted.method,s=this.lastExecuted.args;let i=1;for(;i<=t&&(this.iteration=i,this.status==="pause"&&await this._delayPause(this.msPause),!(this.status==="stop"||this.jumpTo===1/0));)this.debug&&this._debugger2(this.iteration,this.repeat.name,e),this.x=await this[e](...s),this.jumpTo?(i=this.jumpTo,this.jumpTo=void 0):i++;return this.x}stop(){if(this.status==="start")this.eventEmitter.emit("ff-stop"),this.status="stop";else throw new Error('Stop not allowed. Status must be "start".')}pause(){if(this.status==="start")this.eventEmitter.emit("ff-pause"),this.status="pause";else throw new Error('Pause not allowed. Status must be "start".')}start(){if(this.status==="pause"||this.status==="stop")this.eventEmitter.emit("ff-start"),this.status="start",this.delaysRemove();else throw new Error('Start not allowed. Status must be "pause" or "stop".')}go(t){this.debug&&this._debugger3(this.go.name,` to function ${t}`);const e=this.lastExecuted.args[0];if(Number.isInteger(t)){if(t<0)throw new Error('Index "goTo" can not be negative number.');if(t>=e.length)throw new Error(`Index "goTo" should be less then ${e.length}`)}else throw new Error('Index "goTo" must be integer.');this.goTo=t}next(){this.debug&&this._debugger3(this.next.name),this.status="next"}jump(t){if(this.debug&&this._debugger3(this.jump.name,` to iteration ${t}`),Number.isInteger(t)){if(t<0)throw new Error('Iteration "jumpTo" can not be negative number.')}else throw new Error('Iteration "jumpTo" must be integer.');this.jumpTo=t}break(){this.debug&&this._debugger3(this.break.name),this.jumpTo=1/0}async delay(t){this.debug&&this._debugger3(this.delay.name,t),await new Promise(e=>setTimeout(e,t))}async delayRnd(t=0,e=1e3){const s=e-t;let i=t+s*Math.random();i=Math.round(i),await this.delay(i)}delaysRemove(){clearTimeout(this.delayID1),clearTimeout(this.delayID2)}_delayFunction(t){return this.delaysRemove(),new Promise(s=>{this.delayID1=setTimeout(s,t)})}_delayPause(){return this.delaysRemove(),new Promise(e=>{if(this.status==="pause"){const s=()=>{e(),this.eventEmitter.off("ff-start",s)};this.eventEmitter.on("ff-start",s)}this.delayID2=setTimeout(e,3*24*60*60*1e3)})}_debugger1(t,e,s){console.log(`
--- ${t} --- ${this.status} --- [${s}] ${e.name} (${this.msDelay} ms) --- x:: ${console.log(this.x,{depth:0,colors:!0})}`)}_debugger2(t,e,s){console.log(`

-------------- ${t}. ${e}/${s} --------------`)}_debugger3(t,e){console.log(`
   === ${t} ${e||""} ===
`)}}const K=async(n,t)=>{const e=t.domPlus;return console.log("----- scrollListings ----"),await e.scrollElement("div#search-page-list-container",500,1e3),await e.sleep(1300),console.log(" scrolling finished"),n},L=async(n,t)=>{var _;const e=t.ff,{listElemsUniq:s,clickElement:i,waitForSelector:r,getCurrentUrl:l,sleep:d}=t.domPlus;console.log("----- extractListings ----");let c=s("div#grid-search-results>ul>li article>div>div>a","href");c=Array.from(c);const x=c.map(y=>y.getAttribute("href"));console.log("listing_hrefs::",x);let u=1;for(const y of c){if(e.status==="pause"&&await e._delayPause(365*24*60*60*1e3),e.status==="stop")break;console.log("START"),await i(y),await r("div.data-column-container h1",5e3,"appear").catch(a=>console.log(a.message));let E="",m="",w="",g="",f="",p="";const b=$('span[data-testid="price"]').text();console.log(`%c ${u}. rent_price: ${b}`,"background: #ffe257; color: Black"),b?m=$('div[data-testid="summary"] h1').text():(E=$('h1[data-test-id="bdp-building-title"]').text(),m=$('h2[data-test-id="bdp-building-address"]').text()||$('p[data-test-id="bdp-building-address"]').text());const o=(m==null?void 0:m.split(","))||[];if(o.length===3){w=o[0]||"",g=o[1]||"";const a=o[2]||"",h=(a==null?void 0:a.trim().split(" "))||[];f=h[0]||"",p=h[1]||""}else if(o.length===2){g=o[0]||"";const a=o[1]||"",h=(a==null?void 0:a.trim().split(" "))||[];f=h[0]||"",p=h[1]||""}else if(o.length===4){w=`${o[0]} ${o[1]}`||"",g=o[2]||"";const a=o[3]||"",h=(a==null?void 0:a.trim().split(" "))||[];f=h[0]||"",p=h[1]||""}const T=await r("div.ds-listing-agent-header",5e3,"appear").catch(a=>console.log(a.message)),P=T?(_=$("div.ds-listing-agent-header"))==null?void 0:_.text().replace("Listed by ","").trim():"",D=T?$("li.ds-listing-agent-info-text").text():"",I=l();console.log(`%c ${u}. | ${E} | ${w} | ${g} | ${f} | ${p} | ${D} | ${P} | ${b} |`,"background: #ffe257; color: Black"),console.log(I);const O={title:E,address:w,city:g,state:f,zip:p,listed_by:P,rent_price:b};n.listings.push(O),console.log("listings::",n.listings),await d(2100);const k="button.ds-close-lightbox-icon",S=await r(k,5e3,"appear");await i(S),await r(k,5e3,"disappear"),console.log(`END

`),await d(1300),u++}return n},z=async n=>{const t=window.dex8.eventEmitter,e=new q({debug:!1,msDelay:3400},t),s={listingElems:[],listings:[]};e.xInject(s),e.libInject({input:n,domPlus:W,eventEmitter:t,ff:e}),await e.serial([K,L,L]),await e.repeat(1e3)};console.log("ZILLOW SCRAPER - forground script works !");window.dex8={};let v=!1;chrome.runtime.onMessage.addListener(async(n,t,e)=>{const s=new R;if(window.dex8.eventEmitter=s,console.log(n),n==="scraper/start"){if(v){console.error("The scraper is already started");return}v=!0,await z({}),v=!1}else n==="scraper/pause"?s.emit("ff-pause"):n==="scraper/stop"?s.emit("ff-stop"):n==="scraper/resume"&&s.emit("ff-start")});
