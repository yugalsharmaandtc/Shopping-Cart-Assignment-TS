export interface Product {
  id: string;
  title: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface ApiProduct {
  id: string;
  title: string;
  price: number;
}