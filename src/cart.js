const axios = require('axios');

class ShoppingCart {
  constructor(baseUrl = 'http://localhost:3001') {
    this.items = new Map();
    this.baseUrl = baseUrl;
  }

  async addProduct(productId, quantity) {
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
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  async fetchProduct(productId) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Product not found: ${productId}`);
    }
  }

  calculateTotals() {
    const items = Array.from(this.items.values());
    
    // Calculate subtotal without rounding
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Calculate tax and round up
    const tax = this.roundUp(subtotal * 0.125); // 12.5% tax rate
    
    // Calculate total by adding rounded tax to subtotal
    const total = this.roundUp(subtotal + tax);

    return {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      // Round subtotal to 2 decimal places without rounding up
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      total
    };
  }

  roundUp(value) {
    return Math.ceil(value * 100) / 100;
  }

  getCartState() {
    return this.calculateTotals();
  }
}

module.exports = ShoppingCart;