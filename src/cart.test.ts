import { ShoppingCart } from './cart';
import axios from 'axios';
import { ApiProduct } from './types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ShoppingCart', () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with empty cart', () => {
      const state = cart.getCartState();
      expect(state.items).toHaveLength(0);
      expect(state.subtotal).toBe(0);
      expect(state.tax).toBe(0);
      expect(state.total).toBe(0);
    });

    it('should accept custom base URL', () => {
      const customCart = new ShoppingCart('http://custom-url');
      expect(customCart).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid product IDs', async () => {
      await expect(cart.addProduct('', 1)).rejects.toThrow('Product ID must be a non-empty string');
      await expect(cart.addProduct('' as any, 1)).rejects.toThrow('Product ID must be a non-empty string');
    });

    it('should reject invalid quantities', async () => {
      await expect(cart.addProduct('cornflakes', 0)).rejects.toThrow('Quantity must be a positive integer');
      await expect(cart.addProduct('cornflakes', -1)).rejects.toThrow('Quantity must be a positive integer');
      await expect(cart.addProduct('cornflakes', 1.5)).rejects.toThrow('Quantity must be a positive integer');
    });
  });

  describe('Product Management', () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({
        data: { id: 'cornflakes', title: 'Cornflakes', price: 4.99 } as ApiProduct
      });
    });

    it('should add new product to cart', async () => {
      await cart.addProduct('cornflakes', 1);
      const state = cart.getCartState();
      
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        id: 'cornflakes',
        title: 'Cornflakes',
        price: 4.99,
        quantity: 1
      });
    });

    it('should update quantity for existing product', async () => {
      await cart.addProduct('cornflakes', 1);
      await cart.addProduct('cornflakes', 2);
      
      const state = cart.getCartState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));
      await expect(cart.addProduct('invalid', 1))
        .rejects.toThrow('Failed to add product: Product not found: invalid');
    });
  });

  describe('Calculations', () => {
    it('should match README example calculations', async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('cornflakes')) {
          return Promise.resolve({ data: { id: 'cornflakes', price: 2.52, title: 'Cornflakes' } });
        }
        if (url.includes('weetabix')) {
          return Promise.resolve({ data: { id: 'weetabix', price: 9.98, title: 'Weetabix' } });
        }
        return Promise.reject(new Error('Product not found'));
      });

      await cart.addProduct('cornflakes', 2);
      await cart.addProduct('weetabix', 1);
      
      const state = cart.getCartState();
      
      expect(state.subtotal).toBe(15.02);
      expect(state.tax).toBe(1.88);
      expect(state.total).toBe(16.90);
    });

    it('should round up totals correctly', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { id: 'test', price: 1.11, title: 'Test Product' }
      });
      
      await cart.addProduct('test', 1);
      const state = cart.getCartState();
      
      expect(state.subtotal).toBe(1.11);
      expect(state.tax).toBe(0.14);
      expect(state.total).toBe(1.25);
    });
  });
});