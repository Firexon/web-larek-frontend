export class CartView {
  protected element: HTMLElement;
  protected listContainer: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected totalEl: HTMLElement;

  constructor(
    template: HTMLTemplateElement,
    onSubmit: () => void
  ) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.listContainer = this.element.querySelector('.basket__list')!;
    this.submitButton = this.element.querySelector('.basket__button')!;
    this.totalEl = this.element.querySelector('.basket__price')!;

    this.submitButton.addEventListener('click', onSubmit);
  }

  setItems(elements: HTMLElement[]) {
    this.listContainer.replaceChildren(...elements);
  }

  setTotal(total: number) {
    this.totalEl.textContent = `${total} синапсов`;
  }

  setSubmitDisabled(disabled: boolean) {
    this.submitButton.disabled = disabled;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
