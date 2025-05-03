export class OrderView {
  protected element: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    this.submitButton = this.element.querySelector('button[type="submit"]')!;
    this.errorsContainer = this.element.querySelector('.form__errors')!;
  }

  // Метод для отображения ошибок
  setErrors(errors: string[]) {
    this.errorsContainer.innerHTML = '';
    errors.forEach((err) => {
      const errorEl = document.createElement('div');
      errorEl.textContent = err;
      this.errorsContainer.appendChild(errorEl);
    });
  }

  // Метод для управления состоянием кнопки
  setSubmitDisabled(disabled: boolean) {
    this.submitButton.disabled = disabled;
  }

  // Главный публичный метод — отдаем весь блок формы
  getElement(): HTMLFormElement {
    return this.element;
  }
}
