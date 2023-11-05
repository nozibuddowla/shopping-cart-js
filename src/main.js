let shop = document.getElementById("shop");

    // Get the cart elements
    let cartAmount = document.getElementById("cart_amount");
    let totalProducts = document.getElementById("total_products");
    let price = document.getElementById("price");
    // let deliveryCharge = document.getElementById("delivery_charge");
    let totalTax = document.getElementById("total_tax");
    let total = document.getElementById("total");
    
    
    let generateShop = () => {
        shopItemsData.forEach(item => {
            let {id, name, price} = item;
            let card = document.createElement('div');
            card.classList.add('col');
            card.innerHTML = `
                <div class="card">
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
            } else if (cart[productId] > 0) {
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
    
    // Initialize the cart data from local storage (if available)
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
        cart = storedCart;
        updateCart(); // Update the cart with the stored data
    }
    
    
    // Function to update both the main cart and sidebar cart
    function updateCartTotals() {
        let totalPrice = 0;
        let totalProductsCount = 0;
    
        for (const productId in cart) {
            if (cart.hasOwnProperty(productId)) {
                const quantity = cart[productId];
                const product = shopItemsData.find((item) => item.id === productId);
    
                // Calculate the price for this product
                const productPrice = product.price * quantity;
    
                totalPrice += productPrice;
                totalProductsCount += quantity;
    
                // Update the quantity display in the sidebar
                document.getElementById(productId).textContent = quantity;
            }
        }
    
        // Update the main cart section
        totalProducts.textContent = totalProductsCount;
        price.textContent = totalPrice.toFixed(2);
        totalTax.textContent = (totalPrice * 0.1).toFixed(2); // Assuming 10% tax
        total.textContent = (totalPrice + 20 + totalPrice * 0.1).toFixed(2); // Including delivery charge and tax
    
        // Update the cart amount in the navbar
        cartAmount.textContent = totalProductsCount;
    }
    
    
    // Function to update the cart and display values
    function updateCart() {
        // Create a sidebar to display added products
        let sidebar = document.getElementById("added_products");
        sidebar.innerHTML = "";
    
        let totalPrice = 0;  // Initialize the total price
        let totalProductsCount = 0;  // Initialize the total product count
    
        for (const productId in cart) {
            if (cart.hasOwnProperty(productId)) {
                const quantity = cart[productId];
                const product = shopItemsData.find((item) => item.id === productId);
    
                // Update the quantity display
                document.getElementById(productId).textContent = quantity;
    
                // Calculate the price for this product
                let productPrice = product.price * quantity;
    
    
                // Add the product to the sidebar
                let sidebarItem = document.createElement("div");
                sidebarItem.innerHTML = `
                    <div class="card mt-2">
                        <div class="card-body d-flex justify-content-between">
                            <h5 class="card-title">${product.name}</h5>
                            <button type="button" class="btn-close" aria-label="Close" id='removeProduct'></button>
                        </div>
                        <div class="card-footer">
                            <div class="price-quantity">
                                <p>$ ${productPrice}</p>
                                <div class="buttons">
                                    <i class="bi bi-dash-lg decrement"></i>
                                    <span id='${product.id}' class="quantity">${quantity}</span>
                                    <i class="bi bi-plus-lg increment"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                sidebar.appendChild(sidebarItem);
    
                // Update the total price and total product count
                totalPrice += productPrice;
                totalProductsCount += quantity;
            }
        }
    
        totalProductsCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
    
        totalProducts.textContent = totalProductsCount;
        price.textContent = totalPrice.toFixed(2);
        totalTax.textContent = (totalPrice * 0.1).toFixed(2); // Assuming 10% tax
        total.textContent = (totalPrice + 20 + totalPrice * 0.1).toFixed(2); // Including delivery charge and tax
    
        // Update the cart amount in the navbar
        cartAmount.textContent = totalProductsCount;
    
        // Update both the main cart and sidebar cart totals
        updateCartTotals();
    
        updateLocalStorage();
    
        // Store the cart data in local storage
        localStorage.setItem("cart", JSON.stringify(cart));
    
        // Add event listeners for increment and decrement buttons in the sidebar
        const incrementButtons = sidebar.querySelectorAll(".increment");
        const decrementButtons = sidebar.querySelectorAll(".decrement");
    
        incrementButtons.forEach((button) => {
            button.addEventListener("click", () => handleQuantityChange(button, "increment"));
        });
    
        decrementButtons.forEach((button) => {
            button.addEventListener("click", () => handleQuantityChange(button, "decrement"));
        });

        // Add event listeners for close buttons in the sidebar
        let closeButtons = sidebar.querySelectorAll("#removeProduct");

        closeButtons.forEach((button) => {
            button.addEventListener("click", () => {
            let productId = button.parentElement.parentElement.querySelector(".quantity").id;
            removeProduct(productId);
            });
        });


        // Define the removeProduct function
        function removeProduct(productId) {
        if (cart[productId] !== undefined) {
            cart[productId] = 0;
            updateCart();
            updateLocalStorage();
        }
        }
    }
    
    // Initial cart update
    updateCart();
    
    // Function to handle quantity changes in the sidebar
    function handleQuantityChange(button, action) {
        const productId = button.parentElement.querySelector(".quantity").id;
    
        if (action === "increment") {
            cart[productId]++;
        } else if (action === "decrement" && cart[productId] > 0) {
            cart[productId]--;
        }
    
        updateCart();
    }
    
    
    // Function to update local storage with cart data
    function updateLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    
    
    
    // Add event listener to the checkout button
    document.getElementById("checkout-button").addEventListener("click", () => {
        // Clear the cart and local storage
        localStorage.removeItem("cart");
        alert("Checkout successful. Cart is now empty.");
        window.location.href = "index.html"; // Redirect to the main shopping page
    });



