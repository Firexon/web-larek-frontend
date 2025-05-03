export class View<T extends HTMLElement = HTMLElement> {
  protected template: HTMLTemplateElement;
  protected element: T;

  constructor(template: HTMLTemplateElement) {
    this.template = template;
    this.element = template.content.firstElementChild!.cloneNode(true) as T;
  }

  // Подготовка содержимого (опционально реализуется в наследниках)
  render(data?: unknown): void {
    // По умолчанию ничего не делает
  }

  // Отдаем полностью готовый DOM-элемент
  getElement(): T {
    return this.element;
  }
}
