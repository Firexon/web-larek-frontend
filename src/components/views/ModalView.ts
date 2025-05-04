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

  private handleEscClose = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.close();
      events.emit('modal:close');
    }
  }

  setContent(content: HTMLElement | null) {
    const target = this.container.querySelector('.modal__content')!;
    target.innerHTML = '';
    if (content) target.appendChild(content);
  }

  open() {
    this.container.classList.add('modal_active');
    document.addEventListener('keydown', this.handleEscClose);
  }

  close() {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keydown', this.handleEscClose);
  }

  private _setupEvents() {
    this.closeButton?.addEventListener('click', () => events.emit('modal:close'));

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        events.emit('modal:close');
      }
    });
  }
}
