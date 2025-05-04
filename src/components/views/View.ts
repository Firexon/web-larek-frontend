export class View<T extends HTMLElement = HTMLElement> {
  protected template: HTMLTemplateElement;
  protected element: T;

  constructor(template: HTMLTemplateElement) {
    this.template = template;
    this.element = template.content.firstElementChild!.cloneNode(true) as T;
  }

  render(data?: unknown): void {
  }

  getElement(): T {
    return this.element;
  }
}
