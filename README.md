# react-sync-store

It is base general class to simplify using of `useSyncExternalStore` in React components.

### Install

```bash
npm install react-sync-store
```

OR install from github

```bash
npm install https://git@github.com/axules/react-sync-store
```

OR add into your `package.json` file to `dependencies` section:

```
"dependencies": {
  ...
  "react-sync-store": "github:axules/react-sync-store",
  OR
  "react-sync-store" : "git+https://git@github.com/axules/react-sync-store.git"
}
```

### Base methods and fields

```
ReactExternalStore {
  ReactExternalStore {
    "__emitChangesTask__": [Function],
    "__emitChangesTrigger__": null,
    "__emitChanges__": [Function],
    "__listeners__": [],
    "__logger": [Function],
    "__subscribe__": [Function],
    "__unsubscribe__": [Function],
    "state": undefined,
    "beforeUpdate": undefined,
    "getState": [Function],
    "mergeState": [Function],
    "patchState": [Function],
    "setState": [Function],
    "use": [Function],
  }
}
```

`constructor` - function(initialState).

`state` - current state. E.g. `this.state = { ...this.state, value: 123 };`.

`setState` - function(state). Sets new state. It has to be immutable.
Example:
`this.setState({ ...this.state, field: 'value' });` 
or `this.setState((state) => ({ ...state, field: 'value' }));`
or `this.state = { ...this.state, field: 'value' };`.

`beforeUpdate` - function(nextState, currentState). 
It will be called before new state applying. Result of this method will replace state.

`mergeState` - function(objectToDeepMergeIntoState). 
Sets and returns immutable new state as result of state and object merging. 
Requires `deep-mutation` dependency - `npm i deep-mutation` (https://www.npmjs.com/package/deep-mutation). Works like `mutate.deep()`. Example `this.mergeState({ field: 'value', deepField: { a: { a1: 10 } } });`

`patchState` - function(patches). Sets and returns immutable new state with applied patches. 
Requires `deep-mutation` dependency - `npm i deep-mutation` (https://www.npmjs.com/package/deep-mutation). Works like `mutate()`. Example: `this.patchState({ field: 'value', 'a.a1': { 10 } });`

`use` - function(dataSelector, deps). `dataSelector` is `function(state)` and should return stable static value from state.
`use` have to be used instead of `useSyncExternalStore` (https://react.dev/reference/react/useSyncExternalStore) because `use`
already calls `useSyncExternalStore` with passed **dataSelector** as second argument.

`__logger` - could be overloaded by your class implementation to debug store. Or `defaultLogger` could be used - `this.__logger = defaultLogger;`.

## Examples

```js
// TodoStore.js

import { ReactExternalStore } from 'react-sync-store';

class TodoStoreClass extends ReactExternalStore {
  beforeUpdate(nextState, currentState) {
    console.log(currentState, '->', nextState);
    return nextState;
  }

  useStatus() {
    return this.use((state) => state.status);
  }

  useItems() {
    return this.use((state) => state.items);
  }

  async loadItems() {
    this.patchState({ items: [], status: { loading: true, fail: false } });
    try {
      const items = await apiItemsRequest();
      this.patchState({ items, status: { loading: false, fail: false } });
    } catch(error) {
      this.patchState({ status: { loading: false, fail: true } });
    }
  }

  setText(id, text) {
    this.patchState([[`items[id=${id}].text`, text ]]);
  }

  setDone(id, done) {
    this.patchState([[`items[id=${id}].done`, done ]]);
  }

  removeItem(id) {
    this.patchState([[`items[id=${id}]`]]);
  }
  
  addItem(text) {
    const newItem = { id: Math.random(), text, done: false };
    this.state = { ...this.state, items: [...this.items, newItem ]}
  }
}

const TodoStore = new TodoStoreClass({
  items: [
    { id: 't1', text: 'Todo item 1', done: false },
    { id: 't2', text: 'Todo item 2', done: true },
    { id: 't3', text: 'Todo item 3', done: true },
    { id: 't4', text: 'Todo item 4', done: false },
  ],
  status: { loading: false, fail: false }
})

// TodoList.jsx
function TodoList() {
  useEffect(() => { TodoStore.loadItems(); }, []);

  const items = TodoStore.useItems();
  const status = TodoStore.useStatus();

  return (
    <div>
      {status.loading && <div>Loading ...</div>}
      {status.fail && <div>
        Something wrong!
        <button type="button" onClick={TodoStore.loadItems}>Try again</button>
      </div>}

      <ul>
        {items.map(it => <li>{it.text}</li>)}
      </ul>
    </div>
  )
}

```