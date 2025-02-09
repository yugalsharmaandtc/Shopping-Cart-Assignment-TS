// Cart.test.js
const ShoppingCart = require('./cart');
const axios = require('axios');

jest.mock('axios');

describe('ShoppingCart', () => {
  let cart;

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
      expect(customCart.baseUrl).toBe('http://custom-url');
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid product IDs', async () => {
      await expect(cart.addProduct('', 1)).rejects.toThrow('Product ID must be a non-empty string');
      await expect(cart.addProduct(null, 1)).rejects.toThrow('Product ID must be a non-empty string');
      await expect(cart.addProduct(undefined, 1)).rejects.toThrow('Product ID must be a non-empty string');
    });

    it('should reject invalid quantities', async () => {
      await expect(cart.addProduct('cornflakes', 0)).rejects.toThrow('Quantity must be a positive integer');
      await expect(cart.addProduct('cornflakes', -1)).rejects.toThrow('Quantity must be a positive integer');
      await expect(cart.addProduct('cornflakes', 1.5)).rejects.toThrow('Quantity must be a positive integer');
    });
  });

  describe('Product Management', () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({
        data: { id: 'cornflakes', title: 'Cornflakes', price: 4.99 }
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
      axios.get.mockRejectedValue(new Error('Network error'));
      await expect(cart.addProduct('invalid', 1))
        .rejects.toThrow('Failed to add product: Product not found: invalid');
    });
  });

  describe('Calculations', () => {
    it('should do claculation', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('cornflakes')) {
          return Promise.resolve({ data: { id: 'cornflakes', price: 2.52, title: 'Cornflakes' } });
        }
        if (url.includes('weetabix')) {
          return Promise.resolve({ data: { id: 'weetabix', price: 9.98, title: 'Weetabix' } });
        }
      });

      await cart.addProduct('cornflakes', 2);
      await cart.addProduct('weetabix', 1);
      
      const state = cart.getCartState();
      
      expect(state.subtotal).toBe(15.02); // (2.52 * 2) + 9.98
      expect(state.tax).toBe(1.88);       // 15.02 * 0.125
      expect(state.total).toBe(16.90);    // 15.02 + 1.88
    });

    it('should round up totals correctly', async () => {
      axios.get.mockResolvedValue({
        data: { id: 'test', price: 1.11, title: 'Test Product' }
      });
      
      await cart.addProduct('test', 1);
      const state = cart.getCartState();
      
      expect(state.subtotal).toBe(1.11);
      expect(state.tax).toBe(0.14);      // 1.11 * 0.125 = 0.13875, rounds up to 0.14
      expect(state.total).toBe(1.25);    // 1.11 + 0.14 = 1.25
    });
  });
});