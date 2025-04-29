import { View } from './View';
import { events } from '../base/events';
import { IContactsForm } from '../../types';

export class ContactsForm extends View<HTMLFormElement> {
  private email: string = '';
  private phone: string = '';

  public isValid(): boolean {
    return this.email.trim() !== '' && this.phone.trim() !== '';
  }
  
  public onSubmit(callback: (data: IContactsForm) => void) {
    this.getElement().addEventListener('submit', (e) => {
      e.preventDefault();
      callback({ email: this.email, phone: this.phone });
    });
  }

  constructor(template: HTMLTemplateElement) {
    super(template);
    this.listenInputChange();
  }

  private listenInputChange() {
    const emailInput = this.getElement().querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = this.getElement().querySelector('input[name="phone"]') as HTMLInputElement;

    emailInput?.addEventListener('input', (e) => {
      this.email = (e.target as HTMLInputElement).value;
      events.emit('contacts:input', { email: this.email, phone: this.phone });
    });

    phoneInput?.addEventListener('input', (e) => {
      this.phone = (e.target as HTMLInputElement).value;
      events.emit('contacts:input', { email: this.email, phone: this.phone });
    });
  }

  setSubmitButtonState(isActive: boolean) {
    const submitButton = this.getElement().querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = !isActive;
    }
  }

  onInputChange(callback: (data: { email: string; phone: string }) => void) {
    events.on('contacts:input', callback);
  }
  
}

