const productDiv = document.querySelector(".product");
const allCat = [];
const categoryButtons = document.querySelectorAll(".category-buttons button");
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search...";
document.body.insertBefore(searchInput, document.querySelector(".main"));
const cartItems = document.querySelector(".cart-items");
const totalAmount = document.querySelector(".total-amount");
const cartSection = document.querySelector(".cart-section");
const cartButton = document.querySelector(".cart-button");
const closeCartButton = document.querySelector(".close-cart");
const buyButton = document.querySelector(".buy-button");
let cart = [];

const displayProducts = async (categoryFilter = "all", searchText = "") => {
  productDiv.innerHTML = "";
  try {
    const response = await fetch("https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json");
    const data = await response.json();
    if (data && data.categories && Array.isArray(data.categories)) {
      data.categories.forEach(category => {
        const categoryName = category.category_name.toLowerCase();
        if (!allCat.includes(categoryName)) allCat.push(categoryName);
        category.category_products.forEach(item => {
          const matchesSearchText = searchText.trim().length === 0 || item.title.toLowerCase().includes(searchText.toLowerCase()) || item.vendor.toLowerCase().includes(searchText.toLowerCase()) || categoryName.includes(searchText.toLowerCase());
          if ((categoryFilter === "all" || categoryName === categoryFilter) && matchesSearchText) {
            if (item && item.image && item.price && item.title && item.vendor) {
              productDiv.innerHTML += `
                <div class="productItems">
                  <div class="cardstyle">
                    <img src="${item.image}" alt="" />
                    <p>${item.vendor}</p>
                    <hr />
                    <p>${item.badge_text}</p>
                    <p>Price Rs. ${item.price} | ${item.compare_at_price}</p>
                    <h4>${item.title}</h4>
                  </div>
                  <button class="add-to-cart-btn" data-item='${JSON.stringify(item)}'>Add to Cart</button>
                </div>
              `;
            } else console.error("Missing or undefined properties in item:", item);
          }
        });
      });
      document.querySelectorAll(".add-to-cart-btn").forEach(button => button.addEventListener("click", addToCart));
      updateCartDisplay();
    } else console.error("Invalid data format:", data);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
};
const addToCart = event => {
  const item = JSON.parse(event.currentTarget.dataset.item);
  cart.push(item);
  updateCartDisplay();
};
const updateCartDisplay = () => {
  cartItems.innerHTML = "";
  let totalCost = 0;
  cart.forEach(item => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    const itemImage = document.createElement("img");
    itemImage.src = item.image;
    itemImage.alt = item.title;
    const cartItemDetails = document.createElement("div");
    cartItemDetails.classList.add("cart-item-details");
    cartItemDetails.textContent = `${item.title} - $${item.price}`;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      cart = cart.filter(cartItem => cartItem !== item);
      updateCartDisplay();
    });
    cartItemDiv.appendChild(itemImage);
    cartItemDiv.appendChild(cartItemDetails);
    cartItemDiv.appendChild(removeButton);
    cartItems.appendChild(cartItemDiv);
    totalCost += parseFloat(item.price);
  });
  totalAmount.textContent = `Total: $${totalCost.toFixed(2)}`;
};
const filterProducts = category => {
  categoryButtons.forEach(button => button.classList.remove("active"));
  const activeButton = document.querySelector(`.category-buttons button[onclick="filterProducts('${category}')"]`);
  activeButton.classList.add("active");
  displayProducts(category, searchInput.value);
};
searchInput.addEventListener("input", () => {
  displayProducts(document.querySelector(".category-buttons button.active").getAttribute("onclick").split("'")[1], searchInput.value);
});
cartButton.addEventListener("click", () => cartSection.classList.add("show"));
closeCartButton.addEventListener("click", () => cartSection.classList.remove("show"));
buyButton.addEventListener("click", () => {
  console.log("Buy button clicked");
});
displayProducts();