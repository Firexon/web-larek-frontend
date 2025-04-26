export class ModalView {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  setContent(content: HTMLElement | null) {
    const target = this.container.querySelector('.modal__content')!;
    target.innerHTML = '';
    if (content) target.appendChild(content);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }

  setCloseHandler(callback: () => void) {
    this.container.querySelector('.modal__close')?.addEventListener('click', callback);
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) callback();
    });
  }
}

