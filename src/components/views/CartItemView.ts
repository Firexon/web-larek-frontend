import { ISelectedItem, IClickHandler } from '../../types';

export class CartItemView {
  protected element: HTMLElement;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.element.querySelector('.basket__item-delete')?.addEventListener('click', handlers.onClick);
  }

  render(item: ISelectedItem, index: number): HTMLElement {
    this.element.querySelector('.basket__item-index')!.textContent = String(index + 1);
    this.element.querySelector('.card__title')!.textContent = item.title;
    this.element.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

    return this.element;
  }
}
