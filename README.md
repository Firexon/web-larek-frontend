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

## Базовые классы

### Api

Класс `Api` используется для работы с сервером.

- `constructor(baseUrl: string, options?: RequestInit)` — инициализирует экземпляр API клиента.
- `get(uri: string)` — выполняет GET-запрос.
- `post(uri: string, data: object, method: 'POST' | 'PUT' | 'DELETE')` — выполняет POST/PUT/DELETE-запрос.
- `handleResponse(response: Response)` — обрабатывает ответ сервера.

Тип `ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` определён внутри файла `api.ts`.

---

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

---
