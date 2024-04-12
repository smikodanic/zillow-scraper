/**
 * FunctionFlow helper.
 */
class FunctionFlow {

  /**
   * @param {object} opts - options: {debug, msDelay}
   * @param {EventEmitter} eventEmitter
   */
  constructor(opts = {}, eventEmitter) {

    // options
    this.debug = opts.debug; // to use debugger or not
    this.msDelay = opts.msDelay || 0; // delay after each function

    // event emitter listeners
    this.eventEmitter = eventEmitter; // use external eventEmitter to listen events 'ff-start', 'ff-pause' or 'ff-stop'
    this.eventEmitter.on('ff-start', () => { if (this.debug) { this._debugger3(this.start.name); } this.status = 'start'; });
    this.eventEmitter.on('ff-stop', () => { if (this.debug) { this._debugger3(this.stop.name); } this.status = 'stop'; });
    this.eventEmitter.on('ff-pause', () => { if (this.debug) { this._debugger3(this.pause.name); } this.status = 'pause'; });

    // global variable
    // window.dex8.functionFlow = this;

    // function arguments - func(x, lib)
    this.x;
    this.lib;

    // operational properties
    this.status = 'start'; // start | stop | pause
    this.delayID1; // setTimeout ID _delayFunction()
    this.delayID2; // setTimeout ID _delayPause()
    this.goTo; // go to funcs index (a function within serial(funcs) method)

    // iteration properties
    this.lastExecuted = { method: '', args: [] }; // last executed FunctionFlow bundle method (serial, serialEach, serialRepeat, one, parallel, ...)
    this.iteration = 0; // current iteration in repeat method
    this.iteration_max; // max number of iterations which can be reached by repeat() method - defined with n in repeat(n) method
    this.jumpTo; // jump to repeat() iteration
    this.msPause = 365 * 24 * 60 * 60 * 1000; // maximal pause interval: (31 536 000 000 ms = 365 days)
    this.runtimeTest = false;

    // listen for runtime commands: s,p,r,x, i, ...
    // this.listen();
  }



  /*============================== X - this.x ==============================*/
  /**
   * Inject x (transitioanl variable) into function first parameter - func(x, lib)
   * @param {Object} x - injected input - {a: 8, b: 'Something ...'}
   */
  xInject(x) {
    this.x = x;
  }



  /*============================== LIB - this.lib ==============================*/
  /**
   * Inject libraries like Bluebird promises, Cheerio, Puppeteer, ...etc. into function second parameter - func(x, lib)
   * @param {Object} lib - injected library - {BPromis, puppeteer, cheerio}
   */
  libInject(lib) {
    this.lib = lib;
  }

  /**
   * Add libraries to libraries already injected by libInject()
   * @param {Object} lib2 - libraries which will be added to existing this.lib
   */
  libAdd(lib2) {
    this.lib = Object.assign(this.lib, lib2);
  }

  /**
   * Remove all libraries.
   */
  libRemove() {
    this.lib = null;
  }

  /**
   * List all libraries.
   * @returns {Array}
   */
  libList() {
    const lib_arr = this.lib ? Object.keys(this.lib) : [];
    return lib_arr;
  }





  /*============================== FUNCTION  BUNDLES ==============================*/

  /****************************** A) S E R I A L ******************************/
  async _serialExe(funcs, methodName) {
    let i = 0;
    while (i < funcs.length) {

      // redefine i with this.goTo
      if (!!this.goTo && this.goTo >= 0 && this.goTo < funcs.length) {
        i = this.goTo; // redefine i
        this.goTo = undefined; // reset goTo
      }

      if (this.status === 'pause' && !this.runtimeTest) { await this._delayPause(this.msPause); }
      if (this.status === 'stop' && !this.runtimeTest) { break; }
      if (this.status === 'next' && !this.runtimeTest) { this.status = 'start'; break; }

      const func = funcs[i];

      if (this.debug) { this._debugger1(methodName, func, i); }

      this.x = await func(this.x, this.lib);

      if (!!this.msDelay) { await this._delayFunction(this.msDelay); }

      i++;
    } // \while
  }


