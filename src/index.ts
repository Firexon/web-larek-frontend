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

import { IItem, ISelectedItem,  IOrderResponse, IOrderForm  } from './types';

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
const cartItemView = new CartItemView(cartItemTemplate, {
  onClick: (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const id = target.closest('[data-id]')?.getAttribute('data-id'); 

    if (id) {
      cartModel.removeItem(id);
      events.emit('basket:change');
      events.emit('cart:changed', { count: cartModel.getItems().length });
    }
  }
});

const cartView = new CartView(cartTemplate, () => {
  events.emit('order:open');
}, cartItemView);
const orderFormView = new OrderForm(orderTemplate);
const contactsFormView = new ContactsForm(contactsTemplate);
const successView = new SuccessView(document.getElementById('success') as HTMLTemplateElement);

//  Отрисовка товаров
function renderCatalog() {
  const gallery = pageView.getGallery();
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

      events.emit('basket:change'); 
      events.emit('modal:close');
      events.emit('cart:open');
    }
  });

  modal.setContent(view.render(item, inCart));  
  modal.open();
});

events.on('basket:change', () => {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();

  cartView.render({ items, total });
  events.emit('cart:changed', { count: items.length });
});

// events.on('basket:change', () => {
//   const list = cartView.getListContainer();
//   list.innerHTML = '';
//   cartModel.getItems().forEach((item, index) => {
//     const cartItem = new CartItemView(cartItemTemplate, {
//       onClick: () => {
//         cartModel.removeItem(item.id);
//         events.emit('basket:change'); 
//         events.emit('cart:changed', { count: cartModel.getItems().length }); 
//       },
//     });
//     list.appendChild(cartItem.render(item, index));
//   });

//   cartView.setTotal(cartModel.getTotal());
//   cartView.setSubmitButtonState(cartModel.getItems().length > 0);
// });

events.on('cart:open', () => {
  const items = cartModel.getItems();
  const total = cartModel.getTotal();

  cartView.render({ items, total });
  modal.setContent(cartView.getElement());
  modal.open();
});

// events.on('cart:open', () => {
//   const list = cartView.getListContainer();
//   list.innerHTML = '';
//   cartModel.getItems().forEach((item, index) => {
//     const cartItem = new CartItemView(cartItemTemplate, {
//       onClick: () => {
//         cartModel.removeItem(item.id);
//         events.emit('basket:change'); 
//       },
//     });
//     list.appendChild(cartItem.render(item, index));
//   });

//   cartView.setTotal(cartModel.getTotal());

//   const submitButton = cartView.getSubmitButton();
//   submitButton.disabled = cartModel.getItems().length === 0;

//   submitButton.addEventListener('click', () => {
//     events.emit('order:open');
//   });

//   modal.setContent(cartView.getElement());
//   modal.open();
// });

// Слушатель кнопки корзины
pageView.onBasketClick(() => {
  events.emit('cart:open');
});

// Слушатель на изменение корзины
events.on('cart:changed', (event: { count: number }) => {
  pageView.setCartCount(event.count);

  const items = cartModel.getItems();
  const total = cartModel.getTotal();
  cartView.render({ items, total });
});


events.on('order:open', () => {
  orderModel.reset();
  orderFormView.reset();
  contactsFormView.reset();

  modal.setContent(orderFormView.getElement());
  modal.open();
});

events.on('contacts:open', () => {
  modal.setContent(contactsFormView.render());
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
  const orderData = orderModel.getOrder(
    cartModel.getItems().map((item) => item.id),
    cartModel.getTotal()
  );

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
  const successElement = successView.render(res);
  modal.setContent(successElement);
  modal.open();

  cartModel.clear();
  events.emit('basket:change');
});


// Pакрытие модалки
events.on('modal:close', () => {
  modal.close();
  events.emit('basket:change');
});

//  Получение данных и запуск
api.get('/product')
  .then((data) => {
    const typedData = data as ApiListResponse<IItem>;
    catalogModel.setItems(typedData.items);
    renderCatalog();
    events.emit('cart:changed', { count: cartModel.getItems().length });
  })
  .catch((err) => {
    console.error('Ошибка загрузки товаров:', err);
  });