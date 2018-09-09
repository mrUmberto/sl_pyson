import Pyson from './pyson';
import moment from 'moment';

const pyson = new Pyson();

describe('pyson test', () => {
    it('Eval', () => {
        expect(pyson.resolve({
            d: '',
            __class__: 'Eval',
            v: 'apple_pie',
        }, {
            apple_pie: 'hot',
        })).toBe('hot');

        expect(pyson.resolve({
            d: 'bar',
            __class__: 'Eval',
            v: 'foo',
        }, {
            foo: 10,
        })).toBe(10);

        expect(pyson.resolve({
            d: 'bar',
            __class__: 'Eval',
            v: 'foo',
        }, {})).toBe('bar');

        expect(pyson.resolve({
            d: 'bar',
            __class__: 'Eval',
            v: 'foo',
        }, {
            pie: 'pie',
        })).toBe('bar');
    });

    it('Not', () => {
        expect(pyson.resolve({
            __class__: 'Not',
            v: 10,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Not',
            v: true,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Not',
            v: false,
        })).toBe(true);
    });

    it('Not-complex', () => {
        const expr = {"__class__": "Not", "v": {"s2": "to upgrade", "s1": {"d": "", "__class__": "Eval", "v": "state"}, "__class__": "Equal"}};
        const data = {state: 'not activated'};
        expect(pyson.resolve(expr, data)).toBe(true);
    });

    it('Bool', () => {
        expect(pyson.resolve({
            __class__: 'Bool',
            v: false,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Bool',
            v: true,
        })).toBe(true);
    });

    it('And', () => {
        expect(pyson.resolve({
            __class__: 'And',
            s: [true, true, false],
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'And',
            s: [true, true, true],
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'And',
            s: [true, 1],
        })).toBe(true);
    });

    it('Or', () => {
        expect(pyson.resolve({
            __class__: 'Or',
            s: [true, true, false],
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'Or',
            s: [false, false, false],
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Or',
            s: [false, 1],
        })).toBe(true);
    });

    it('Equal', () => {
        expect(pyson.resolve({
            __class__: 'Equal',
            s1: true,
            s2: false,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Equal',
            s1: 10,
            s2: '10',
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Equal',
            s1: 1107,
            s2: 1107,
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'Equal',
            s1: moment('2016-01-01'),
            s2: moment('2016-01-02'),
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Equal',
            s1: moment('2016-01-01'),
            s2: false,
        })).toBe(false);
    });

    it('Greater', () => {
        expect(pyson.resolve({
            __class__: 'Greater',
            s1: 11,
            s2: 7,
            e: false,
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'Greater',
            s1: 11,
            s2: 16,
            e: true,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Greater',
            s1: 12,
            s2: 12,
            e: true,
        })).toBe(true);
    });

    it('Less', () => {
        expect(pyson.resolve({
            __class__: 'Less',
            s1: 11,
            s2: 7,
            e: false,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'Less',
            s1: 11,
            s2: 16,
            e: true,
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'Less',
            s1: 12,
            s2: 12,
            e: true,
        })).toBe(true);
    });

    it('If', () => {
        expect(pyson.resolve({
            __class__: 'If',
            c: 12,
            t: 'pie',
            e: 'apple',
        })).toBe('pie');

        expect(pyson.resolve({
            __class__: 'If',
            c: false,
            t: 'pie',
            e: 'apple',
        })).toBe('apple');

        expect(pyson.resolve({
            __class__: 'If',
            c: true,
            t: 'pie',
            e: 'apple',
        })).toBe('pie');
    });

    it('Get', () => {
        expect(pyson.resolve({
            __class__: 'Get',
            v: {},
            k: 'super skunk',
            d: 22,
        })).toBe(22);

        expect(pyson.resolve({
            __class__: 'Get',
            v: {
                seed: 'Lemon Haze',
            },
            k: 'seed',
            d: 22,
        })).toBe('Lemon Haze');

        expect(pyson.resolve({
            __class__: 'Get',
            v: {
                seed: 'Lemon Haze',
            },
            k: 'leaf',
            d: 22,
        })).toBe(22);
    });

    it('In', () => {
        expect(pyson.resolve({
            __class__: 'In',
            v: [2, 5, 'express'],
            k: 'express',
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'In',
            v: [2, 5, 'express'],
            k: 12,
        })).toBe(false);

        expect(pyson.resolve({
            __class__: 'In',
            v: {
                seed: 'white',
                leaf: 'green',
            },
            k: 'leaf',
        })).toBe(true);

        expect(pyson.resolve({
            __class__: 'In',
            v: {
                seed: 'white',
                leaf: 10,
            },
            k: 'lea',
        })).toBe(false);
    });

    it('Date', () => {
        expect(pyson.resolve({
            __class__: 'Date',
            y: 2016,
        })).toBe(moment().year(2016).startOf('d').format('YYYY-MM-DD'));

        expect(pyson.resolve({
            __class__: 'Date',
            y: 2016,
            M: 8,
            d: 15,
        })).toBe(moment('2016-08-15').startOf('d').format('YYYY-MM-DD'));

        expect(pyson.resolve({
            __class__: 'Date',
            dy: 4,
        })).toBe(moment()
            .startOf('d')
            .add({
                y: 4,
            }).format('YYYY-MM-DD'));
    });

    it('DateComplex', () => {
        const expr = {'dM': 0, 'd': 20, 'dd': 0, 'M': 7, '__class__': 'Date', 'dy': 0, 'y': 2018};
        expect(pyson.resolve(expr)).toBe('2018-07-20');
    });

    it('DateTime', () => {
        expect(pyson.resolve({
            __class__: 'DateTime',
            y: 2016,
            M: 3,
            d: 10,
            h: 11,
            m: 26,
            s: 15,
            ms: 100000,
        }).format()).toBe(moment('2016-03-10 11:26:15.100').format());

        expect(pyson.resolve({
            __class__: 'DateTime',
            y: 2016,
            M: 3,
            d: 10,
            h: 11,
            m: 26,
            s: 15,
            ms: 100000,
            dy: 4,
        }).format()).toBe(moment('2016-03-10 11:26:15.100').add({
            y: 4,
        }).format());
    });
    it('Composite1', () => {
        expect(pyson.resolve({
            __class__: 'Not',
            v: {
                d: true,
                __class__: 'Eval',
                v: 'active',
            },
        }, {active: true})).toBe(false);
    });
    it('Composite2', () => {
        expect(pyson.resolve({
                __class__: 'Not',
                v: {
                    __class__: 'Equal',
                    s2: 'goods',
                    s1: {
                        d: 'goods',
                        __class__: 'Eval',
                        v: 'type',
                    },
                },
            }, {'type': 'goods'}
        )).toBe(false);
    });

    it('Composite3', () => {
        expect(pyson.resolve({
                __class__: 'Not',
                v: {
                    __class__: 'Equal',
                    s2: 'goods',
                    s1: {
                        d: 'goods',
                        __class__: 'Eval',
                        v: 'type',
                    },
                },
            }, {'type': 'foo'}
        )).toBe(true);
    });
    it('Composite4', () => {
        expect(pyson.resolve({
            s: [false, {
                k: {
                    d: '',
                    __class__: 'Eval',
                    v: 'type',
                },
                __class__: 'In',
                v: ['goods', 'assets'],
            }],
            __class__: 'Or',
        }, {type: 'goods'})).toBe(true);
    });

    it('Composite5', () => {
        expect(pyson.resolve({
            s: [true, {
                k: {
                    d: '',
                    __class__: 'Eval',
                    v: 'type',
                },
                __class__: 'In',
                v: ['goods', 'assets'],
            }],
            __class__: 'And',
        }, {type: 'mn'})).toBe(false);
    });

    it('Composite6', () => {
        const expr = {
            's': [{
                '__class__': 'Bool', 'v': {'v': 'supplier_invoice_line', 'd': 1, '__class__': 'Eval'},
            }, {'__class__': 'Bool', 'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'}}, {
                '__class__': 'Not',
                'v': {'s2': 'draft', 's1': {'v': 'state', 'd': '', '__class__': 'Eval'}, '__class__': 'Equal'},
            }], '__class__': 'Or',
        };
        const data = {
            account_journal: 5,
            supplier_invoice_line: null,
            company: 1,
            depreciation_method: 'linear',
            frequency: 'monthly',
            state: 'draft',
            lines: [],
        };
        expect(pyson.resolve(expr, data)).toBe(false);
    });

    it('Composite7', () => {
        const expr = {
            's': [{
                '__class__': 'Not',
                'v': {'s2': 'draft', 's1': {'v': 'state', 'd': '', '__class__': 'Eval'}, '__class__': 'Equal'},
            },
                {
                    's': [{'__class__': 'Bool', 'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'}},
                        {'__class__': 'Bool', 'v': {'v': 'party', 'd': '', '__class__': 'Eval'}}],
                    '__class__': 'And',
                },
                {'__class__': 'Bool', 'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'}}], '__class__': 'Or',
        };
        const data = {
            lines: [],
            state: 'draft',
        };
        expect(pyson.resolve(expr, data)).toBe(false);
    });
    it('Composite8', () => {
        const expr = {
            's': [{
                '__class__': 'Not', 'v': {
                    's2': 'draft', 's1': {'v': 'state', 'd': '', '__class__': 'Eval'}, '__class__': 'Equal',
                },
            },
                {'__class__': 'Bool', 'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'}}],
            '__class__': 'Or',
        };
        const data = {
            lines: [],
            state: 'draft',
        };
        expect(pyson.resolve(expr, data)).toBe(false);
    });

    it('Composite9', () => {
        const expr = {
            's': [{
                '__class__': 'Not', 'v': {
                    's2': 'draft', 's1': {'v': 'state', 'd': '', '__class__': 'Eval'}, '__class__': 'Equal',
                },
            },
                {
                    's': [{'__class__': 'Bool', 'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'}},
                        {'__class__': 'Bool', 'v': {'v': 'party', 'd': '', '__class__': 'Eval'}}],
                    '__class__': 'And',
                }, {'__class__': 'Bool', 'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'}}],
            '__class__': 'Or',
        };
        const data = {
            lines: [],
            state: 'draft',
            party: 'fff',
        };
        expect(pyson.resolve(expr, data)).toBe(false);
    });

    it('Composite10', () => {
        const expr = {
            'c': {
                '__class__': 'Not',
                'v': {
                    '__class__': 'Bool',
                    'v': {
                        'v': 'active',
                        'd': '',
                        '__class__': 'Eval',
                    },
                },
            },
            'e': {
                's2': 0,
                's1': {
                    'v': 'id',
                    'd': 0,
                    '__class__': 'Eval',
                },
                'e': false,
                '__class__': 'Greater',
            },
            '__class__': 'If',
            't': true,
        };
        const data = {
            id: -1,
        };

        expect(pyson.resolve(expr, data)).toBe(true);
    });

    it('Composite11', () => {
        const expr = {
            's': [{
                '__class__': 'Bool',
                'v': {'d': '', '__class__': 'Eval', 'v': 'shipment'},
            }, {
                's': [{'d': true, '__class__': 'Eval', 'v': 'assignation_required'}, {
                    's2': 'draft',
                    's1': {'d': '', '__class__': 'Eval', 'v': 'state'},
                    '__class__': 'Equal',
                }], '__class__': 'And',
            }], '__class__': 'Or',
        };
        const data = {
            state: 'draft',
            assignation_required: true,
            shipment: 'stock.shipment.internal,1',
        };
        expect(pyson.resolve(expr, data)).toBe(true);
    });

    it('Composite12', () => {
        const expr = {
            'c': {
                '__class__': 'Bool',
                'v': {
                    'd': '',
                    'k': 'warehouse',
                    '__class__': 'Get',
                    'v': {'d': {}, '__class__': 'Eval', 'v': '_parent_sale'},
                },
            },
            'e': [],
            '__class__': 'If',
            't': [{
                'd': 0,
                'k': 'warehouse',
                '__class__': 'Get',
                'v': {'d': {}, '__class__': 'Eval', 'v': '_parent_sale'},
            }],
        };
        const data = {
            _parent_sale: {
                warehouse: {
                    id: 3,
                    rec_name: 'Wareware',
                },
            },
        };
        expect(pyson.resolve(expr, data)).toEqual([3]);
    });

    it('Composite13', () => {
        const expr = {
            's': [{
                '__class__': 'Not',
                'v': {'s2': 'draft', 's1': {'v': 'state', 'd': '', '__class__': 'Eval'}, '__class__': 'Equal'},
            }, {
                '__class__': 'Bool',
                'v': {'k': 'type', 'v': {'v': 'context', 'd': {}, '__class__': 'Eval'}, 'd': '', '__class__': 'Get'},
            }, {
                's': [{
                    '__class__': 'Bool',
                    'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'},
                }, {'__class__': 'Bool', 'v': {'v': 'type', 'd': '', '__class__': 'Eval'}}], '__class__': 'And',
            }], '__class__': 'Or',
        };

        const data = {
            'payment_term': null,
            'company': {
                'rec_name': 'First test party with very very long name',
                'id': 1,
            },
            'currency_digits': 2,
            'currency': {
                'rec_name': 'Pakistan Rupee',
                'id': 1,
            },
            'state': 'draft',
            'type': 'out',
            'reconciled': false,
            'lines': [],
            'taxes': [],
            'company_party': {
                'rec_name': 'First test party with very very long name',
                'id': 1,
            },
        };
        expect(pyson.resolve(expr, data)).toBe(false);
    });
    it('Composite14', () => {
        const expr = {
            's': [{
                '__class__': 'Not',
                'v': {'s2': 'draft', 's1': {'v': 'state', 'd': '', '__class__': 'Eval'}, '__class__': 'Equal'},
            }, {
                '__class__': 'Bool',
                'v': {'k': 'type', 'v': {'v': 'context', 'd': {}, '__class__': 'Eval'}, 'd': '', '__class__': 'Get'},
            }, {
                's': [{
                    '__class__': 'Bool',
                    'v': {'v': 'lines', 'd': [0], '__class__': 'Eval'},
                }, {'__class__': 'Bool', 'v': {'v': 'type', 'd': '', '__class__': 'Eval'}}], '__class__': 'And',
            }], '__class__': 'Or',
        };

        const data = {
            'payment_term': null,
            'company': {
                'rec_name': 'First test party with very very long name',
                'id': 1,
            },
            'currency_digits': 2,
            'currency': {
                'rec_name': 'Pakistan Rupee',
                'id': 1,
            },
            'state': 'draft',
            'type': 'out',
            'reconciled': false,
            'lines': [],
            'taxes': [],
            'company_party': {
                'rec_name': 'First test party with very very long name',
                'id': 1,
            },
            'context': {
                'type': 'out',
            },
        };
        expect(pyson.resolve(expr, data)).toBe(true);
    });

    it('Composite15', () => {
        const expr = {
            '__class__': 'Not',
            'v': {'__class__': 'Bool', 'v': {'v': 'lines', 'd': [], '__class__': 'Eval'}},
        };
        const data = {
            lines: [],
        };
        expect(pyson.resolve(expr, data)).toBe(true);
    });

    it('Composite16', () => {
        const expr = {
            '__class__': 'Not',
            'v': {'__class__': 'Bool', 'v': {'v': 'lines', 'd': [], '__class__': 'Eval'}},
        };
        const data = {
            lines: [1, 2, {id: 4}],
        };
        expect(pyson.resolve(expr, data)).toBe(false);
    });
});

it('Plain string', () => {
    const expr = 'plain_string';
    const data = {
        id: -1,
    };

    expect(pyson.resolve(expr, data)).toBe('plain_string');
});

it('Plain boolean', () => {
    const expr = true;
    const data = {
        id: -1,
    };
    expect(pyson.resolve(expr, data)).toBe(true);
});

it('pyson context', () => {
    const expr = {
        'c': {
            's2': 'product.template', 's1':
                {'d': '', '__class__': 'Eval', 'v': 'active_model'},
            '__class__': 'Equal',
        },
        'e': {'product': {'d': '', '__class__': 'Eval', 'v': 'active_id'}, 'with_childs': false},
        '__class__': 'If',
        't': {'with_childs': false, 'product_template': {'d': '', '__class__': 'Eval', 'v': 'active_id'}},
    };
    const data = {
        active_model: 'stock.location',
        active_id: 1,
        active_ids: 3,
    };
    expect(pyson.resolve(expr, data).with_childs).toBe(false);
});
