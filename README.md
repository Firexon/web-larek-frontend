# Проектная работа "Веб-ларек" - интернет-магазин с товарами для веб-разработчиков

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

Архитектура приложения написана на паттерне MVP

- Модель (Model) — хранение и управление данными
- Представление (View) — отображение интерфейса и элементов
- Презентер (Presenter) — связывает модель и представление

Дополнительно используются брокер событий (EventEmitter) и API-клиент (Api).
...
 
Архитектура проекта
Описание компонентов

## base
## api.ts
Задача: Обёртка над API для выполнения HTTP-запросов.

Атрибуты: baseUrl, headers.

Методы: get(), post(), put(), delete() — запросы к серверу.

## events.ts
Задача: Реализация шаблона событийной подписки.

Атрибуты: _listeners: Record<string, Function[]>

Методы: on(), emit(), off() — управление событиями.

## models
## CartModel.ts
Задача: Хранение и управление данными корзины.

Атрибуты: items, total.

Методы: addItem(), removeItem(), clear().

## CatalogModel.ts
Задача: Управление списком товаров каталога.

Атрибуты: items: IProduct[].

Методы: setItems(), getItemById().

## FormModel.ts
Задача: Управление данными формы заказа.

Атрибуты: name, email, phone.

Методы: updateField(), validate().

## Order.ts
Задача: Представление модели заказа.

Атрибуты: orderItems, total, contacts.

Методы: submit(), setField().

## ProductModel.ts
Задача: Представление товара.

Атрибуты: id, title, price, description.

Методы: toggleFavorite().

## views
## CardPreviewView.ts
Задача: Отображение подробной информации о товаре.

Атрибуты: template, actions.

Методы: render(item: IProduct).

## CardView.ts
Задача: Карточка товара в списке.

Атрибуты: template, actions.

Методы: render(item: IProduct).

## CartItemView.ts
Задача: Отображение одного товара в корзине.

Атрибуты: template, actions.

Методы: render(item: ICartItem).

## ContactsForm.ts
Задача: Форма ввода контактных данных.

Атрибуты: form, fields.

Методы: getData(), setData().

## ContactsView.ts
Задача: Визуализация контактных данных.

Атрибуты: container, data.

Методы: render().

## ModalView.ts
Задача: Управление модальными окнами.

Атрибуты: container, overlay, closeBtn.

Методы: open(), close(), render().

## OrderForm.ts
Задача: Форма оформления заказа.

Атрибуты: form, fields.

Методы: getData(), validate().

## OrderView.ts
Задача: Отображение финальной информации о заказе.

Атрибуты: container, summary.

Методы: render(order).

## SuccessView.ts
Задача: Отображение сообщения об успешном заказе.

Атрибуты: template.

Методы: render().

## View.ts
Задача: Базовый абстрактный класс для всех View.

Атрибуты: template, container.

Методы: render(), clear(), append().

## ПРЕЗЕНТЕРЫ (Presenter)
Презентер реализован как набор пользовательских событий
Вся логика связывания моделей, представлений и пользовательских действий реализуется в `index.ts` через подписки на события, используя `EventEmitter`.

- card:add - Добавление товара в корзину
- card:remove -	Удаление товара из корзины
- cart:clear -	Очистка корзины
- form:update -	Обновление данных формы
- form:submit -	Отправка формы заказа
- order:success -	Заказ успешно оформлен
- order:error -	Ошибка при оформлении заказа

...

## Взаимодействие между слоями

Всё взаимодействие реализовано через Presenter:
1. View генерирует пользовательские события (например, клик по кнопке).
2. Presenter слушает события и вызывает методы модели.
3. Модель обновляет данные, Presenter сообщает View обновиться.

Коммуникация реализована через брокер событий EventEmitter.

 ... 