  /**
   * Execute funcs functions one by one.
   * input------>|--f0-->|msDelay|--f3-->|msDelay|--f2-->|msDelay|------>output
   * @param {Array} funcs - array of functions - [f0, f3, f2]
   */
  async serial(funcs) {
    this.lastExecuted = { method: this.serial.name, args: Array.from(arguments) };

    await this._serialExe(funcs, this.serial.name);

    return this.x;
  }


  /**
   * Execute funcs functions one by one and repeat it for every array element.
   * input------>|--f0-->|msDelay|--f3-->|msDelay|--f2-->|msDelay|------>output
   *             |                                            arr|
   *             |<--------------repeat arr.length --------------|
   * @param {Array} funcs - array of functions - [f0, f3, f2]
   * @param {Array} arr - array
   */
  async serialEach(funcs, arr) {
    this.lastExecuted = { method: this.serialEach.name, args: Array.from(arguments) };

    let key = 0;
    for (const elem of arr) {
      this.lib.serialEachElement = elem;
      this.lib.serialEachKey = key;
      await this._serialExe(funcs, this.serialEach.name);
      key++;
    }

    delete this.lib.serialEachElement;
    delete this.lib.serialEachKey;

    return this.x;
  }


  /**
   * Execute funcs functions one by one and repeat it n times.
   * input------>|--f0-->|msDelay|--f3-->|msDelay|--f2-->|msDelay|------>output
   *             |                                              n|
   *             |<-------------------repeat n ------------------|
   * @param {Array} funcs - array of functions - [f0, f3, f2]
   * @param {Number} n - how many times to repet the serial
   */
  async serialRepeat(funcs, n) {
    this.lastExecuted = { method: this.serialRepeat.name, args: Array.from(arguments) };

    for (let i = 1; i <= n; i++) {
      this.lib.serialRepeatIteration = i;
      await this._serialExe(funcs, this.serialRepeat.name);
    }

    delete this.lib.serialRepeatIteration;

    return this.x;
  }



  /****************************** B) O N E ******************************/
  /**
   * Execute just one function.
   * input------>|--func1-->|msDelay|-------->output
   * @param {Function} func - a function which will be executed once
   */
  async one(func) {
    this.lastExecuted = { method: this.one.name, args: Array.from(arguments) };

    if (this.status === 'pause') { await this._delayPause(this.msPause); }
    if (this.status === 'stop') { return this.x; }

    if (this.debug) { this._debugger1(this.one.name, func, 0); }

    this.x = await func(this.x, this.lib);

    if (!!this.msDelay) { await this._delayFunction(this.msDelay); }

    return this.x;
  }





  /***************************** C) P A R A L E L L *******************************/
  /**
   * Take any defined function and execute simultaneously. All defined functions must return fulfilled promises.
   * Input is same for all functions.
   * Returned value is an array of resolved values.
   *          --> |--------- f2(x) ---------->---|
   * -- input --> |--------- f4(x) ------->------|msDelay|---> [r2, r4, r8]
   *          --> |--------- f8(x) ------------->|
    * @param {Array} funcs - array of functions - [f2, f4, f8]
   */
  async parallelAll(funcs) {
    this.lastExecuted = { method: this.parallelAll.name, args: Array.from(arguments) };
    if (this.debug) { this._debugger1(this.parallelAll.name, { name: '' }, 'all'); }

    const promisArr = funcs.map(func => {
      return func(this.x, this.lib);
    });

    this.x = await Promise.all(promisArr);

    if (!!this.msDelay) { await this._delayFunction(this.msDelay); }

    return this.x;
  }



