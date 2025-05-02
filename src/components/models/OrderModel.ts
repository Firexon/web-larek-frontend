import { IOrderForm, IServerOrder } from '../../types';
import { events } from '../base/events';

export class OrderModel {
  private data: IOrderForm = {
    address: '',
    phone: '',
    email: '',
    payment: '',
  };

  reset() {
    this.data = {
      address: '',
      payment: '',
      email: '',
      phone: ''
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

  getOrder(items: string[], total: number): IServerOrder {
    return {
      ...this.data as Required<IOrderForm>,
      items,
      total,
    };
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
}