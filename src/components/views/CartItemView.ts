import { ISelectedItem, IClickHandler } from '../../types';

export class CartItemView {
  protected element: HTMLElement;
  protected handlers: IClickHandler;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.handlers = handlers;
  }

  setData(item: ISelectedItem, index: number) {
    this.element.querySelector('.basket__item-index')!.textContent = String(index + 1);
    this.element.querySelector('.card__title')!.textContent = item.title;
    this.element.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

    const deleteButton = this.element.querySelector('.basket__item-delete');
    if (deleteButton) {
      deleteButton.setAttribute('data-id', item.id);
      deleteButton.addEventListener('click', (event: MouseEvent) => {
        this.handlers.onClick?.(event);
      });
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }
}