  /**
   * Run functions in paralell. Fastest function must return fulfilled promise.
   * Returned value is value from first resolved function.
   *          --> |--------- f2(x) --------|-->
   * -- input --> |--------- f4(x) ------->|msDelay|---> r4
   *          --> |--------- f8(x) --------|----->
    * @param {Array} funcs - array of functions - [f2, f4, f8]
   */
  async parallelRace(funcs) {
    this.lastExecuted = { method: this.parallelRace.name, args: Array.from(arguments) };
    if (this.debug) { this._debugger1(this.parallelRace.name, { name: '' }, 'race'); }

    const promisArr = funcs.map(func => {
      return func(this.x, this.lib);
    });

    this.x = await Promise.race(promisArr);

    if (!!this.msDelay) { await this._delayFunction(this.msDelay); }

    return this.x;
  }





  /*============================== ITERATION  METHODS ==============================*/

  /**
   * Repeat last executed FunctionFlow bundle method n times.
   * input -->|----------serial------------->|----> output
   *          |                             n|
   *          |<---------repeat n------------|
   * @param {Number} n - how many times to repeat last method
   */
  async repeat(n) {
    this.iteration = 0; // resetting iteration
    this.iteration_max = n; // max number of iterations
    const method = this.lastExecuted.method;
    const args = this.lastExecuted.args;

    let i = 1;
    while (i <= n) {
      this.iteration = i;

      if (this.status === 'pause') { await this._delayPause(this.msPause); } // pause repeat
      if (this.status === 'stop' || this.jumpTo === Infinity) { break; } // stop all repeats and exit

      if (this.debug) { this._debugger2(this.iteration, this.repeat.name, method); }

      this.x = await this[method](...args);

      if (!!this.jumpTo) { // stop only current repeat - redefine i with this.jumpTo
        i = this.jumpTo;
        this.jumpTo = undefined; // reset "jumpTo" for the next "repeat()" usage
      } else { // increase i if jumpTo is undefined
        i++;
      }

    }

    return this.x;
  }






  /*============================== COMMANDS ==============================*/
  /**
   * Stop FunctionFlow only if status is 'start'.
   */
  stop() {
    if (this.status === 'start') {
      this.eventEmitter.emit('ff-stop');
      this.status = 'stop';
    } else {
      throw new Error('Stop not allowed. Status must be "start".');
    }
  }


  /**
   * Pause FunctionFlow only if status is 'start'.
   */
  pause() {
    if (this.status === 'start') {
      this.eventEmitter.emit('ff-pause');
      this.status = 'pause';
    } else {
      throw new Error('Pause not allowed. Status must be "start".');
    }
  }


  /**
   * Start/restart FunctionFlow only if status is 'pause' or 'stop'.
   */
  start() {
    if (this.status === 'pause' || this.status === 'stop') {
      this.eventEmitter.emit('ff-start');
      this.status = 'start';
      this.delaysRemove();
    } else {
      throw new Error('Start not allowed. Status must be "pause" or "stop".');
    }
  }


  /**
   * Go to function used in serial(funcs) method.
   * When that function is executed continue with next function in funcs array.
   * @param {Number} goTo - funcs array index in serial(funcs) -- 0 >= goTo > funcs.length
   */
  go(goTo) {
    if (this.debug) { this._debugger3(this.go.name, ` to function ${goTo}`); }

    const funcs = this.lastExecuted.args[0];

    // prechecks
    if (!Number.isInteger(goTo)) { throw new Error('Index "goTo" must be integer.'); }
    else if (goTo < 0) { throw new Error('Index "goTo" can not be negative number.'); }
    else if (goTo >= funcs.length) { throw new Error(`Index "goTo" should be less then ${funcs.length}`); }

    this.goTo = goTo;
  }


  /**
   * Stop execution of all funcs functions in serial(funcs) method and continue with next serial, one or parallel method.
   * Use it as ff.next() inside function.
   * "next" will work only inside serial() method.
   */
  next() {
    if (this.debug) { this._debugger3(this.next.name); }
    this.status = 'next';
  }



