import { ReactExternalStore } from '../index';


function apiItemsRequest() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

export class TodoStoreClass extends ReactExternalStore {
  selectStatus(state) {
    return state.status;
  }

  selectItems(state) {
    return state.items;
  }

  useStatus() {
    return this.use(this.selectStatus);
  }

  useItems() {
    return this.use(this.selectItems);
  }

  async loadItems() {
    this.patchState({ items: [], status: { loading: true, fail: false } });
    try {
      const items = await apiItemsRequest();
      this.patchState({ items, status: { loading: false, fail: false } });
    } catch (error) {
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
}
