import './scss/styles.scss';

import { Api, ApiListResponse } from './components/base/api';
import { events } from './components/base/events';

import { API_URL } from './utils/constants';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';

import { CardView } from './components/views/CardView';
import { CardPreviewView } from './components/views/CardPreviewView';
import { CartView } from './components/views/CartView';
import { CartItemView } from './components/views/CartItemView';
import { ModalView } from './components/views/ModalView';
import { SuccessView } from './components/views/SuccessView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { PageView } from './components/views/PageView';

import { IItem, ISelectedItem,  IOrderResponse, IOrderForm, IServerOrder  } from './types';

//  Представления 
const modal = new ModalView(document.querySelector('#modal-container') as HTMLElement);

const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

//  Создание API-клиента
const api = new Api(API_URL);

//  Модели
const catalogModel = new CatalogModel();
const cartModel = new CartModel(events); 
const orderModel = new OrderModel();
const pageView = new PageView();
const orderFormView = new OrderForm(orderTemplate);
const contactsFormView = new ContactsForm(contactsTemplate);
const successView = new SuccessView(document.getElementById('success') as HTMLTemplateElement);

const cartView = new CartView(
  cartTemplate,
  () => events.emit('order:open')
);

//  Отрисовка товаров
function renderCatalog() {
  const gallery = pageView.getGallery();

  const cards = catalogModel.getItems().map((item) => {
    const card = new CardView(cardTemplate, {
      onClick: () => {
        catalogModel.setPreview(item);
        events.emit('preview:open', item);
      },
    });

    card.render(item);
    return card.getElement();
  });

  gallery.replaceChildren(...cards);
}

// События
events.on('products:loaded', renderCatalog);

//  Открытие превью
events.on('preview:open', (item: IItem) => {
  const inCart = cartModel.hasItem(item.id);

  const view = new CardPreviewView(previewTemplate, {
    onClick: () => {
      const selected: ISelectedItem = {
        id: item.id,
        title: item.title,
        price: item.price || 0,
      };

      if (inCart) {
        cartModel.removeItem(item.id);
      } else {
        cartModel.addItem(selected);
      }

      events.emit('modal:close');
      events.emit('basket:change');
      modal.setContent(cartView.getElement());
      modal.open();
    }
  });

  view.setData(item, inCart);
  view.render();
  modal.setContent(view.getElement());
  modal.open();
});

events.on('basket:change', () => {
  const items = cartModel.getItems();

  const itemElements = items.map((item, index) => {
    const itemView = new CartItemView(cartItemTemplate, {
      onClick: () => {
        cartModel.removeItem(item.id);
        events.emit('cart:changed', { count: cartModel.getItems().length });
        events.emit('basket:change'); 
      }
    });

    itemView.setData(item, index);
    return itemView.getElement();
  });

  cartView.setItems(itemElements);
  cartView.setTotal(cartModel.getTotal());
  cartView.setSubmitDisabled(items.length === 0);
  pageView.setCartCount(items.length);
});

// Слушатель кнопки корзины
pageView.onBasketClick(() => {
  events.emit('basket:change');
  modal.setContent(cartView.getElement());
  modal.open();
});

events.on('order:open', () => {
  orderModel.reset();
  orderFormView.reset();
  contactsFormView.reset();

  modal.setContent(orderFormView.getElement());
  modal.open();
});

events.on('contacts:open', () => {
  contactsFormView.render();
  modal.setContent(contactsFormView.getElement());
  modal.open();
});

events.on('order:change', ({ key, value }: { key: keyof IOrderForm; value: string }) => {
  orderModel.change(key, value);
});

events.on('order:validated:order', (payload: { isValid: boolean }) => {
  orderFormView.setNextButtonActive(payload.isValid);
});

events.on('order:validated:contacts', (payload: { isValid: boolean }) => {
  contactsFormView.setNextButtonActive(payload.isValid);
});

events.on('order:submit', () => {
  const items = cartModel.getItems().map(item => item.id);
  const total = cartModel.getTotal();

  const orderData = orderModel.getOrderData(items, total);

  api.post('/order', orderData)
    .then((response: IOrderResponse) => {
      events.emit('order:success', response);
    })
    .catch((err) => {
      console.error('Ошибка отправки заказа:', err);
    });
});

// успешный заказ
events.on('order:success', (res: IOrderResponse) => {
  successView.render(res); 
  modal.setContent(successView.getElement()); 
  modal.open();

  cartModel.clear();
});

// Pакрытие модалки
events.on('modal:close', () => {
  modal.close();
});

api.get('/product')
  .then((data) => {
    const typedData = data as ApiListResponse<IItem>;
    catalogModel.setItems(typedData.items); 
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });