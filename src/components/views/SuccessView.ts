import { IOrderResponse } from '../../types';
import { events } from '../base/events';

export class SuccessView {
  protected element: HTMLElement;
  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.description = this.element.querySelector('.order-success__description')!;
    this.closeButton = this.element.querySelector('.order-success__close')!;

    this.closeButton.addEventListener('click', this._handleClick);
  }

  render(order: IOrderResponse): HTMLElement {
    this.description.textContent = `Списано ${order.total} синапсов`;
    return this.element;
  }

  private _handleClick = () => {
    events.emit('modal:close');
  };

  getElement(): HTMLElement {
    return this.element;
  }
}