import { IItem } from '../../types';

export class ProductModel {
  protected items: IItem[] = [];
  protected selectedItem: IItem | null = null;

  setItems(items: IItem[]) {
    this.items = items;
  }

  getItems(): IItem[] {
    return this.items;
  }

  getItemById(id: string): IItem | undefined {
    return this.items.find(item => item.id === id);
  }

  selectItem(item: IItem) {
    this.selectedItem = item;
  }

  getSelectedItem(): IItem | null {
    return this.selectedItem;
  }
}
