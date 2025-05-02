// Тип карточки товара от сервера
export interface IItem {
	id: string;
	title: string;
	description: string;
	image: string;
	category: 'soft' | 'hard' | 'other' | 'additional' | 'button';
	price: number | null;
}

// Тип выбранного товара для корзины
export interface ISelectedItem {
	id: string;
	title: string;
	price: number;
}

// Типы для формы заказа (шаги оформления)
export interface IOrderForm {
	address?: string;
	payment?: string;
	email?: string;
	phone?: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

// Полный заказ, отправляемый на сервер
export interface IServerOrder extends IOrderForm {
	items: string[];
	total: number;
}

// Ответ от сервера после отправки заказа
export interface IOrderResponse {
	id: string;
	total: number;
}

// Тип для хранения ошибок формы
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// Обработчик клика (на карточке, кнопке, и т.д.)
export interface IClickHandler {
	onClick: (event: MouseEvent) => void;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}