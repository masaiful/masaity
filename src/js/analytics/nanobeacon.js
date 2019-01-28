const MAX_SIZE = 65536;

export default function nanobeacon(url, data = {}) {
  if (window.navigator && !window.navigator.sendBeacon) {
    console.error('nanobeacon: window.navigator.beacon not found.');
  }

  let json;
  try {
    json = JSON.stringify(data);
  } catch (e) {
    throw new Error('nanobeacon: could not stringify data');
  }

  if (json.length > MAX_SIZE) {
    console.error(
      `nanobeacon: data should be smaller than ${MAX_SIZE}, but it was ${
        json.length
      } bytes.`
    );
    return false;
  }

  const blob = new window.Blob([json], { type: 'text/plain; charset=UTF-8' });

  // Hello friend, if you are debugging and end up here
  // you probably have doNotTrack, and we are too fair
  // for our own good :))))
  if (window.navigator.doNotTrack || !window.navigator.sendBeacon) {
    return false;
  }

  return window.navigator.sendBeacon(url, blob);
}
