import { View } from './View';
import { events } from '../base/events';

export class OrderForm extends View<HTMLFormElement> {
  protected _address: HTMLInputElement;
  protected _buttons: HTMLButtonElement[];
  protected _submitButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    super(template);
    this._address = this.getElement().querySelector('input[name="address"]');
    this._buttons = Array.from(this.getElement().querySelectorAll('.button_alt'));
    this._submitButton = this.getElement().querySelector('button[type="submit"]');

    this._listenAddressInput();
    this._listenPaymentChoice();

    this.getElement().addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit('contacts:open');
    });
  }

  set address(value: string) {
    this._address.value = value;
  }

  get address() {
    return this._address.value;
  }

  get paymentMethod(): string | null {
    const activeButton = this._buttons.find((button) => button.classList.contains('button_alt-active'));
    return activeButton ? activeButton.name : null;
  }

  setActivePayment(method: string) {
    this._buttons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === method);
    });
  }

  reset() {
    this.address = '';
    this.setActivePayment('');
    this.setNextButtonActive(false);
  }

  private _listenPaymentChoice() {
    this._buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.setActivePayment(button.name);
        events.emit('order:change', { key: 'payment', value: button.name });
      });
    });
  }

  private _listenAddressInput() {
    this._address.addEventListener('input', () => {
      events.emit('order:change', { key: 'address', value: this._address.value });
    });
  }

  setNextButtonActive(active: boolean) {
    if (active) {
      this._submitButton.removeAttribute('disabled');
    } else {
      this._submitButton.setAttribute('disabled', 'true');
    }
  }
}

