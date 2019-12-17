import { ModalListItem } from '../model/modal-list';

export class SearchResult {
  index: number;
  item: ModalListItem;
  constructor() {
    this.index = 0;
    this.item = new ModalListItem();
  }
}

export class SearchListItem {
  public prop: string;
  public value: string;
  constructor() {
    this.prop = '';
    this.value = '';
  }
}

export class SearchList {
  public items;
  constructor() {
    this.items = [new SearchListItem()];
  }
}

