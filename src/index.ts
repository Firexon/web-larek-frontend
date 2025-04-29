import './scss/styles.scss';

import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { events } from './components/base/events';

import { API_URL } from './utils/constants';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { FormModel } from './components/models/FormModel';
import { OrderModel } from './components/models/Order';

import { CardView } from './components/views/CardView';
import { CardPreviewView } from './components/views/CardPreviewView';
import { CartView } from './components/views/CartView';
import { CartItemView } from './components/views/CartItemView';
import { ModalView } from './components/views/ModalView';
import { OrderView } from './components/views/OrderView';
import { ContactsView } from './components/views/ContactsView';
import { SuccessView } from './components/views/SuccessView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';

import { IItem, ISelectedItem, IServerOrder,  IOrderResponse, IContactsForm } from './types';

//  Создание API-клиента
const api = new Api(API_URL);

// const events = new EventEmitter();

//  Модели
const catalogModel = new CatalogModel();
const cartModel = new CartModel(events); 
const formModel = new FormModel();
const orderModel = new OrderModel();

//  Представления 
const modal = new ModalView(document.querySelector('#modal-container') as HTMLElement);


const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
// const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const basketButton = document.querySelector('.header__basket');
const cartCounter = document.querySelector('.header__basket-counter');

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

  const submitButton = cartView.getSubmitButton();
  submitButton.disabled = cartModel.getItems().length === 0;

  submitButton.addEventListener('click', () => {
  events.emit('order:open');
});

  modal.setContent(cartView.getElement());
  modal.open();
});

basketButton.addEventListener('click', () => {
  events.emit('cart:open');
});

//  Оформления заказа 
events.on('order:open', () => {
  const formView = new OrderForm(orderTemplate);
  formView.setNextButtonActive(false);

  // При выборе способа оплаты
  formView.listenPaymentChoice((method) => {
    orderModel.setPayment(method);
    formView.setActivePayment(method);
    checkFormValidity();
  });

  // При вводе адреса
  formView.listenAddressInput(() => {
    orderModel.setAddress(formView.address);
    checkFormValidity();
  });

  // Проверка валидности
  function checkFormValidity() {
    const valid = formView.paymentMethod && formView.address.trim() !== '';
    formView.setNextButtonActive(valid);
  }

  const selectedItems = cartModel.getItems();
  const itemIds = selectedItems.map(item => item.id);
  const total = cartModel.getTotal();
  
  orderModel.setItems(itemIds, total);


  formView.getElement().addEventListener('submit', (e) => {
    e.preventDefault();
    events.emit('contacts:open');
  });

  modal.setContent(formView.getElement());
  modal.open();
});

// Слушатель на изменение корзины
events.on('cart:changed', (event: { count: number }) => {
  if (cartCounter) {
    cartCounter.textContent = String(event.count);
  }
});

// Обработка открытия формы контактов
events.on('contacts:open', () => {
  const contactsForm = new ContactsForm(contactsTemplate);
  modal.setContent(contactsForm.render());
  modal.open();

  // Обработка ввода
  contactsForm.onInputChange(() => {
    const isValid = contactsForm.isValid();
    contactsForm.setSubmitButtonState(isValid);
  });

  // Отправка формы
  contactsForm.onSubmit((data: IContactsForm) => {
    const orderData = {
      ...data,
      address: orderModel.getAddress(),
      payment: orderModel.getPayment(),
      items: orderModel.getOrderItems(),
      total: orderModel.getTotal()
    };

    api.post('/order', orderData)
      .then((response: IOrderResponse) => {
        events.emit('order:success', response);
      })
      .catch((err) => {
        console.error('Ошибка отправки заказа:', err);
      });
  });
});

// Обработка успешного оформления заказа
events.on('order:success', (res: IOrderResponse) => {
  const successTemplate = document.getElementById('success') as HTMLTemplateElement;
  const successView = new SuccessView(successTemplate);
  const content = successView.render(res);

  successView.getButton().addEventListener('click', () => {
    cartModel.clear();
    orderModel.clear();
    modal.close();
    renderCatalog();
  });

  modal.setContent(content);
  modal.open();

  modal.setCloseHandler(() => {
    cartModel.clear();
    orderModel.clear();
    renderCatalog(); 
  });
});

//  Закрытие по крестику и оверлею
modal.setCloseHandler(() => modal.close());

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