import { IOrderResponse } from '../../types';
import { events } from '../base/events';

export class SuccessView {
  protected element: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render(order: IOrderResponse): HTMLElement {
    this.element.querySelector('.order-success__description')!.textContent = `Списано ${order.total} синапсов`;

    const button = this.element.querySelector('.order-success__close')!;
    button.removeEventListener('click', this._handleClick); 
    button.addEventListener('click', this._handleClick);

    return this.element;
  }

  private _handleClick = () => {
    events.emit('modal:close');
  };

  getElement(): HTMLElement {
    return this.element;
  }

  getButton(): HTMLButtonElement {
    return this.element.querySelector('.order-success__close')!;
  }
}

