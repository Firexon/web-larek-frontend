import { events } from '../base/events';

export class ModalView {
  protected container: HTMLElement;
  protected closeButton: HTMLElement | null;
  protected overlay: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.closeButton = container.querySelector('.modal__close');
    this.overlay = container;
    this._setupEvents();
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

  private _setupEvents() {
    this.closeButton?.addEventListener('click', () => events.emit('modal:close'));
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) events.emit('modal:close');
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') events.emit('modal:close');
    });
  }
}

