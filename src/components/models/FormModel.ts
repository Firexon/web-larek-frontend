import { IOrderForm, IServerOrder, FormErrors } from '../../types';

export class FormModel {
  protected form: IOrderForm = {};

  updateForm(data: Partial<IOrderForm>) {
    this.form = { ...this.form, ...data };
  }

  validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!this.form.address) errors.address = 'Введите адрес';
    if (!this.form.phone) errors.phone = 'Введите телефон';
    if (!this.form.email) errors.email = 'Введите email';
    if (!this.form.payment) errors.payment = 'Выберите способ оплаты';
    return errors;
  }

  getOrder(items: string[], total: number): IServerOrder {
    return {
      ...this.form as Required<IOrderForm>,
      items,
      total,
    };
  }

  clear() {
    this.form = {};
  }
}
