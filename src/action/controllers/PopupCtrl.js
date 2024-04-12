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
    console.log('init() -- trx::', trx);
    console.log('init() -- navig::', corelib.navig);
    console.log('init() -- ctrl::', this);
    this.something = 'smthng';
  }

  // if rend() is not defined then this.render() is used
  // async __rend(trx) {
  //   console.log('rend() -- trx::', trx);
  //   await this.ddUNLISTEN();
  //   this.ddHref();
  // }

  async __postrend(trx) {
    console.log('postrend() -- trx::', trx);
  }

  async __destroy() {
    console.log('destroy() -- navig::', corelib.navig);
    console.log('destroy() -- ctrl::', this);
    this.unloadCSS(['https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism-coy.min.css']);
    this.unloadJS();
  }

}
