import { IOrderForm, IServerOrder, IOrderResponse } from '../../types';
import { Api } from '../base/api';
import { API_URL } from '../../utils/constants';
import { events } from '../base/events';

export class OrderModel {
  private data: IOrderForm = {
    address: '',
    phone: '',
    email: '',
    payment: '',
  };

  private api: Api;

  constructor() {
    this.api = new Api(API_URL);
  }

  reset() {
    this.data = {
      address: '',
      payment: '',
      email: '',
      phone: '',
    };
  }

  change(key: keyof IOrderForm, value: string) {
    this.data[key] = value;

    if (key === 'address' || key === 'payment') {
      this.validateOrderForm();
    } else if (key === 'email' || key === 'phone') {
      this.validateContactsForm();
    }
  }

  validateOrderForm() {
    const isValid = this.data.address.trim() !== '' && this.data.payment.trim() !== '';
    events.emit('order:validated:order', { isValid });
  }

  validateContactsForm() {
    const isValid = this.data.email.trim() !== '' && this.data.phone.trim() !== '';
    events.emit('order:validated:contacts', { isValid });
  }

  getOrder(): Required<IOrderForm> {
    return this.data as Required<IOrderForm>;
  }

  clear() {
    this.data = {
      address: '',
      phone: '',
      email: '',
      payment: '',
    };
  }

  getAddress() {
    return this.data.address;
  }

  getPayment() {
    return this.data.payment;
  }

  submitOrder(items: string[], total: number): Promise<IOrderResponse> {
    const order: IServerOrder = {
      ...this.getOrder(),
      items,
      total,
    };

    return this.api.post('/order', order) as Promise<IOrderResponse>;
  }
}
