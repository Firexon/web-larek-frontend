
export interface IItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string; 
  price: number | null;
}

// корзина
export interface ICartItem extends IItem {
  index: number;
}

// Заказ до отправки
export interface IOrderForm {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
}

// Готовый заказ для отправки
export interface IOrder extends IOrderForm {
  items: string[];
}

// Запрос при отправке заказа 
export interface IServerOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

