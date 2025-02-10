import { ShoppingCart } from '../../src/cart';
import axios from 'axios';
import { createInterface } from 'readline';
import { ApiProduct, CartState } from '../../src/types'; 

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function showAllProducts(): Promise<void> {
    const response = await axios.get<ApiProduct[]>('http://localhost:3001/products');
    console.log('\nAll Available Products:');
    console.log('----------------------');
    response.data.forEach(product => {
        console.log(`${product.title}: $${product.price}`);
    });
    console.log('----------------------\n');
}

async function showCartState(cartState: CartState): Promise<void> {
    console.log('\nCurrent Cart Contents:');
    console.log('-------------------');
    cartState.items.forEach(item => {
        console.log(`${item.title}: ${item.quantity} x $${item.price}`);
    });
    
    console.log('\nCart Totals:');
    console.log(`Subtotal = $${cartState.subtotal}`);
    console.log(`Tax = $${cartState.tax}`);
    console.log(`Total = $${cartState.total}\n`);
}
// Show cart for current products
async function addProductsToCart(cart: ShoppingCart): Promise<void> {
    try {
        while (true) {
            const productName = await askQuestion('Enter product name: ');
            const quantityStr = await askQuestion('Enter quantity: ');
            const quantity = parseInt(quantityStr);
            
            if (isNaN(quantity) || quantity <= 0) {
                console.log('Please enter a valid quantity!\n');
                continue;
            }
            
            await cart.addProduct(productName.toLowerCase(), quantity);
            
            // Show updated cart
            const currentState = cart.getCartState();
            await showCartState(currentState);
            
            const continueShopping = await askQuestion('Type "done" to finish or any other key to continue shopping: ');
            if (continueShopping.toLowerCase() === 'done') {
                break;
            }
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    }
}

async function interactiveCart(): Promise<void> {
    const cart = new ShoppingCart();
    
    try {
        // Show all available products first
        await showAllProducts();
        
        // Start adding products
        await addProductsToCart(cart);
        
        // Show final cart state
        const finalState = cart.getCartState();
        await showCartState(finalState);
        
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
        rl.close();
    }
}


console.log('Shopping Cart Example');
interactiveCart();