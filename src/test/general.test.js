import { ReactExternalStore } from '../index';
import { testDelay } from './utils';


describe('General', () => {
  test('snapshot', () => {
    expect(new ReactExternalStore()).toMatchSnapshot();
  });

  test('should return the same state', () => {
    const initState = { a: 99 };
    const onChange = jest.fn();
    const store = new ReactExternalStore(initState);
    const unsubscribe = store.__subscribe__(onChange);
    const result = store.setState(initState);

    expect(typeof unsubscribe).toBe('function');
    expect(result).toBe(initState);
    expect(onChange).toBeCalledTimes(0);
  });

  test('should return call callback', async () => {
    const initState = { a: 99 };
    const newValue = { b: 88 };
    const onChange = jest.fn();
    const store = new ReactExternalStore(initState);
    store.__subscribe__(onChange);
    const result = store.setState(newValue);

    expect(result).toBe(newValue);
    await testDelay(50);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(store);
  });

  test('should remove listener', () => {
    const initState = { a: 99 };
    const onChange = jest.fn();
    const store = new ReactExternalStore(initState);
    const unsubscribe = store.__subscribe__(onChange);

    expect(store.__listeners__.length).toBe(1);
    unsubscribe();
    expect(store.__listeners__.length).toBe(0);

    store.setState({ c: 88 });

    expect(typeof unsubscribe).toBe('function');
    expect(onChange).toBeCalledTimes(0);
  });
});