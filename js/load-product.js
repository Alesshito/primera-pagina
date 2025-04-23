// js/load-product.js
document.addEventListener('DOMContentLoaded', function() {
    // 1) Leer parámetros de URL
    var params    = new URLSearchParams(window.location.search);
    var category  = params.get('cat');    // ej. "accesorios"
    var productId = params.get('id');     // ej. "acce1"
  
    if (!category || !productId) {
      console.error('❌ Falta cat o id en la URL');
      return;
    }
  
    // 2) Construir ruta al JSON de la categoría
    var jsonPath = '../categorias/data/' + category + '.json';
  
    // 3) Fetch y búsqueda de producto
    fetch(jsonPath)
      .then(function(res) {
        if (!res.ok) throw new Error('Status ' + res.status + ' al cargar ' + jsonPath);
        return res.json();
      })
      .then(function(list) {
        // Buscar por id
        var prod = list.find(function(p) { return p.id === productId; });
        if (!prod) throw new Error('Producto "' + productId + '" no encontrado');
        injectProduct(prod);
      })
      .catch(function(err) {
        console.error('Error cargando producto:', err);
      });
  });
  
  /**
   * Inyecta los datos del producto en el DOM
   */
  function injectProduct(p) {
    var imgEl = document.getElementById('product-img');
    if (imgEl) {
      // Prefix absoluto para que siempre arranque desde la raíz
      imgEl.src = '/' + p.imagen;
      imgEl.alt = p.nombre;
    }
  
    // 2) Título
    var titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = p.nombre;
  
    // 3) Marca
    var brandEl = document.getElementById('product-brand');
    if (brandEl) brandEl.textContent = p.marca || '';
  
    // 4) Precio
    var priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = 'S/ ' + Number(p.precio).toFixed(2);
  
    // 5) Descripción
    var descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = p.descripcion;
  
    // 6) Características
    var ul = document.getElementById('product-features');
    if (ul) {
      ul.innerHTML = '';
      if (Array.isArray(p.caracteristicas)) {
        p.caracteristicas.forEach(function(c) {
          var li = document.createElement('li');
          li.innerHTML = '<strong>' + c.nombre + ':</strong> ' + c.valor;
          ul.appendChild(li);
        });
      }
    }
  }
  