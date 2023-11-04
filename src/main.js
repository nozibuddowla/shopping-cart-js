let shop = document.getElementById("shop");

// Get the cart elements
let cartAmount = document.getElementById("cart_amount");
let totalProducts = document.getElementById("total_products");
let price = document.getElementById("price");
let deliveryCharge = document.getElementById("delivery_charge");
let totalTax = document.getElementById("total_tax");
let total = document.getElementById("total");


let generateShop = () => {
    shopItemsData.forEach(item => {
        let {id, name, price} = item;
        let card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card"">
                <div class="card-body">
                <h5 class="card-title">${name}</h5>
                </div>
                <div class="card-footer">
                    <div class="price-quantity">
                        <h2> ${price}</h2>
                        <div class="buttons">
                            <i class="bi bi-dash-lg"></i>
                            <div id='${id}' class="quantity">0</div>
                            <i class="bi bi-plus-lg"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        shop.appendChild(card);
    })

    
}

generateShop();

// Create an empty cart object to store selected products
let cart = {};

// Add event listeners to increment and decrement buttons
shop.addEventListener("click", (event) => {
    if (event.target.classList.contains("bi-plus-lg")) {
        // Increment button clicked
        const productId = event.target.parentElement.querySelector(".quantity").id;

        if (cart[productId] === undefined) {
            cart[productId] = 1; // Initialize the quantity to 1
        } else {
            cart[productId]++; // Increment the quantity
        }
        updateCart();
    } else if (event.target.classList.contains("bi-dash-lg")) {
        // Decrement button clicked
        const productId = event.target.parentElement.querySelector(".quantity").id;

        if (cart[productId] !== undefined && cart[productId] > 0) {
            cart[productId]--; // Decrement the quantity
            updateCart();
        }
    }
});


// Function to update the cart and display values
function updateCart() {
    let totalProductsCount = 0;
    let totalPrice = 0;

    // Create a sidebar to display added products
    let sidebar = document.getElementById("added_products");
    sidebar.innerHTML = "";

    for (const productId in cart) {
        if (cart.hasOwnProperty(productId)) {
            const quantity = cart[productId];
            const product = shopItemsData.find((item) => item.id === productId);

            totalProductsCount += quantity;
            totalPrice += product.price * quantity;

            // Update the quantity display
            document.getElementById(productId).textContent = quantity;

            // Add the product to the sidebar
            let sidebarItem = document.createElement("div");
            sidebarItem.innerHTML = `
                <div class="card mt-2">
                    <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    </div>
                    <div class="card-footer">
                        <div class="price-quantity">
                            <p> ${product.price}</p>
                            <div class="buttons">
                                <i class="bi bi-dash-lg"></i>
                                <span id='${product.id}' class="quantity">${quantity}</span>
                                <i class="bi bi-plus-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            sidebar.appendChild(sidebarItem);
        }
    }

    totalProducts.textContent = totalProductsCount;
    price.textContent = totalPrice.toFixed(2);
    totalTax.textContent = (totalPrice * 0.1).toFixed(2); // Assuming 10% tax
    total.textContent = (totalPrice + 20 + totalPrice * 0.1).toFixed(2); // Including delivery charge and tax

    // Update the cart amount in the navbar
    cartAmount.textContent = totalProductsCount;
}

// Initial cart update
updateCart();