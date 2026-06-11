const productsContainer = document.getElementById("products");
const loading = document.getElementById("loading");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

let allProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    allProducts = data;
    displayProducts(allProducts);
    loading.style.display = "none";
  } catch (error) {
    loading.innerText = "Error loading products!";
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = "";

  products.forEach(product => {
    productsContainer.innerHTML += `
      <div class="product-card">
        
        <div class="card-img">
          <img src="${product.image}" alt="${product.title}">
        </div>

        <div class="card-body">
          <h4>${product.title}</h4>
          <div class="price">$${product.price}</div>
          <div class="desc">${product.description}</div>
        </div>

      </div>
    `;
  });
}

function applyFilters() {

  const selectedCategory = categoryFilter.value;
  const selectedPrice = priceFilter.value;

  let filtered = allProducts.filter(product => {

    let matchCategory = true;

    if (selectedCategory !== "all") {
      matchCategory = product.category === selectedCategory;
    }

    let matchPrice = true;

    if (selectedPrice === "under50") {
      matchPrice = product.price < 50;
    } 
    else if (selectedPrice === "50to100") {
      matchPrice = product.price >= 50 && product.price <= 100;
    } 
    else if (selectedPrice === "100to200") {
      matchPrice = product.price >= 101 && product.price <= 200;
    } 
    else if (selectedPrice === "above200") {
      matchPrice = product.price > 200;
    }

    return matchCategory && matchPrice;
  });

  displayProducts(filtered);
}

categoryFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

fetchProducts();
