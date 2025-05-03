import { ISelectedItem, IClickHandler } from '../../types';
import { CartItemView } from './CartItemView';

export class CartView {
  protected element: HTMLElement;
  protected listContainer: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected totalEl: HTMLElement;

  protected itemTemplate: HTMLTemplateElement;
  protected itemHandlers: IClickHandler;

  constructor(
    template: HTMLTemplateElement,
    onSubmit: () => void,
    itemTemplate: HTMLTemplateElement,
    itemHandlers: IClickHandler
  ) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.listContainer = this.element.querySelector('.basket__list')!;
    this.submitButton = this.element.querySelector('.basket__button')!;
    this.totalEl = this.element.querySelector('.basket__price')!;

    this.itemTemplate = itemTemplate;
    this.itemHandlers = itemHandlers;

    this.submitButton.addEventListener('click', onSubmit);
  }

  render(data: { items: ISelectedItem[]; total: number }) {
    this.listContainer.innerHTML = '';

    data.items.forEach((item, index) => {
      const itemView = new CartItemView(this.itemTemplate, this.itemHandlers);
      itemView.setData(item, index);
      this.listContainer.appendChild(itemView.getElement());
    });

    this.totalEl.textContent = `${data.total} синапсов`;
    this.submitButton.disabled = data.items.length === 0;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}



// export class CartView {
//   protected element: HTMLElement;

//   constructor(template: HTMLTemplateElement, onSubmit: () => void) {
//     this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
//   }

//   setSubmitButtonState(enabled: boolean) {
//     const submitButton = this.element.querySelector('.basket__button') as HTMLButtonElement;
//     submitButton.disabled = !enabled;
//   }

//   setTotal(total: number) {
//     const totalEl = this.element.querySelector('.cart__price');
//     if (totalEl) {
//       totalEl.textContent = `${total} синапсов`;
//     }
//   }

//   getElement(): HTMLElement {
//     return this.element;
//   }

//   getListContainer(): HTMLElement {
//     return this.element.querySelector('.basket__list')!;
//   }

//   getSubmitButton(): HTMLButtonElement {
//     return this.element.querySelector('.basket__button')!;
//   }
// }
