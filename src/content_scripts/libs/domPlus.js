const waitForDOMLoad = (timeout) => {
  // Wrap the whole thing in a promise
  return new Promise((resolve, reject) => {
    // Check if the document is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      resolve();
    } else {
      // Otherwise, wait for the DOMContentLoaded event
      const timer = setTimeout(() => {
        reject(new Error('Timeout waiting for DOMContentLoaded'));
      }, timeout);

      document.addEventListener('DOMContentLoaded', () => {
        clearTimeout(timer);
        resolve();
      });
    }
  });
};



const waitForSelector = (selector, timeout, tip = 'appear') => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    // Check if the selector is already present
    const element = document.querySelector(selector);
    if ((tip === 'appear' && !!element) || (tip === 'disappear' && !element)) {
      resolve(element);
      return;
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(mutations => {
      // Check if the selector is now present
      const element = document.querySelector(selector);
      if ((tip === 'appear' && !!element) || (tip === 'disappear' && !element)) {
        observer.disconnect(); // Stop observing
        resolve(element);
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Check for timeout
    const checkTimeout = () => {
      if (Date.now() - startTime >= timeout) {
        observer.disconnect(); // Stop observing
        reject(new Error(`Timeout waiting for selector to ${tip}: ${selector}`));
      } else {
        // Check again after a short delay
        setTimeout(checkTimeout, 100);
      }
    };

    // Start the timeout check
    checkTimeout();
  });
};



// You can access event properties like clickEvent.target, clickEvent.clientX, etc.
const clickSelector = (selector) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (!element) {
      reject(new Error(`Element with selector "${selector}" not found`));
      return;
    }

    // Define the event listener function
    function handleClick(event) {
      // Remove the event listener to avoid multiple triggers
      element.removeEventListener('click', handleClick);
      // Resolve the promise with the event
      resolve(event);
    }

    // Attach the event listener to the element
    element.addEventListener('click', handleClick);

    // Simulate a click event on the element
    element.click();
  });
};


// You can access event properties like clickEvent.target, clickEvent.clientX, etc.
const clickElement = (element) => {
  return new Promise((resolve, reject) => {
    if (!element || !(element instanceof Element)) {
      reject(new Error('Invalid element provided'));
      return;
    }

    // Define the event listener function
    function handleClick(event) {
      // Remove the event listener to avoid multiple triggers
      element.removeEventListener('click', handleClick);
      // Resolve the promise with the event
      resolve(event);
    }

    // Attach the event listener to the element
    element.addEventListener('click', handleClick);

    // Simulate a click event on the element
    element.click();
  });
};



const listElemsUniq = (cssSelector, attribute) => {
  const elements = document.querySelectorAll(cssSelector);
  const uniqueElements = [];
  const seen = new Set(); // Using a Set to track seen attribute values

  elements.forEach(element => {
    const value = element.getAttribute(attribute);
    if (value && !seen.has(value)) {
      seen.add(value);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
};


const scrollPageToBottom = (timeout = 1000) => {
  return new Promise(resolve => {
    const scrollStep = () => {
      // Scroll to the bottom of the page
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth' // Optionally, you can use 'auto' for immediate scrolling
      });

      // Check if the scroll position is still not at the bottom
      if (window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
        setTimeout(scrollStep, timeout);
      } else {
        resolve();
      }
    };

    // Start scrolling
    scrollStep();
  });
};




/**
 *
 * @param {string} cssSelector
 * @param {number} scrollHeight - pixels , if scrollheight is not defined scroll to page bottom
 * @param {number} timeout - ms
 * @returns {Promise<void>}
 */
const scrollElement = (cssSelector, scrollHeight, timeout) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(cssSelector);
    if (!element) {
      reject(`Element with selector "${cssSelector}" not found`);
    }

    const scrollStep = () => {
      if (!!scrollHeight) {
        element.scrollTop += scrollHeight; // Scroll by certain height
      } else {
        element.scrollTop = element.scrollHeight; // Scroll to the bottom of the element
      }

      // Check if the scroll position is still not at the bottom
      if (element.scrollTop + element.clientHeight < element.scrollHeight) {
        setTimeout(scrollStep, timeout);
      } else {
        resolve();
      }
    };

    // Start scrolling
    scrollStep();
  });
};


const getCurrentUrl = () => {
  return window.location.href || document.URL;
};


const sleep = async (ms) => {
  await new Promise(r => setTimeout(r, ms));
};


export default {
  waitForDOMLoad,
  waitForSelector,
  clickSelector,
  clickElement,
  listElemsUniq,
  scrollPageToBottom,
  scrollElement,
  getCurrentUrl,
  sleep,
};
