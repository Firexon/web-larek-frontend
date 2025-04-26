export class OrderView {
  protected element: HTMLFormElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  }

  getElement(): HTMLFormElement {
    return this.element;
  }

  getSubmitButton(): HTMLButtonElement {
    return this.element.querySelector('button[type="submit"]')!;
  }

  getErrorsContainer(): HTMLElement {
    return this.element.querySelector('.form__errors')!;
  }
}
