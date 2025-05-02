export class PageView {
  protected basketButton: HTMLElement;
  protected cartCounter: HTMLElement;
  protected gallery: HTMLElement;

  constructor() {
    this.basketButton = document.querySelector('.header__basket') as HTMLElement;
    this.cartCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    this.gallery = document.querySelector('.gallery') as HTMLElement;
  }

  onBasketClick(handler: () => void) {
    this.basketButton.addEventListener('click', handler);
  }

  setCartCount(count: number) {
    this.cartCounter.textContent = String(count);
  }

  getGallery(): HTMLElement {
    return this.gallery;
  }
}
