import { IItem, IClickHandler } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardPreviewView {
  protected element: HTMLElement;
  protected button: HTMLButtonElement;

  protected data: IItem | null = null;
  protected inCart: boolean = false;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    this.button = this.element.querySelector('.card__button') as HTMLButtonElement;

    this.button.addEventListener('click', (event) => {
      if (this.button.disabled) return;
      handlers.onClick?.(event);
    });
  }

  public setData(data: IItem, inCart: boolean = false): void {
    this.data = data;
    this.inCart = inCart;
  }

  public render(): void {
    if (!this.data) return;

    const title = this.element.querySelector('.card__title')!;
    const text = this.element.querySelector('.card__text')!;
    const price = this.element.querySelector('.card__price')!;
    const image = this.element.querySelector('.card__image') as HTMLImageElement;
    const category = this.element.querySelector('.card__category')!;

    title.textContent = this.data.title;
    text.textContent = this.data.description;
    price.textContent = `${this.data.price ?? 0} синапсов`;
    image.src = `${CDN_URL}${this.data.image}`;
    image.alt = this.data.title;
    category.textContent = this.data.category;

    const colorMap: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'другое': 'other',
      'дополнительное': 'additional',
      'дополнительно': 'additional',
      'кнопка': 'button',
    };

    category.className = 'card__category';
    const classSuffix = colorMap[this.data.category];
    if (classSuffix) {
      category.classList.add(`card__category_${classSuffix}`);
    }

    const isSellable = this.data.price !== null && this.data.price > 0;
    this.button.disabled = !isSellable;
    this.button.textContent = isSellable
      ? (this.inCart ? 'Удалить из корзины' : 'В корзину')
      : 'Не продается';
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}

