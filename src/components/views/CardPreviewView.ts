import { IItem, IClickHandler } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardPreviewView {
  protected element: HTMLElement;
  protected button: HTMLButtonElement;
  protected title: HTMLElement;
  protected text: HTMLElement;
  protected price: HTMLElement;
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  protected data: IItem | null = null;
  protected inCart: boolean = false;

  constructor(template: HTMLTemplateElement, handlers: IClickHandler) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    this.button = this.element.querySelector('.card__button') as HTMLButtonElement;
    this.title = this.element.querySelector('.card__title')!;
    this.text = this.element.querySelector('.card__text')!;
    this.price = this.element.querySelector('.card__price')!;
    this.image = this.element.querySelector('.card__image') as HTMLImageElement;
    this.category = this.element.querySelector('.card__category')!;

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

    this.title.textContent = this.data.title;
    this.text.textContent = this.data.description;
    this.price.textContent = `${this.data.price ?? 0} синапсов`;
    this.image.src = `${CDN_URL}${this.data.image}`;
    this.image.alt = this.data.title;
    this.category.textContent = this.data.category;

    const colorMap: Record<string, string> = {
      'софт-скил': 'soft',
      'хард-скил': 'hard',
      'другое': 'other',
      'дополнительное': 'additional',
      'дополнительно': 'additional',
      'кнопка': 'button',
    };

    this.category.className = 'card__category';
    const classSuffix = colorMap[this.data.category];
    if (classSuffix) {
      this.category.classList.add(`card__category_${classSuffix}`);
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


