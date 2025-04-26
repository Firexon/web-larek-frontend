import { IItem, IClickHandler } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardPreviewView {
  protected element: HTMLElement;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.element.querySelector('.card__button')?.addEventListener('click', handlers.onClick);
  }

  render(data: IItem): HTMLElement {
    this.element.querySelector('.card__title')!.textContent = data.title;
    this.element.querySelector('.card__text')!.textContent = data.description;
    this.element.querySelector('.card__price')!.textContent = `${data.price ?? 0} синапсов`;
    this.element.querySelector('.card__image')!.setAttribute('src', `${CDN_URL}${data.image}`);
    this.element.querySelector('.card__category')!.textContent = data.category;

    return this.element;
  }
}

