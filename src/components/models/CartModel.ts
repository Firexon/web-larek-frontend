import { ISelectedItem } from '../../types';

export class CartModel {
  protected items: ISelectedItem[] = [];

  addItem(item: ISelectedItem) {
    if (!this.items.find((el) => el.id === item.id)) {
      this.items.push(item);
    }
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }
}

