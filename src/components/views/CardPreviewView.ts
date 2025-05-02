import { IItem, IClickHandler } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardPreviewView {
  protected element: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.button = this.element.querySelector('.card__button') as HTMLButtonElement;

    this.button.addEventListener('click', (event) => {
      if (this.button.disabled) return;
      handlers.onClick?.(event);
    });
  }

  render(data: IItem, inCart: boolean = false): HTMLElement {
    const title = this.element.querySelector('.card__title')!;
    const text = this.element.querySelector('.card__text')!;
    const price = this.element.querySelector('.card__price')!;
    const image = this.element.querySelector('.card__image') as HTMLImageElement;
    const category = this.element.querySelector('.card__category')!;

    title.textContent = data.title;
    text.textContent = data.description;
    price.textContent = `${data.price ?? 0} синапсов`;
    image.src = `${CDN_URL}${data.image}`;
    image.alt = data.title;
    category.textContent = data.category;

    const colorMap: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'другое': 'other',
      'дополнительное': 'additional',
      'дополнительно': 'additional',
      'кнопка': 'button',
    };
    category.className = 'card__category'; 
    const classSuffix = colorMap[data.category];
    if (classSuffix) {
      category.classList.add(`card__category_${classSuffix}`);
    }

    const isSellable = data.price !== null && data.price > 0;
    this.button.disabled = !isSellable;
    this.button.textContent = isSellable
      ? (inCart ? 'Удалить из корзины' : 'В корзину')
      : 'Не продается';

    return this.element;
  }
}


