const ShoppingCart = require('../src/cart');
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function showAllProducts() {
    const response = await axios.get('http://localhost:3001/products');
    console.log('\nAll Available Products:');
    console.log('----------------------');
    response.data.forEach(product => {
        console.log(`${product.title}: $${product.price}`);
    });
    console.log('----------------------\n');
}

async function addProductsToCart(cart) {
    try {
        while (true) {
            const productName = await askQuestion('Enter product name: ');
            const quantity = parseInt(await askQuestion('Enter quantity: '));
            
            if (isNaN(quantity) || quantity <= 0) {
                console.log('Please enter a valid quantity!\n');
                continue;
            }
            
            await cart.addProduct(productName.toLowerCase(), quantity);
            
            // Show updated cart
            const currentState = cart.getCartState();
            console.log('\nCurrent Cart Contents:');
            console.log('-------------------');
            currentState.items.forEach(item => {
                console.log(`${item.title}: ${item.quantity} x $${item.price}`);
            });
            
            console.log('\nCart Totals:');
            console.log(`Subtotal = $${currentState.subtotal}`);
            console.log(`Tax = $${currentState.tax}`);
            console.log(`Total = $${currentState.total}\n`);
            
            const continue_shopping = await askQuestion('Type "done" to finish or any other key to continue shopping: ');
            if (continue_shopping.toLowerCase() === 'done') {
                break;
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function interactiveCart() {
    const cart = new ShoppingCart();
    
    try {
        // Show all available products first
        await showAllProducts();
        
        // Start adding products
        await addProductsToCart(cart);
        
        // Show final cart state
        const finalState = cart.getCartState();
        console.log('\nFinal Cart Contents:');
        console.log('-------------------');
        finalState.items.forEach(item => {
            console.log(`${item.title}: ${item.quantity} x $${item.price}`);
        });
        
        console.log('\nFinal Cart Totals:');
        console.log(`Subtotal = $${finalState.subtotal}`);
        console.log(`Tax = $${finalState.tax}`);
        console.log(`Total = $${finalState.total}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        rl.close();
    }
}

// Run the interactive cart
console.log('Shopping Cart Example');
interactiveCart();