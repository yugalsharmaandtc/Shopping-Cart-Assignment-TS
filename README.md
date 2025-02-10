## :warning: Please read these instructions carefully and entirely first
* Clone this repository to your local machine.
* Use your IDE of choice to complete the assignment.
* Use Javascript or preferably Typescript to complete the assignment, other languages will not be considered unfortunately.
* When you have completed the assignment, you need to  push your code to a public repository and send the link via email.
* Once you reply back to the email, your assignment will be considered completed. Please make sure that you have completed the assignment and pushed all code from your local machine to the repository before you reply.
* There is no time limit for this task - however, for guidance, it is expected to typically take around 3-4 hours.

# Begin the task

Write some code that provides the following basic shopping cart capabilities:

1. Add a product to the cart
   1. Specifying the product name and quantity
   2. Retrieve the product price by issuing a request to the the [Price API](#price-api) specified below
   3. Cart state (totals, etc.) must be available

2. Calculate the state:
   1. Cart subtotal (sum of price for all items)
   2. Tax payable (charged at 12.5% on the subtotal)
   3. Total payable (subtotal + tax)
   4. Totals should be rounded up where required

## Price API

The price API is an HTTP service that returns the price details for a product, identified by it's name. The shopping cart should integrate with the price API to retrieve product prices. 

### Price API Service Details

Start the price API by running the following command: `npm run serve-products`

Base URL: `http://localhost:3001/`

View Product: `GET /products/{product}`

List of available products
* `cheerios`
* `cornflakes`
* `frosties`
* `shreddies`
* `weetabix`

## Example
The below is a sample with the correct values you can use to confirm your calculations

### Inputs
* Add 1 × cornflakes @ 2.52 each
* Add another 1 x cornflakes @2.52 each
* Add 1 × weetabix @ 9.98 each
  
### Results  
* Cart contains 2 x cornflakes
* Cart contains 1 x weetabix
* Subtotal = 15.02
* Tax = 1.88
* Total = 16.90

## Tips on what we’re looking for

* We value simplicity as an architectural virtue and as a development practice. Solutions should reflect the difficulty of the assigned task, and shouldn’t be overly complex.
* We prefer simple, well tested solutions over clever solutions.
* We will appreciate descriptive and unambiguous names for the concepts you introduce.
* Atomic commits with descriptive messages will get you extra brownie points.

### DO

* ✅ Include unit tests.
* ✅ Test both any client and logic.
* ✅ Update the README.md with any relevant information, assumptions, and/or tradeoffs you would like to highlight.
* ✅ Add some information on how the reviewer might test your solution.

### DO NOT

* ❌ Submit any form of app, such as web APIs, browser, desktop, or command-line applications.
* ❌ Add unnecessary layers of abstraction.
* ❌ Add unnecessary patterns/ architectural features that aren’t called for e.g. persistent storage.





###--Shopping Cart Implementation
A simple shopping cart implementation that calculates totals and handles product management.

###Features
Add products to cart with quantities
Automatic price fetching from API
Tax calculation (12.5%)
Proper rounding of monetary values
Simple and focused implementation

###Installation
1.npm install
Testing
2.npm test


###Example Scripts
The examples/ directory contains demonstration scripts showing how to use the shopping cart:

###Start the price API:

npm run serve-products

###Run an example:

1.npm run start:demo -- Demo gives you the option to see functionality from the code itself like you can add and delete the products from the code itself
2.  npm run start:input -- Input gives you the option to see the functionality using your given inputs and see how the cart state gets updated with your input(must try fun also) 
Note: These example scripts are provided for demonstration purposes only and are not part of the core solution.

###Design
Simple Implementation: Focused on core shopping cart functionality without unnecessary abstractions
Input Validation: hard validation for product IDs and quantities
Error Handling: Clear error messages for API failures and invalid inputs
Testing: Comprehensive tests covering core functionality
Rounding: All values are rounded up to nearest value as per requirements

###Assumptions

Product IDs are case-sensitive strings
Quantities must be positive integers
Tax rate is fixed at 12.5%
All monetary calculations are in the same currency
API is available at localhost:3001

###Atomic commits were not done since whole project is done in one time sitting only.