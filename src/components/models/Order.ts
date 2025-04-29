export class OrderModel {
  private _payment: string = '';
  private _address: string = '';
  private _items: string[] = [];
  private _total: number = 0;

  setPayment(method: string) {
    this._payment = method;
  }

  setAddress(address: string) {
    this._address = address;
  }

  setItems(items: string[], prices: Record<string, number>) {
    this._items = items;
    this._total = items.reduce((sum, id) => sum + (prices[id] || 0), 0);
  }

  getPayment(): string {
    return this._payment;
  }

  getAddress() {
    return this._address;
  }

  getOrderItems() {
    return this._items;
  }

  getTotal(): number {
    return this._total;
  }

  clear() {
    this._payment = '';
    this._address = '';
    this._items = [];
    this._total = 0;
  }
}
