import { ISelectedItem } from '../../types';
import { EventEmitter } from '../base/events';

export class CartModel {
  protected items: ISelectedItem[] = [];

  constructor(protected events: EventEmitter) {}

  addItem(item: ISelectedItem) {
    this.items.push(item);
    this.events.emit('basket:change');
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:change');
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  getItems(): ISelectedItem[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  clear() {
    this.items = [];
    this.events.emit('basket:change');
  }
}
