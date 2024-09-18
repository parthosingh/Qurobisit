const product = [
    { id: 0, image: 'image/gg-1.jpg', title: 'Z Flip Foldable Mobile', price: 120, category: 'electronics' },
    { id: 1, image: 'image/hh-2.jpg', title: 'Air Pods Pro', price: 60, category: 'electronics' },
    { id: 2, image: 'image/ee-3.jpg', title: '250D DSLR Camera', price: 230, category: 'electronics' },
    { id: 3, image: 'image/aa-1.jpg', title: 'Head Phones', price: 100, category: 'electronics' },
    { id: 4, image: 'image/tshirt.jpg', title: 'T-Shirt', price: 20, category: 'fashion' }
];

let cart = [];
let i = 0;

const categories = [...new Set(product.map(item => item))];

// Display all products
document.getElementById('root').innerHTML = categories.map(item => {
    const { image, title, price } = item;
    return (
        `<div class='box'>
            <div class='img-box'>
                <img class='images' src=${image} alt=${title}></img>
            </div>
            <div class='bottom'>
                <p>${title}</p>
                <h2>$ ${price}.00</h2>` +
        `<button onclick='addtocart(${i++})'>Add to cart</button>` +
        `</div>
        </div>`
    );
}).join('');

// Add item to cart
function addtocart(a) {
    let item = { ...categories[a], quantity: 1 };
    let existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    displaycart();
}

// Remove item from cart by id
function delElement(id) {
    cart = cart.filter(item => item.id !== id);  // Remove the item with the given id
    displaycart();
}

// Display cart items
function displaycart() {
    let total = 0;
    document.getElementById("count").innerHTML = cart.length;
    if (cart.length === 0) {
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerHTML = "$ 0.00";
        document.getElementById("convertedTotal").innerHTML = "";
    } else {
        document.getElementById('cartItem').innerHTML = cart.map(item => {
            const { image, title, price, quantity, id } = item;
            total += price * quantity;
            document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
            return (
                `<div class='cart-item'>
                    <div class='row-img'>
                        <img class='rowimg' src=${image} alt=${title}>
                    </div>
                    <p>${title} (x${quantity})</p>
                    <h2>$ ${price}.00</h2>
                    <button class='del-btn' onclick='delElement(${id})'>Remove</button>
                </div>`
            );
        }).join('');
    }
}

// Checkout and apply discounts
function applyDiscounts(cart) {
    let totalDiscount = 0;
    let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let fashionItems = cart.filter(item => item.category === 'fashion');
    let electronicsItems = cart.filter(item => item.category === 'electronics');
    
    // Buy 1 Get 1 Free for fashion items
    fashionItems.forEach(item => {
        if (item.quantity >= 2) {
            totalDiscount += item.price * Math.floor(item.quantity / 2);
        }
    });

    // 10% off for electronics
    electronicsItems.forEach(item => {
        totalDiscount += item.price * item.quantity * 0.10;
    });

    return totalPrice - totalDiscount;
}

// Checkout and currency conversion
function checkout() {
    let totalAfterDiscount = applyDiscounts(cart);
    document.getElementById("total").innerHTML = "$ " + totalAfterDiscount.toFixed(2);

    const currency = prompt("Would you like to view it in a different currency? Enter 'EUR', 'GBP', or 'USD'");

    const conversionRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.75
    };

    if (conversionRates[currency]) {
        const convertedTotal = (totalAfterDiscount * conversionRates[currency]).toFixed(2);
        document.getElementById("convertedTotal").innerHTML = `Final Total in ${currency}: $${convertedTotal}`;
    } else {
        document.getElementById("convertedTotal").innerHTML = "Invalid currency entered. Showing total in USD.";
    }
}

document.getElementById('checkoutBtn').addEventListener('click', checkout);
