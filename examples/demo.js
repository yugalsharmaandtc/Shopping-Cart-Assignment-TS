const ShoppingCart = require('../src/cart');
const axios = require('axios');

async function demoShoppingCart() {
    const cart = new ShoppingCart();
    
    try {
        // First fetch and show all products from db.json
        console.log('All Available Products:');
        console.log('----------------------');
        const response = await axios.get('http://localhost:3001/products');
        const allProducts = response.data;
        
        allProducts.forEach(product => {
            console.log(`${product.title}: $${product.price}`);
        });
        console.log('----------------------\n');

        
        // Adding the items in the cart
        console.log('1. Added cornflakes (Quantity: 1)');
        await cart.addProduct('cornflakes', 1);
    
        console.log('2. Added shreddies (Quantity: 1)');
        await cart.addProduct('shreddies', 1);
        
       
        console.log("3. Added weetabix (Quantity:1");
        await cart.addProduct('weetabix', 1);
        
      
        console.log('4. Added weetabix (Quantity: 3)');
        await cart.addProduct('weetabix', 3);
        
        // Show final cart 
        const cartState = cart.getCartState();
        
        console.log('\nFinal Cart Contents:');
        console.log('-------------------');
        cartState.items.forEach(item => {
            console.log(`${item.title}: ${item.quantity} x $${item.price}`);
        });
        
        console.log('\nCart Totals:');
        console.log(`Subtotal = $${cartState.subtotal}`);
        console.log(`Tax = $${cartState.tax}`);
        console.log(`Total = $${cartState.total}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}


demoShoppingCart();