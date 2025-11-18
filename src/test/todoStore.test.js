import { TodoStoreClass } from './TodoStore';
import { testDelay } from './utils';


describe('todoStore', () => {
  let todoStore = null;

  beforeEach(() => {
    todoStore = new TodoStoreClass({
      items: [
        { id: 't1', text: 'Todo item 1', done: false },
        { id: 't2', text: 'Todo item 2', done: true },
        { id: 't3', text: 'Todo item 3', done: true },
        { id: 't4', text: 'Todo item 4', done: false },
      ],
      status: { loading: false, fail: false }
    });
  });

  test('snapshot', () => {
    expect(todoStore).toMatchSnapshot();
  });

  test('should trigger change trigger 2 times', async () => {
    const listener = jest.fn();
    todoStore.__subscribe__(listener);
    await todoStore.loadItems();

    await testDelay(10);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});