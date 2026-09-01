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
const SHEET_ID = '1XNL6jEeq9Gqsr6cAwxIl1vlYUhw_4ZqFv9cecY7STvo';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRUwpIGqZV9500bg76CElKkIph7Psk4_rUPx8eaZGBPGKEs4KWg464dt8Z0feg4-Z0a_2wBw6s7wn4R/pub?output=csv`;

let allProducts = [];

async function fetchMenu() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const json = JSON.parse(jsonString);
    
    allProducts = json.table.rows
      .map(row => ({
        category: String(row.c[0]?.v || '').trim().toLowerCase(),
        title: String(row.c[1]?.v || '').trim(),
        subtitle: String(row.c[2]?.v || '').trim(),
        price: String(row.c[3]?.v || '').trim(),
        image: String(row.c[4]?.v || '').trim(),
        desc: String(row.c[5]?.v || '').trim()
      }))
      .filter(p => p.title !== '' && p.title.toLowerCase() !== 'title');

    const firstBtn = document.querySelector('.cat-btn');
    if(firstBtn) {
        filterCategory('hot', firstBtn);
    } else {
        renderMenu(allProducts);
    }

  } catch (error) {
    console.error(error);
    document.getElementById('menuContainer').innerHTML = '<div class="loading-text">فشل تحميل القائمة. يرجى التحقق من مشاركة الجدول.</div>';
  }
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
        ${item.subtitle ? `<div class="item-subtitle">${item.subtitle}</div>` : ''}
      </div>

      <div class="divider"></div>

      <div class="price-container">
        <span class="price-badge">${item.price} IQD</span>
      </div>
    </article>
  `).join('');
}

function filterCategory(catSearchTerm, btn) {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.getElementById('searchInput').value = '';
  
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
    p.title.toLowerCase().includes(input) || 
    p.subtitle.toLowerCase().includes(input)
  );
  renderMenu(filtered);
}

fetchMenu();
