import nanobeacon from './nanobeacon';

const errorLogger = prefix => (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(prefix, ...args);
  }
};

export default function MicroAnalytics(url, defaultData = {}) {
  if (!(this instanceof MicroAnalytics)) {
    return new MicroAnalytics(url, defaultData);
  }

  this.log = errorLogger('microanalytics');
  this.defaultData = defaultData;
  this.url = url;
}

MicroAnalytics.prototype.append = function(data) {
  let _data = {...this.defaultData, ...data};
  console.log(this.url, _data);
  let ok = nanobeacon(this.url, _data);
  if (ok) {
    this.log('append: sent data', _data);
  }
  if (!ok) {
    this.log('append: could not send data', _data);
  }
};

MicroAnalytics.prototype.batch = function() {
  let self = this;
  let cache = [];
  return {
    append: function(data) {
      let _data = {...self.defaultData, ...data};
      cache.push(_data);
    },
    flush: function() {
      let ok = nanobeacon(self.url, cache);
      if (!ok) {
        self.log('batch.flush: could not send data', cache);
      }
    }
  };
};
