import { View } from './View';
import { IOrderForm } from '../../types';

export class OrderForm extends View<HTMLFormElement> {
  protected _address: HTMLInputElement;
  protected _buttons: HTMLButtonElement[];
  protected _submitButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    super(template);
    this._address = this.getElement().querySelector('input[name="address"]');
    this._buttons = Array.from(this.getElement().querySelectorAll('.button_alt'));
    this._submitButton = this.getElement().querySelector('button[type="submit"]');
  }

  // Устанавливает адрес в поле
  set address(value: string) {
    this._address.value = value;
  }

  // Получает значение адреса
  get address() {
    return this._address.value;
  }

  // Получает выбранный способ оплаты
  get paymentMethod(): string | null {
    const activeButton = this._buttons.find((button) => button.classList.contains('button_alt-active'));
    return activeButton ? activeButton.name : null;
  }

  // Делает выбранную кнопку активной
  setActivePayment(method: string) {
    this._buttons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === method);
    });
  }

  // Слушает выбор способа оплаты
  listenPaymentChoice(callback: (method: string) => void) {
    this._buttons.forEach((button) => {
      button.addEventListener('click', () => {
        callback(button.name);
      });
    });
  }

  // Слушает ввод адреса
  listenAddressInput(callback: () => void) {
    this._address.addEventListener('input', () => {
      callback();
    });
  }

  // Делает кнопку "Далее" активной/неактивной
  setNextButtonActive(active: boolean) {
    if (active) {
      this._submitButton.removeAttribute('disabled');
    } else {
      this._submitButton.setAttribute('disabled', 'true');
    }
  }
}


// import { View } from './View';

// export class OrderForm extends View<HTMLFormElement> {
//   constructor(template: HTMLTemplateElement) {
//     super(template);
//   }

//   // Получить все радиокнопки выбора оплаты
//   getPaymentButtons(): NodeListOf<HTMLButtonElement> {
//     return this.getElement().querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;
//   }

//   // Получить инпут адреса
//   getAddressInput(): HTMLInputElement {
//     const input = this.getElement().querySelector('input[name="address"]') as HTMLInputElement;
//     if (!input) {
//       throw new Error('Address input not found');
//     }
//     return input;
//   }

//   // Получить кнопку "Далее"
//   getSubmitButton(): HTMLButtonElement {
//     const button = this.getElement().querySelector('button[type="submit"]') as HTMLButtonElement;
//     if (!button) {
//       throw new Error('Submit button not found');
//     }
//     return button;
//   }
// }
