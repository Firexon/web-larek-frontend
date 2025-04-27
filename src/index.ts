import './scss/styles.scss';

import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { API_URL } from './utils/constants';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { FormModel } from './components/models/FormModel';

import { CardView } from './components/views/CardView';
import { CardPreviewView } from './components/views/CardPreviewView';
import { CartView } from './components/views/CartView';
import { CartItemView } from './components/views/CartItemView';
import { ModalView } from './components/views/ModalView';
import { OrderView } from './components/views/OrderView';
import { ContactsView } from './components/views/ContactsView';
import { SuccessView } from './components/views/SuccessView';

import { IItem, ISelectedItem, IServerOrder,  IOrderResponse } from './types';

//  Создание API-клиента
const api = new Api(API_URL);

//  Событийный центр
const events = new EventEmitter();

//  Модели
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const formModel = new FormModel();

//  Представления 
const modal = new ModalView(document.querySelector('#modal-container') as HTMLElement);


const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const gallery = document.querySelector('.gallery')!;

//  Отрисовка товаров
function renderCatalog() {
  gallery.innerHTML = '';
  catalogModel.getItems().forEach((item) => {
    const card = new CardView(cardTemplate, {
      onClick: () => {
        catalogModel.setPreview(item);
        events.emit('preview:open', item);
      },
    });
    gallery.appendChild(card.render(item));
  });
}

//  Открытие превью
events.on('preview:open', (item: IItem) => {
  console.log('Событие preview:open вызвано для товара:', item);
  const view = new CardPreviewView(previewTemplate, {
    onClick: () => {
      const selected: ISelectedItem = {
        id: item.id,
        title: item.title,
        price: item.price || 0,
      };
      cartModel.addItem(selected);
      modal.close(); 
      events.emit('cart:open');
    },
  });
  modal.setContent(view.render(item));
  modal.open();
});

//  Открытие корзины
events.on('cart:open', () => {
  const cartView = new CartView(cartTemplate);
  const list = cartView.getListContainer();
  list.innerHTML = '';
  cartModel.getItems().forEach((item, index) => {
    const cartItem = new CartItemView(cartItemTemplate, {
      onClick: () => {
        cartModel.removeItem(item.id);
        events.emit('cart:open'); 
      },
    });
    list.appendChild(cartItem.render(item, index));
  });

  cartView.renderTotal(cartModel.getTotal());

  cartView.getSubmitButton().addEventListener('click', () => {
    events.emit('order:open');
  });

  modal.setContent(cartView.getElement());
  modal.open();
});

//  Оформления заказа 
events.on('order:open', () => {
  const orderView = new OrderView(orderTemplate);
  const form = orderView.getElement();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const address = formData.get('address')?.toString();
    const payment = formData.get('card') ? 'card' : 'cash';

    formModel.updateForm({ address, payment });
    const errors = formModel.validateForm();

    const errorBlock = orderView.getErrorsContainer();
    errorBlock.textContent = Object.values(errors).join(', ');

    if (Object.keys(errors).length === 0) {
      events.emit('contacts:open');
    }
  });

  modal.setContent(orderView.getElement());
  modal.open();
});

//  Контакты
events.on('contacts:open', () => {
  const contactsView = new ContactsView(contactsTemplate);
  const form = contactsView.getElement();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email')?.toString();
    const phone = formData.get('phone')?.toString();

    formModel.updateForm({ email, phone });
    const errors = formModel.validateForm();

    const errorBlock = contactsView.getErrorsContainer();
    errorBlock.textContent = Object.values(errors).join(', ');

    if (Object.keys(errors).length === 0) {
      const order = formModel.getOrder(
        cartModel.getItems().map((item) => item.id),
        cartModel.getTotal()
      );
      api
        .post('/order', order)
        .then((res: IServerOrder) => {
          events.emit('order:success', res);
        })
        .catch((err) => {
          errorBlock.textContent = 'Ошибка оформления заказа';
          console.error(err);
        });
    }
  });

  modal.setContent(contactsView.getElement());
  modal.open();
});

//  Успешный заказ
events.on('order:success', (res: IOrderResponse) => {
  const successView = new SuccessView(successTemplate);
  const content = successView.render(res);

  successView.getButton().addEventListener('click', () => {
    cartModel.clear();         // очищаем корзину
    formModel.clear();         // очищаем форму
    modal.close();             // закрываем модалку
    renderCatalog();           // перерисовываем каталог
  });

  modal.setContent(content);
  modal.open();
});

//  Закрытие по крестику и оверлею
modal.setCloseHandler(() => modal.close());

//  Получение данных и запуск
api.get('/product')
  .then((data) => {
    const typedData = data as ApiListResponse<IItem>;
    catalogModel.setItems(typedData.items);
    renderCatalog();
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });