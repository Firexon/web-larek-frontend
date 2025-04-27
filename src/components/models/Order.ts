import { IOrderForm } from '../../types';

export class OrderModel {
  private address: string = '';
  private payment: string = '';
  private email: string = '';
  private phone: string = '';

  setPayment(payment: string) {
    this.payment = payment;
  }

  setAddress(address: string) {
    this.address = address;
  }

  setContacts(email: string, phone: string) {
    this.email = email;
    this.phone = phone;
  }

  getOrder(): IOrderForm {
    return {
      address: this.address,
      payment: this.payment,
      email: this.email,
      phone: this.phone,
    };
  }
}