  /**
   * Jump to iteration number defined in repeat(n) method. The current iteration will finish with all its functions.
   * When that iteration is executed continue with next iteration in repeat(n) method.
   * @param {Number} jumpTo - redefined iteration -- 0 >= jumpTo > n   (n is max number of iterations)
   */
  jump(jumpTo) {
    if (this.debug) { this._debugger3(this.jump.name, ` to iteration ${jumpTo}`); }

    // prechecks
    if (!Number.isInteger(jumpTo)) { throw new Error('Iteration "jumpTo" must be integer.'); }
    else if (jumpTo < 0) { throw new Error('Iteration "jumpTo" can not be negative number.'); }

    this.jumpTo = jumpTo;
  }


  /**
   * Breaks all iterations defined in repeat(n). The current iteration will finish with all its functions.
   */
  break() {
    if (this.debug) { this._debugger3(this.break.name); }

    this.jumpTo = Infinity;
  }






  /*============================== HELPERS ==============================*/
  /**
   * Make delay.
   * @param {Number} ms - delay in miliseconds. If ms=-1 then infinite delay.
   */
  async delay(ms) {
    if (this.debug) { this._debugger3(this.delay.name, ms); }
    await new Promise(resolve => setTimeout(resolve, ms));
  }


  /**
   * Randomize delay between min and max miliseconds.
   * @param {Number} msMin - min miliseconds: 3000
   * @param {Number} msMax - max miliseconds: 5000
   */
  async delayRnd(msMin = 0, msMax = 1000) {
    const diff = msMax - msMin;
    let ms = msMin + diff * Math.random(); // Math.random() gives number between 0 and 1
    ms = Math.round(ms);
    await this.delay(ms);
  }


  /**
   * Remove all delays instantly.
   */
  delaysRemove() {
    clearTimeout(this.delayID1);
    clearTimeout(this.delayID2);
  }







  /*============================== PRIVATE METHODS ==============================*/
  /*=============================================================================*/

  /*============================== DELAYS ==============================*/
  /**
   * Make delay after function.
   * @param {Number} msDelay - delay in miliseconds. If msDelay=-1 then infinite delay.
   */
  _delayFunction(msDelay) {
    this.delaysRemove(); // initially remove previous delays
    const promis = new Promise(resolve => {
      this.delayID1 = setTimeout(resolve, msDelay); // keep promis in 'pending' state until setTimeout is not finished
    });

    return promis;
  }


  /**
   * Make big, pause delay.
   */
  _delayPause() {
    this.delaysRemove(); // initially remove previous delays

    /* promis will be resolved either by eventEmitter or by setTimeout */
    const promis = new Promise(resolve => {
      // keep promis in 'pending' state until 'start' event come
      if (this.status === 'pause') {
        const cb = () => { resolve(); this.eventEmitter.off('ff-start', cb); };
        this.eventEmitter.on('ff-start', cb);
      }

      // keep promis in 'pending' state until setTimeout is not finished
      this.delayID2 = setTimeout(resolve, 3 * 24 * 60 * 60 * 1000); // delay of 3 days
    });

    return promis;
  }


  /*============================== DEBUGGERS ==============================*/
  /**
   * Debug function execution.
   * @param {String} methodName - FunctionFlow method name
   * @param {Function} func - function
   * @param {Number} i - function index
   */
  _debugger1(methodName, func, i) {
    console.log(`\n--- ${methodName} --- ${this.status} --- [${i}] ${func.name} (${this.msDelay} ms) --- x:: ${console.log(this.x, { depth: 0, colors: true })}`);
  }

  /**
   * Debug repetitions (iteration).
   * @param {Number} i - repeat iteration number
   * @param {String} repeatMethod - FunctionFlow repeat method name
   * @param {String} methodName - FunctionFlow method name
   */
  _debugger2(i, repeatMethod, methodName) {
    console.log(`\n\n-------------- ${i}. ${repeatMethod}/${methodName} --------------`);
  }

  /**
   * Debug commands.
   * @param {String} methodName
   */
  _debugger3(methodName, label) {
    console.log(`\n   === ${methodName} ${label || ''} ===\n`);
  }


}




export default FunctionFlow;
