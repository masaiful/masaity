import microanalytics from './microanalytics';
import nanoid from 'nanoid/index.browser.js';

/**
 * Custom analytics, with minimal tracking (page view, referrer, session ID for de-duplication).
 * Does not capture IPs, and respects DoNotTrack
 */
const ANALYTICS_ENDPOINT = process.env.ANALYTICS_ENDPOINT;
const ANALYTICS_ID = process.env.ANALYTICS_ID;

const EVENTS = {
  PageView: 'pageView',
};

let analytics;
let clientId;

export function init() {
  analytics = microanalytics(ANALYTICS_ENDPOINT);
  clientId = getClientId();

  if (process.env.NODE_ENV === 'production') {
    if (document.readyState === 'loading') {
      // Loading hasn't finished yet, add listener
      document.addEventListener('DOMContentLoaded', _ev => {
        trackInbound();
      });
    } else {
      // DOMContentLoaded has already fired
      trackInbound();
    }
  } else {
    // In development, show only a log
    console.log(
      'Analytics debug mode',
      { ANALYTICS_ENDPOINT, ANALYTICS_ID },
      getWithDefaults(EVENTS.PageView, { sourceUrl: document.referrer })
    );
  }
}

function trackPageView() {
  analytics.append(getWithDefaults(EVENTS.PageView));
}

function trackInbound() {
  analytics.append(
    getWithDefaults(EVENTS.PageView, {
      sourceUrl: document.referrer,
    })
  );
}

function getWithDefaults(event, opts = {}) {
  return {
    siteId: ANALYTICS_ID,
    clientId: clientId,
    event: event,
    pathname: getPathname(),
    ...opts,
  };
}

//
// Global getters

function getClientId() {
  let clientId = 'NA';
  const localStorageKey = '__analytics__';

  try {
    const config = JSON.parse(window.localStorage.getItem(localStorageKey));
    if (config && config.clientId) {
      clientId = config.clientId;
    } else {
      try {
        const config = {
          clientId: nanoid(),
        };
        window.localStorage.setItem(localStorageKey, JSON.stringify(config));
        clientId = config.clientId;
      } catch (e) {
        console.warn('Error while setting clientId, "NA" will be used', e);
      }
    }
  } catch (e) {
    console.warn('Error while setting clientId, "NA" will be used', e);
  }

  return clientId;
}

function getPathname() {
  return window.location.pathname;
}
