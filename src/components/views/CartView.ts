export class CartView {
  protected element: HTMLElement;

  constructor(template: HTMLTemplateElement, onSubmit: () => void) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  setSubmitButtonState(enabled: boolean) {
    const submitButton = this.element.querySelector('.basket__button') as HTMLButtonElement;
    submitButton.disabled = !enabled;
  }

  setTotal(total: number) {
    const totalEl = this.element.querySelector('.cart__price');
    if (totalEl) {
      totalEl.textContent = `${total} синапсов`;
    }
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
