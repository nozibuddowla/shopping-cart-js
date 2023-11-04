let shop = document.getElementById("shop");



let generateShop = () => {
    shopItemsData.forEach(item => {
        let {name, price} = item;
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
                        <div id='' class="quantity">0</div>
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