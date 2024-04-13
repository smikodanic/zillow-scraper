import { corelib } from '@mikosoft/dodo';

// default HTTP client
const opts = {
  encodeURI: true,
  timeout: 21000,
  responseType: '', // 'blob' for file download (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
  retry: 0,
  retryDelay: 1300,
  maxRedirects: 0,
  headers: {
    'authorization': '',
    'accept': '*/*', // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
    'content-type': 'text/html; charset=UTF-8'
  }
};
const $httpClient = new corelib.HTTPClient(opts);

export { $httpClient };


