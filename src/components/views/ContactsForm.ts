import { View } from './View';
import { events } from '../base/events';

export class ContactsForm extends View<HTMLFormElement> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;
  private _submitButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    super(template);

    this._emailInput = this.getElement().querySelector('input[name="email"]');
    this._phoneInput = this.getElement().querySelector('input[name="phone"]');
    this._submitButton = this.getElement().querySelector('button[type="submit"]');

    this._listenInputs();

    this.getElement().addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit('order:submit');
    });
  }

  private _listenInputs() {
    this._emailInput.addEventListener('input', () => {
      events.emit('order:change', { key: 'email', value: this._emailInput.value });
    });

    this._phoneInput.addEventListener('input', () => {
      events.emit('order:change', { key: 'phone', value: this._phoneInput.value });
    });
  }

  setSubmitButtonState(active: boolean) {
    this._submitButton.disabled = !active;
  }

  setNextButtonActive(active: boolean) {
    if (active) {
      this._submitButton.removeAttribute('disabled');
    } else {
      this._submitButton.setAttribute('disabled', 'true');
    }
  }

  reset() {
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this._submitButton.setAttribute('disabled', 'true');
  }
}

