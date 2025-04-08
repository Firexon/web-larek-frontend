
export interface IItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string; 
  price: number | null;
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

// Ответ от сервера после заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// ошибка
export type FormErrors = Partial<Record<keyof IServerOrder, string>>;
