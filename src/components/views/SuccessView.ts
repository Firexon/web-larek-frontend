import { IOrderResponse } from '../../types';

export class SuccessView {
  protected element: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render(order: IOrderResponse): HTMLElement {
    this.element.querySelector('.order-success__description')!.textContent = `Списано ${order.total} синапсов`;
    return this.element;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getButton(): HTMLButtonElement {
    return this.element.querySelector('.order-success__close')!;
  }
}

