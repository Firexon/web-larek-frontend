import { ISelectedItem, IClickHandler } from '../../types';

export class CartItemView {
  protected template: HTMLTemplateElement;
  protected handlers: IClickHandler;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.template = template;
    this.handlers = handlers;
  }

  render(item: ISelectedItem, index: number): HTMLElement {
    const element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    element.querySelector('.basket__item-index')!.textContent = String(index + 1);
    element.querySelector('.card__title')!.textContent = item.title;
    element.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

    const deleteButton = element.querySelector('.basket__item-delete');
    if (deleteButton) {
      deleteButton.setAttribute('data-id', item.id); // ✅ добавим data-id
      deleteButton.addEventListener('click', (event: MouseEvent) => {
        this.handlers.onClick?.(event); // всё по контракту
      });
    }

    return element;
  }
}


// import { ISelectedItem, IClickHandler } from '../../types';

// export class CartItemView {
//   protected element: HTMLElement;

//   constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
//     this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

//     this.element.querySelector('.basket__item-delete')?.addEventListener('click', handlers.onClick);
//   }

//   render(item: ISelectedItem, index: number): HTMLElement {
//     this.element.querySelector('.basket__item-index')!.textContent = String(index + 1);
//     this.element.querySelector('.card__title')!.textContent = item.title;
//     this.element.querySelector('.card__price')!.textContent = `${item.price} синапсов`;

//     return this.element;
//   }
// }
