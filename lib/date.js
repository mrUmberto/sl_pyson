import moment from 'moment/moment';
import _ from 'underscore';

function dtHelper ({y, M, d, h = 0, m = 0, s = 0, ms = 0, utc = moment}) {
  let values = {
    y: y,
    M: M,
    D: d,
    h: h,
    m: m,
    s: s,
    ms: ms,
  };
  values = _.compactObject(values);
  const r = utc();
  r.set(values);
  r.isDate = true;
  return r.local();
}

function timedelta ({dy = 0, dM = 0, dd = 0, dh = 0, dm = 0, ds = 0, dms = 0}) {
  let values = {
    y: dy,
    M: dM,
    d: dd,
    h: dh,
    m: dm,
    s: ds,
    ms: dms,
  };
  const r = moment.duration(_.compactObject(values));
  r.isTimeDelta = true;
  return r;
}

function dt (obj, items, deltas, fn) {
  let keys = [].concat(items, deltas);
  let dtObject = _.mapObject(_.pick(obj, keys));

  if (dtObject.M) {
    dtObject.M -= 1;
  }
  if (dtObject.ms) {
    dtObject.ms /= 1000;
  }

  const dt = fn(dtObject);
  const dur = timedelta(dtObject);
  return dt.add(dur);
}

class Date {
  static resolve (obj) {
    const items = ['y', 'M', 'd'];
    const deltas = ['dy', 'dM', 'dd'];
    return dt(obj, items, deltas, dtHelper).format('YYYY-MM-DD');
  }
}

class DateTime {
  static resolve (obj) {
    const items = ['y', 'M', 'd', 'h', 'm', 's', 'ms'];
    const deltas = ['dy', 'dM', 'dd', 'dh', 'dm', 'ds', 'dms'];
    return dt(obj, items, deltas, dtHelper);
  }
}

export {Date, DateTime};
