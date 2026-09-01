// Görünüm Değiştirme Fonksiyonu (Grid 2x2 veya Liste Alt Alta)
function switchView(viewType) {
  const menuContainer = document.getElementById('menuContainer');
  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');

  if (viewType === 'grid') {
    menuContainer.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  } else if (viewType === 'list') {
    menuContainer.classList.add('list-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  }
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUwpIGqZV9500bg76CElKkIph7Psk4_rUPx8eaZGBPGKEs4KWg464dt8Z0feg4-Z0a_2wBw6s7wn4R/pub?output=csv';

let allProducts = [];

// Sayfa yüklendiğinde menüyü çek
document.addEventListener("DOMContentLoaded", () => {
  fetchMenu();
});

async function fetchMenu() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    allProducts = parseCSV(text);
    
    const firstBtn = document.querySelector('.cat-btn');
    if(firstBtn) {
        filterCategory('hot', firstBtn);
    } else {
        renderMenu(allProducts);
    }

  } catch (error) {
    console.error("Veri çekme hatası:", error);
    document.getElementById('menuContainer').innerHTML = '<div class="loading-text">فشل تحميل القائمة. يرجى التحقق من مشاركة الجدول.</div>';
  }
}

// CSV Metnini Güvenli Bir Şekilde Parçalayan Fonksiyon
function parseCSV(text) {
  const lines = text.split("\n");
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    // Virgül ve tırnak işaretlerini dikkate alarak satırı ayır
    const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    if (currentLine.length >= 5) {
      // Sıralama: 0: ID/Boş, 1: name, 2: category, 3: price, 4: image
      const title = currentLine[1] ? currentLine[1].replace(/["']/g, "").trim() : "";
      const category = currentLine[2] ? currentLine[2].replace(/["']/g, "").trim().toLowerCase() : "";
      const price = currentLine[3] ? currentLine[3].replace(/["']/g, "").trim() : "";
      const image = currentLine[4] ? currentLine[4].replace(/["']/g, "").trim() : "";

      if (title && title.toLowerCase() !== 'name' && title.toLowerCase() !== 'title') {
        result.push({
          category: category,
          title: title,
          subtitle: "",
          price: price,
          image: image,
          desc: ""
        });
      }
    }
  }
  return result;
}

function renderMenu(items) {
  const container = document.getElementById('menuContainer');
  
  if (items.length === 0) {
    container.innerHTML = '<div class="loading-text">لم يتم العثور على عناصر مطابقة لبحثك.</div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <article class="item-card">
      <div class="img-wrapper skeleton">
        <img 
          src="${item.image || 'https://via.placeholder.com/200'}" 
          class="product-img" 
          alt="${item.title}"
          onload="this.classList.add('loaded'); this.parentElement.classList.remove('skeleton');"
          onerror="this.src='https://via.placeholder.com/200'; this.classList.add('loaded'); this.parentElement.classList.remove('skeleton');"
        >
      </div>
      
      <div class="info">
        <h2 class="item-title">${item.title}</h2>
      </div>

      <div class="divider"></div>

      <div class="price-container">
        <span class="price-badge">${item.price}</span>
      </div>
    </article>
  `).join('');
}

function filterCategory(catSearchTerm, btn) {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  
  const filtered = allProducts.filter(p => p.category.includes(catSearchTerm.toLowerCase()));
  renderMenu(filtered);
}

function filterMenu() {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  
  const input = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.title.toLowerCase().includes(input)
  );
  renderMenu(filtered);
}
