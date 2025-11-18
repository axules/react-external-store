"use strict";

exports.__esModule = true;
exports.ReactExternalStore = void 0;
exports.defaultLogger = defaultLogger;
var _react = require("react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
let mutate = null;
(function () {
  Promise.resolve().then(() => _interopRequireWildcard(require('deep-mutation'))).then(fn => {
    mutate = fn.default;
  }).catch(() => null);
})();

// https://react.dev/reference/react/useSyncExternalStore

function defaultLogger(title) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  // eslint-disable-next-line no-console
  console.debug("ReactExternalStore -> " + title, ...args);
}
class ReactExternalStore {
  get state() {
    return this.getState();
  }
  set state(value) {
    this.setState(value);
  }
  constructor(initState) {
    var _this = this;
    this.__logger = () => null;
    this.__listeners__ = [];
    this.__state__ = undefined;
    this.__emitChangesTrigger__ = null;
    this.__emitChanges__ = () => {
      this.__logger('__emitChanges__', this.__listeners__.length);
      this.__listeners__.forEach(listener => listener(this));
    };
    // Attempt to optimize listeners calls
    this.__emitChangesTask__ = () => {
      this.__logger('__emitChangesTask__', !!this.__emitChangesTrigger__);
      clearTimeout(this.__emitChangesTrigger__);
      // push __emitChanges__ to macro tasks JS queue
      this.__emitChangesTrigger__ = setTimeout(() => this.__emitChanges__(), 10);
    };
    this.__subscribe__ = callback => {
      this.__logger('subscribe', this.__listeners__.length + 1);
      this.__listeners__ = this.__listeners__.concat([callback]);
      return () => {
        this.__unsubscribe__(callback);
      };
    };
    this.__unsubscribe__ = callback => {
      this.__logger('unsubscribe', this.__listeners__.length - 1);
      this.__listeners__ = this.__listeners__.filter(it => it !== callback);
    };
    this.use = selector => {
      this.__logger('use');
      const dataGetter = (0, _react.useMemo)(() => {
        this.__logger('use:useMemo:dataGetter', !!selector);
        return selector ? () => selector(this.getState()) : this.getState;
      }, [selector]);
      return (0, _react.useSyncExternalStore)(this.__subscribe__, dataGetter);
    };
    /**
     * UNSTABLE-EXPERIMENTAL
     * @param {*} selector
     */
    this.useMemoized = function (selector, deps) {
      if (deps === void 0) {
        deps = [];
      }
      const memoizedSelector = (0, _react.useMemo)(() => selector, deps);
      return _this.use(memoizedSelector);
    };
    this.getState = () => this.__state__;
    this.beforeUpdate = undefined;
    // beforeUpdate = (nextValue, prevValue) => {
    //   return nextValue;
    // };
    this.setState = value => {
      this.__logger('setState:start', value);
      let preparedValue = typeof value === 'function' ? value(this.__state__) : value;
      if (this.__state__ === preparedValue || Object.is(this.__state__, preparedValue)) {
        return this.__state__;
      }
      if (this.beforeUpdate) {
        preparedValue = this.beforeUpdate(preparedValue, this.__state__);
        this.__logger('setState:beforeUpdate', preparedValue);
      }
      if (this.__state__ === preparedValue || Object.is(this.__state__, preparedValue)) {
        return this.__state__;
      }
      this.__logger('setState:update', preparedValue);
      this.__state__ = preparedValue;
      this.__emitChangesTask__();
      return this.__state__;
    };
    /**
     * It patches current value by using deep-mutation library.
     * @param patch [Object|Array] Specifies path and value for patching. It could be Array(Array(key, value)) or Object(key, value).
     * @returns new patched value
     * @example
     * MyStorage.getValue();
     * // { a: 1, b: 2, c: [11,22], e: { e1: 'val' }}
     * MyStorage.patchValue({ d: 99, 'c[]': 33, 'e.e2': 'val2' });
     * //OR MyStorage.patchValue([ ['d', 99], ['c[]', 33], ['e.e2', 'val2'] ]);
     * // { a: 1, b: 2, c: [11,22,33], d: 99, e: { e1: 'val', e2: 'val2' }}
     */
    this.patchState = patch => {
      if (!mutate) throw new Error('To use this you need to install "deep-mutation"');
      return this.setState(mutate(this.getState(), patch));
    };
    /**
     * Deep merges current value and new object by using deep-mutation library.
     * @param patch [Object]
     * @example
     * MyStorage.getValue();
     * // { a: 1, b: 2, c: [11,22], e: { e1: 'val' }}
     * MyStorage.patchValue({ d: 99, c: [33], e: {e2: 'val2'} });
     * // { a: 1, b: 2, c: [11,22,33], d: 99, e: { e1: 'val', e2: 'val2' }}
     */
    this.mergeState = patch => {
      if (!mutate) throw new Error('To use this you need to install "deep-mutation"');
      return this.setState(mutate.deep(this.getState(), patch));
    };
    this.__state__ = initState;
    this.__logger('constructor', initState);
  }
}
exports.ReactExternalStore = ReactExternalStore;