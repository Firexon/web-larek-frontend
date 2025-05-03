export class PageView {
  protected basketButton: HTMLElement;
  protected cartCounter: HTMLElement;
  protected gallery: HTMLElement;

  constructor() {
    this.basketButton = document.querySelector('.header__basket')!;
    this.cartCounter = document.querySelector('.header__basket-counter')!;
    this.gallery = document.querySelector('.gallery')!;
  }

  public render(): void {
    // Ничего не подготавливаем — всё уже есть в DOM
  }

  public getElement(): HTMLElement {
    return this.gallery;
  }

  public setCartCount(count: number): void {
    this.cartCounter.textContent = String(count);
  }

  public onBasketClick(handler: () => void): void {
    this.basketButton.addEventListener('click', handler);
  }
}
