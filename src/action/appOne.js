import { AppOne } from '@mikosoft/dodo';

// conf
import { $httpClient, $debugOpts } from './conf/index.js';

// controllers
import PopupCtrl from './controllers/PopupCtrl.js';

// app
const appOne = new AppOne('myChromeExtension');
appOne
  // .httpClient($httpClient)
  .debug($debugOpts)
  .controller(PopupCtrl);



