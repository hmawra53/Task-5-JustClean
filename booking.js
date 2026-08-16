const services = [
    {id: 1, name: "Regular Home Cleaning", price: 799, category: "Home Cleaning", duration: "2-3 hours", icon: "fa-house"},
    {id: 2, name: "Deep Home Cleaning", price: 1499, category: "Home Cleaning", duration: "4-5 hours", icon: "fa-broom"},
    {id: 3, name: "Kitchen Cleaning", price: 699, category: "Kitchen", duration: "2 hours", icon: "fa-kitchen-set"},
    {id: 4, name: "Bathroom Cleaning", price: 499, category: "Bathroom", duration: "1-2 hours", icon: "fa-bath"},
    {id: 5, name: "Sofa Cleaning", price: 899, category: "Specialized", duration: "2 hours", icon: "fa-couch"},
    {id: 6, name: "Carpet Cleaning", price: 749, category: "Specialized", duration: "2 hours", icon: "fa-rug"},
    {id: 7, name: "Move-In Cleaning", price: 1999, category: "Specialized", duration: "5-6 hours", icon: "fa-box-open"},
    {id: 8, name: "Window Cleaning", price: 599, category: "Specialized", duration: "2 hours", icon: "fa-window-maximize"},
    {id: 9, name: "Office Cleaning", price: 1299, category: "Home Cleaning", duration: "3-4 hours", icon: "fa-building"},
    {id: 10, name: "Laundry Service", price: 399, category: "Specialized", duration: "1-2 hours", icon: "fa-shirt"},
    {id: 11, name: "Fridge Cleaning", price: 449, category: "Kitchen", duration: "1-2 hours", icon: "fa-box"},
    {id: 12, name: "Chimney Cleaning", price: 799, category: "Kitchen", duration: "2 hours", icon: "fa-fan"}
];
window.__justCleanServices = services;

if (document.getElementById("serviceGrid")) {


const servicesPerPage = 4;
let currentPage = 1;
let cart = JSON.parse(localStorage.getItem("justCleanCart")) || [];

const search = document.getElementById("serviceSearch");
const category = document.getElementById("categoryFilter");
const sort = document.getElementById("sortServices");
const grid = document.getElementById("serviceGrid");
const pagination = document.getElementById("pagination");
const resultCount = document.getElementById("resultCount");
const noServices = document.getElementById("noServices");
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartCount = document.getElementById("cartCount");
const cartItemsTotal = document.getElementById("cartItemsTotal");
const cartTotal = document.getElementById("cartTotal");

function filteredServices() {
    let results = services.filter(service => {
        const text = search.value.trim().toLowerCase();
        const matchesSearch = service.name.toLowerCase().includes(text);
        const matchesCategory = category.value === "all" || service.category === category.value;
        return matchesSearch && matchesCategory;
    });

    if (sort.value === "price-asc") results.sort((a, b) => a.price - b.price);
    if (sort.value === "price-desc") results.sort((a, b) => b.price - a.price);
    if (sort.value === "name-asc") results.sort((a, b) => a.name.localeCompare(b.name));
    if (sort.value === "name-desc") results.sort((a, b) => b.name.localeCompare(a.name));

    return results;
}

function renderServices() {
    const results = filteredServices();
    const totalPages = Math.max(1, Math.ceil(results.length / servicesPerPage));

    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * servicesPerPage;
    const visible = results.slice(start, start + servicesPerPage);

    grid.innerHTML = "";
    resultCount.textContent = `${results.length} service${results.length === 1 ? "" : "s"}`;

    visible.forEach(service => {
        const card = document.createElement("article");
        card.className = "service-card";
        card.innerHTML = `
            <div class="service-icon"><i class="fa-solid ${service.icon}"></i></div>
            <span class="service-category">${service.category}</span>
            <h3>${service.name}</h3>
            <p><i class="fa-regular fa-clock"></i> ${service.duration}</p>
            <div class="service-bottom">
                <strong>₹${service.price}</strong>
                <button class="details-btn" onclick="showServiceDetails(${service.id})">Details</button>
            </div>
            <button class="add-service" onclick="addToCart(${service.id})">
                <i class="fa-solid fa-plus"></i> Add to Booking
            </button>
        `;
        grid.appendChild(card);
    });

    noServices.style.display = visible.length ? "none" : "block";
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;
        button.className = page === currentPage ? "active" : "";
        button.addEventListener("click", () => {
            currentPage = page;
            renderServices();
            window.scrollTo({top: 250, behavior: "smooth"});
        });
        pagination.appendChild(button);
    }
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({id, qty: 1});
    }
    saveCart();
    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.qty += amount;
    if (item.qty <= 0) cart = cart.filter(cartItem => cartItem.id !== id);

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("justCleanCart", JSON.stringify(cart));
}

function renderCart() {
    cartItems.innerHTML = "";

    let count = 0;
    let total = 0;

    cart.forEach(item => {
        const service = services.find(s => s.id === item.id);
        if (!service) return;

        count += item.qty;
        total += service.price * item.qty;

        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item-info">
                <strong>${service.name}</strong>
                <span>₹${service.price} × ${item.qty}</span>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${service.id}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQuantity(${service.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${service.id})" title="Remove">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(row);
    });

    emptyCart.style.display = cart.length ? "none" : "block";
    cartItemsTotal.textContent = count;
    cartCount.textContent = count;
    cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
}

function showServiceDetails(id) {
    const service = services.find(s => s.id === id);
    document.getElementById("modalBody").innerHTML = `
        <div class="modal-icon"><i class="fa-solid ${service.icon}"></i></div>
        <span class="service-category">${service.category}</span>
        <h2>${service.name}</h2>
        <p>Professional cleaning service provided by verified JustClean professionals.</p>
        <p><strong>Estimated duration:</strong> ${service.duration}</p>
        <p><strong>Starting price:</strong> ₹${service.price}</p>
        <button class="add-service modal-add" onclick="addToCart(${service.id}); closeServiceModal();">
            Add to Booking
        </button>
    `;
    document.getElementById("serviceModal").classList.add("show");
}

function closeServiceModal() {
    document.getElementById("serviceModal").classList.remove("show");
}

document.getElementById("closeModal").addEventListener("click", closeServiceModal);
document.getElementById("serviceModal").addEventListener("click", event => {
    if (event.target.id === "serviceModal") closeServiceModal();
});

document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (!cart.length) return;
    if (confirm("Clear all services from your booking cart?")) {
        cart = [];
        saveCart();
        renderCart();
    }
});

document.getElementById("confirmBookingBtn").addEventListener("click", () => {
    if (!cart.length) {
        alert("Please add at least one service to your booking cart.");
        return;
    }
    const booking = {
        id: "JC" + Date.now(),
        items: cart.map(item => ({...item})),
        date: new Date().toLocaleString()
    };
    const bookings = JSON.parse(localStorage.getItem("justCleanBookings")) || [];
    bookings.push(booking);
    localStorage.setItem("justCleanBookings", JSON.stringify(bookings));
    alert("Booking saved successfully! Your booking ID is " + booking.id);
    cart = [];
    saveCart();
    renderCart();
});

[search, category, sort].forEach(control => {
    control.addEventListener("input", () => {
        currentPage = 1;
        renderServices();
    });
    control.addEventListener("change", () => {
        currentPage = 1;
        renderServices();
    });
});

renderServices();
renderCart();

}
