import _ from 'underscore';

class Eval {
  static resolve (obj, context) {
    if (obj.v in context) {
      return context[obj.v];
    } else {
      return obj.d;
    }
  }
}

class Not {
  static resolve (obj) {
    return !obj.v;
  }
}

class Bool {
  static resolve (obj) {
    if (obj.v instanceof Object) {
      return !_.isEmpty(obj.v);
    } else {
      return Boolean(obj.v);
    }
  }
}

class And {
  static resolve (obj) {
    return _.all(obj.s);
  }
}

class Or {
  static resolve (obj) {
    return _.any(obj.s);
  }
}

class Equal {
  static resolve (obj) {
    return _.isEqual(obj.s1, obj.s2);
  }
}

class Greater {
  static resolve (v) {
    const value = {};
    _.extend(value, v);
    value.s1 = Number(value.s1);
    value.s2 = Number(value.s2);
    if (value.e) {
      return value.s1 >= value.s2;
    } else {
      return value.s1 > value.s2;
    }
  }
}

class Less {
  static resolve (v) {
    const value = {};
    _.extend(value, v);
    value.s1 = Number(value.s1);
    value.s2 = Number(value.s2);
    if (value.e) {
      return value.s1 <= value.s2;
    } else {
      return value.s1 < value.s2;
    }
  }
}

class If {
  static resolve (obj) {
    return obj.c ? obj.t : obj.e;
  }
}

class In {
  static resolve (obj) {
    if (_.isArray(obj.v)) {
      return _.contains(obj.v, obj.k);
    } else {
      return _.has(obj.v, obj.k);
    }
  }
}

class Get {
  static resolve (obj) {
    if (obj.v) {
      const res = obj.v[obj.k];
      const result = _.isUndefined(res) ? obj.d : res;
      if (_.isObject(result) && result.rec_name) {
        return result.id;
      }
      return result;
    }
    return obj.d;
  }
}

class Len {
  static resolve (obj) {
    return _.size(obj.v);
  }
}

export {
  Eval, Not, Bool, And, Or, Equal, Greater, Less, If, In, Get, Len,
};
