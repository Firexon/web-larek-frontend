export class CartView {
  protected element: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  renderTotal(total: number) {
    const totalNode = this.element.querySelector('.basket__price');
    if (totalNode) totalNode.textContent = `${total} синапсов`;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getListContainer(): HTMLElement {
    return this.element.querySelector('.basket__list')!;
  }

  getSubmitButton(): HTMLButtonElement {
    return this.element.querySelector('.basket__button')!;
  }
}

