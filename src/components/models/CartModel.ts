import { ISelectedItem } from '../../types';
import { EventEmitter } from '../base/events';

export class CartModel {
  protected items: ISelectedItem[] = [];
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  addItem(item: ISelectedItem) {
    this.items.push(item);
    this.events.emit('cart:changed', { count: this.items.length });
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('cart:changed', { count: this.items.length });
  }

  clear() {
    this.items = [];
    this.events.emit('cart:changed', { count: this.items.length });
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}

