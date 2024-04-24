import {
  useSyncExternalStore,
  useMemo
} from 'react';


let mutate = null;

(function() {
  import('deep-mutation')
    .then((fn) => {
      mutate = fn.default;
    })
    .catch(() => null);
})();

// https://react.dev/reference/react/useSyncExternalStore

export function defaultLogger(title, ...args) {
  // eslint-disable-next-line no-console
  console.debug(`ReactExternalStore -> ${title}`, ...args);
}

export class ReactExternalStore {
  __logger = () => null;
  __listeners__ = [];
  __state__ = undefined;

  __emitChanges__ = () => {
    this.__logger('__emitChanges__', this.__listeners__.length);
    this.__listeners__.forEach((listener) => listener());
  };

  __subscribe__ = (callback) => {
    this.__logger('subscribe', this.__listeners__.length + 1);
    this.__listeners__ = this.__listeners__.concat([callback]);
    return () => {
      this.__unsubscribe__(callback);
    };
  };

  __unsubscribe__ = (callback) => {
    this.__logger('unsubscribe', this.__listeners__.length - 1);
    this.__listeners__ = this.__listeners__.filter((it) => it !== callback);
  };

  constructor(initState) {
    this.__state__ = initState;
    this.__logger('constructor', initState);
  }

  use = (selector) => {
    this.__logger('use');
    const dataGetter = useMemo(() => {
      this.__logger('use:useMemo:dataGetter', !!selector);
      return selector ? () => selector(this.getState()) : this.getState;
    }, [selector]);
    return useSyncExternalStore(this.__subscribe__, dataGetter);
  };

  /**
   * UNSTABLE-EXPEREMENTAL
   * @param {*} selector
   */
  useMemoized = (selector) => {
    const memoizedSelector = useMemo(selector, []);
    return this.use(memoizedSelector);
  };

  getState = () => this.__state__;

  beforeUpdate = undefined;
  // beforeUpdate = (nextValue, prevValue) => {
  //   return nextValue;
  // };

  setState = (value) => {
    this.__logger('setState:start', value);
    let preparedValue = typeof value === 'function'
      ? value(this.__state__)
      : value;

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
    this.__emitChanges__();
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
  patchState = (patch) => {
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
  mergeState = (patch) => {
    if (!mutate) throw new Error('To use this you need to install "deep-mutation"');
    return this.setState(mutate.deep(this.getState(), patch));
  };
}
