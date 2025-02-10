import axios from 'axios';
import { CartState, CartItem, ApiProduct } from './types';

export class ShoppingCart {
  private items: Map<string, CartItem>;
  private readonly baseUrl: string;
  private readonly TAX_RATE = 0.125; // 12.5%

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.items = new Map();
    this.baseUrl = baseUrl;
  }

  public async addProduct(productId: string, quantity: number): Promise<CartState> {
    if (!productId || typeof productId !== 'string') {
      throw new Error('Product ID must be a non-empty string');
    }
    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    try {
      const product = await this.fetchProduct(productId);
      const currentQuantity = this.items.get(productId)?.quantity || 0;
      
      this.items.set(productId, {
        id: productId,
        quantity: currentQuantity + quantity,
        price: product.price,
        title: product.title
      });
      
      return this.getCartState();
    } catch (error) {
      throw new Error(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchProduct(productId: string): Promise<ApiProduct> {
    try {
      const response = await axios.get<ApiProduct>(`${this.baseUrl}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Product not found: ${productId}`);
    }
  }

  private calculateTotals(): CartState {
    const items = Array.from(this.items.values());
    
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const tax = this.roundUp(subtotal * this.TAX_RATE);
    const total = this.roundUp(subtotal + tax);

    return {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      total
    };
  }

  private roundUp(value: number): number {
    return Math.ceil(value * 100) / 100;
  }

  public getCartState(): CartState {
    return this.calculateTotals();
  }
}