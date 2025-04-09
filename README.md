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

### EventEmitter

Класс `EventEmitter` реализует паттерн "Наблюдатель" (Observer) и служит брокером событий. Он реализует интерфейс `IEvents`.

Методы:
- `on(event, callback)` — подписка на событие.
- `off(event, callback)` — отписка.
- `emit(event, data?)` — вызов всех подписчиков.
- `onAll(callback)` — подписка на все события.
- `offAll()` — сброс всех подписчиков.
- `trigger(eventName, context?)` — возвращает функцию-генератор события.

Интерфейс `IEvents` и связанные типы определены внутри `events.ts`.

...

## Модель (Model)
## Api
Задача: Базовый API-клиент. Используется для работы с сервером.

Атрибуты:
`baseUrl: string` — базовый адрес API
`options: RequestInit` — заголовки и конфигурация

Методы:
`get(uri: string): Promise<any>` — запрос на получение данных
`post(uri: string, data: object, method?: string): Promise<any>` — отправка данных
`handleResponse(response: Response): Promise<object>` — обработка ответа

## ProductModel
Задача: Хранит и предоставляет список товаров, а также текущий выбранный элемент (например, при открытии окна "Подробнее").

Атрибуты:
`items: IItem[]` — список всех товаров.
`selectedItem: IItem | null` — текущий выбранный товар.

Методы:
`setItems(items: IItem[])` — загрузить список товаров.
`getItemById(id: string): IItem | undefined` — получить товар по ID.
`selectItem(item: IItem)` — установить выбранный товар.
`getSelectedItem(): IItem | null` — получить текущий выбранный товар.

## CartModel
Задача: Управляет товарами в корзине.

Атрибуты:
`items: ISelectedItem[]` — выбранные товары

Методы:
`addItem(item: ISelectedItem)` — добавить товар
`removeItem(id: string)` — удалить товар
`clear()` — очистить корзину
`getTotal(): number` — получить общую сумму

## FormModel
Задача:
Хранит форму заказа и выполняет её валидацию.

Атрибуты:
`form: IOrderForm` — данные формы

Методы:
`updateForm(data: Partial<IOrderForm>)` — обновить данные формы
`validateForm(): FormErrors` — вернуть ошибки
`getOrder(items: string[], total: number): IServerOrder` — сформировать заказ

...

## ПРЕДСТАВЛЕНИЯ (View)
## CardView
Задача: Отображает карточку товара.

Атрибуты:
`element: HTMLElement` — DOM-элемент карточки
`data: IItem` — данные товара

Методы:
`render(data: IItem)` — отрисовка
`setPrice(price: number)` — установка цены
`setCategory(category: string)` — установка категории

## CardPreviewView
Задача: Показывает подробности товара с кнопкой "Купить".

Методы:
`renderFull()` — отрисовка полной карточки
`disableIfNoPrice()` — скрыть кнопку при отсутствии цены

## CartView
Задача: Отображает корзину с товарами и суммой.

Методы:
`renderList(items: ISelectedItem[])`
`renderTotal(sum: number)`

## OrderView и ContactsView
Задача: Формы для ввода адреса и контактов.

Методы:
`render(), update()`

## ModalView
Задача: Модальное окно.

Методы:
`open(content: HTMLElement)`
`close`

## SuccessView
Задача: Экран успешного оформления заказа.

Методы:
`render(orderId: string, total: number)`

...

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

