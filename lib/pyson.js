import _ from 'underscore';
import * as plainClasses from './plain';
import * as dateClasses from './date';

const pysonClasses = Object.assign({}, plainClasses, dateClasses);
export default class Pyson {
    constructor() {
        _.mixin({
            compactObject: (o) => {
                let clone = _.clone(o);
                _.each(clone, (v, k) => {
                    if (v === undefined) {
                        delete clone[k];
                    }
                });
                return clone;
            },
        });
    }

    resolve(obj, context) {
        obj = JSON.parse(JSON.stringify(obj));
        if (!_.isObject(obj) && !_.isArray(obj)) {
            return obj;
        }
        _.map(obj, (value, key) => {
            if (_.isObject(value) && value.__class__) {
                obj[key] = this.resolve(value, context);
            }
            if (_.isArray(value)) {
                _.some(value, (o, i) => {
                    if (_.has(o, '__class__')) {
                        value[i] = this.resolve(o, context);
                    }
                });
            }
        });

        const cls = obj.__class__;
        if (!cls) {
            return obj;
        }
        return pysonClasses[cls].resolve(obj, context);
    }
}
