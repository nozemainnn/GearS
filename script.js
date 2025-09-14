const currentPage = (function(){
  try{
    const p = location.pathname.split('/').pop();
    return (p === '' || !p) ? 'index.html' : p.toLowerCase();
  }catch(e){ return 'index.html'; }
})();


const publicPages = ['login.html','register.html','forgot.html'];
if (localStorage.getItem('isLoggedIn') !== 'true' && !publicPages.includes(currentPage)) {
  
  window.location.href = 'login.html';
}

window.logout = function () {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
};

document.addEventListener('DOMContentLoaded', () => {
  
 
  (function initLogin(){
    const loginForm = document.getElementById('loginForm');
    if(!loginForm) return;

    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    const usernameEl = document.getElementById('username');
    const toggleIcon = togglePassword && togglePassword.querySelector ? togglePassword.querySelector('i') : null;
    const pwBar = document.getElementById("pwBar");
    const pwText = document.getElementById("pwText");
    const errorMsg = document.getElementById("errorMsg");
    const successCheck = document.getElementById("successCheck");

    function setPasswordVisible(visible){
      if(!password) return;
      password.type = visible ? 'text' : 'password';
      if(togglePassword) togglePassword.setAttribute('aria-pressed', visible ? 'true' : 'false');
      if(togglePassword) togglePassword.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
      if(toggleIcon){ toggleIcon.classList.toggle('fa-eye', !visible); toggleIcon.classList.toggle('fa-eye-slash', visible); }
    }
    if(password) setPasswordVisible(false);
    if(togglePassword) togglePassword.addEventListener('click', () => setPasswordVisible(password.type === 'password'));
    if(togglePassword) togglePassword.addEventListener('keydown', (e) => { if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); togglePassword.click(); } });

   
    function scorePassword(pw){
      let score = 0;
      if(!pw) return score;
      if(pw.length >= 8) score += 2;
      if(pw.length >= 12) score += 1;
      if(/[a-z]/.test(pw)) score++;
      if(/[A-Z]/.test(pw)) score++;
      if(/\d/.test(pw)) score++;
      if(/[^A-Za-z0-9]/.test(pw)) score++;
      return Math.min(score, 7);
    }
    function updatePwMeter(){
      if(!password || !pwBar || !pwText) return;
      const val = password.value || '';
      const s = scorePassword(val);
      const pct = Math.round((s / 7) * 100);
      pwBar.style.width = pct + '%';
      if(pct <= 28){ pwBar.style.background = 'linear-gradient(90deg,#ff6b6b,#ffbaba)'; pwText.textContent = 'Weak' }
      else if(pct <= 60){ pwBar.style.background = 'linear-gradient(90deg,#ffd07a,#ffeaa7)'; pwText.textContent = 'Fair' }
      else if(pct <= 86){ pwBar.style.background = 'linear-gradient(90deg,#b8f18d,#7afcff)'; pwText.textContent = 'Good' }
      else { pwBar.style.background = 'linear-gradient(90deg,#88f0ff,#b8ffd9)'; pwText.textContent = 'Strong' }
    }
    if(password){ password.addEventListener('input', updatePwMeter); updatePwMeter(); }

   
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      if(errorMsg) errorMsg.textContent = '';
      const user = usernameEl ? usernameEl.value.trim() : '';
      const pass = password ? password.value.trim() : '';
      if(!user || !pass){ if(errorMsg) errorMsg.textContent = 'Please enter username and password.'; return; }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(u => u.username === user && u.password === pass);

      if(found){
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", found.username);
       
        if(successCheck){ successCheck.setAttribute('aria-hidden','false'); successCheck.classList.add('show'); }
        setTimeout(()=> { window.location.href = "index.html"; }, 900);
      } else {
        if(errorMsg) errorMsg.textContent = "Invalid username or password.";
        const c = document.querySelector('.container');
        if(c) c.animate([{ transform: 'translateX(0)' }, { transform:'translateX(-8px)' }, { transform:'translateX(8px)' }, { transform:'translateX(0)' }], { duration:260, iterations:1 });
      }
    });

    
    const remember = document.getElementById('remember');
    if(remember){
      remember.addEventListener('change', () => {
        if(remember.checked){
          localStorage.setItem('rememberLast', 'true');
          localStorage.setItem('lastUser', usernameEl ? usernameEl.value || '' : '');
        } else {
          localStorage.removeItem('rememberLast');
          localStorage.removeItem('lastUser');
        }
      });
  
      try{
        if(localStorage.getItem('rememberLast') === 'true'){
          if(usernameEl) usernameEl.value = localStorage.getItem('lastUser') || '';
          remember.checked = true;
        }
      }catch(e){  }
    }

    
    const btnGoogle = document.getElementById('btn-google');
    const btnFb = document.getElementById('btn-fb');
    if(btnGoogle) btnGoogle.addEventListener('click', ()=> { alert('Google login not configured in this demo.'); });
    if(btnFb) btnFb.addEventListener('click', ()=> { alert('Facebook login not configured in this demo.'); });
  })();

  
  (function initRegister(){
    const registerForm = document.getElementById('registerForm');
    if(!registerForm) return;
    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");
    const toggleConfirm = document.getElementById("toggleConfirm");
    const confirmPassword = document.getElementById("confirmPassword");
    const errorMsg = document.getElementById("errorMsg");
    const username = document.getElementById('username');
    const email = document.getElementById('email');

    if(togglePassword && password){
      togglePassword.addEventListener("click", () => {
        password.type = password.type === "password" ? "text" : "password";
        togglePassword.classList.toggle("fa-eye-slash");
      });
    }
    if(toggleConfirm && confirmPassword){
      toggleConfirm.addEventListener("click", () => {
        confirmPassword.type = confirmPassword.type === "password" ? "text" : "password";
        toggleConfirm.classList.toggle("fa-eye-slash");
      });
    }

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (password.value !== confirmPassword.value) {
        if(errorMsg) errorMsg.style.display = "block";
        return;
      } else {
        if(errorMsg) errorMsg.style.display = "none";

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.find(u => u.username === username.value)) {
          alert("Username already exists. Choose another one.");
          return;
        }

        users.push({
          username: username.value,
          email: email.value,
          password: password.value
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("\ud83e\udd1e\ud83c\udffbAccount created successfully!");
        window.location.href = "login.html";
      }
    });
  })();


  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init();
  }

  const productSearch = document.getElementById('product-search');
  if (productSearch) {
    productSearch.addEventListener('input', function(e) {
      const search = e.target.value.toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        if (title.includes(search)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

 

  document.querySelectorAll('.icon-overlay .fa-heart').forEach(heart => {
    heart.addEventListener('click', (e) => {
      const el = e.currentTarget;
      el.classList.toggle('liked');
      el.classList.toggle('fa-regular');
      el.classList.toggle('fa-solid');
    });
  });



  document.querySelectorAll('.product-card').forEach(card => {
    const mainImg = card.querySelector('.product-image');
    const thumbs = Array.from(card.querySelectorAll('.thumb'));
    if(!mainImg || thumbs.length === 0) return;
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', ()=>{
        
        const large = thumb.dataset.large;
        if(large) mainImg.src = large;
        
        thumbs.forEach(t=> t.classList.remove('selected'));
        thumb.classList.add('selected');
      });
    });
  });

  
  (function(){
    const sizes = ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'];
    document.querySelectorAll('.product-card').forEach(card => {
 
      if(card.querySelector('.size-wrap')) return;
      const info = card.querySelector('.product-info');
      if(!info) return;

      const sizeWrap = document.createElement('div');
      sizeWrap.className = 'size-wrap';
      sizeWrap.innerHTML = `
        <label class="size-label">SIZE</label>
        <select class="size-select" aria-label="Choose shoe size">
          <option value="">Choose</option>
          ${sizes.map(s=> `<option value="${s}">${s}</option>`).join('')}
        </select>
      `;

      
      const buyBtn = info.querySelector('.buy-btn');
      if(buyBtn) info.insertBefore(sizeWrap, buyBtn);
      else info.appendChild(sizeWrap);
    });

   
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.product-card');
        if(!card) return;
        const title = card.querySelector('.product-title')?.textContent?.trim() || 'Product';
        const img = card.querySelector('.product-image')?.src || '';
        const select = card.querySelector('.size-select');
        const size = select ? select.value : '';

        if(!size){
          if(select){
            select.classList.add('size-error');
            select.focus();
            setTimeout(()=> select.classList.remove('size-error'), 1400);
          }
          return;
        }

       
        const orders = JSON.parse(localStorage.getItem('gs_orders') || '[]');
        orders.push({ title, img, size, added: Date.now() });
        localStorage.setItem('gs_orders', JSON.stringify(orders));
      
        const truck = document.getElementById('truck-btn');
        if(truck){
          const rect = e.currentTarget.getBoundingClientRect();
          const fly = document.createElement('img');
          fly.src = img;
          fly.className = 'fly-image';
          fly.style.left = (rect.left + rect.width/2 - 40) + 'px';
          fly.style.top = (rect.top + rect.height/2 - 40) + 'px';
          document.body.appendChild(fly);
          const t = truck.getBoundingClientRect();
          requestAnimationFrame(()=>{
            fly.style.transform = `translate(${t.left - rect.left}px, ${t.top - rect.top}px) scale(0.28)`;
            fly.style.opacity = '0.2';
          });
          setTimeout(()=> fly.remove(), 800);
          const badge = truck.querySelector('.truck-badge'); if(badge) badge.textContent = orders.length;
        }

        // toast
        const toast = document.createElement('div');
        toast.className = 'gs-toast';
        toast.textContent = `${title} — Size ${size} added to orders`;
        document.body.appendChild(toast);
        requestAnimationFrame(()=> toast.classList.add('visible'));
        setTimeout(()=> toast.classList.remove('visible'), 2000);
        setTimeout(()=> toast.remove(), 2300);
      });
    });
  })();

 
  (function(){
    const truck = document.getElementById('truck-btn');
  const modal = document.getElementById('order-modal');
  const modalContent = modal && modal.querySelector('.order-items');
    const closeBtn = modal && modal.querySelector('.order-modal-close');
    const clearBtn = modal && modal.querySelector('.order-clear');
    const checkoutBtn = modal && modal.querySelector('.order-checkout');

    function renderOrders(){
      const orders = JSON.parse(localStorage.getItem('gs_orders') || '[]');
      if(truck){
        const b = truck.querySelector('.truck-badge'); if(b) b.textContent = orders.length;
      }
      if(!modalContent) return;
      modalContent.innerHTML = '';
      if(orders.length === 0){ modalContent.innerHTML = '<p style="color:#cfcfcf">No orders yet.</p>'; return; }
      orders.slice().reverse().forEach(o=>{
        const el = document.createElement('div'); el.className='order-item';
        el.innerHTML = `<img src="${o.img}" alt=""><div class="meta"><strong>${o.title}</strong><div>Size: ${o.size}</div><div class="muted">Added: ${new Date(o.added).toLocaleString()}</div></div>`;
        modalContent.appendChild(el);
      });
    }

  if(truck) truck.addEventListener('click', (e)=>{ e.preventDefault(); renderOrders(); modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); });

  const cartBtn = document.getElementById('cart-btn');
    if(closeBtn) closeBtn.addEventListener('click', ()=>{ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); });
  if(clearBtn) clearBtn.addEventListener('click', ()=>{
      
      localStorage.removeItem('gs_orders');
      renderOrders();
   
      if(truck){ const b = truck.querySelector('.truck-badge'); if(b) b.textContent = 0; }
  });
    if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{ alert('Proceed to checkout flow (not implemented).'); });


    renderOrders();

    window.addEventListener('storage', (ev) => {
      if(ev.key === 'gs_orders') renderOrders();
    });
  })();


  (function(){
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartContent = cartModal && cartModal.querySelector('.cart-items');
    const cartClose = cartModal && cartModal.querySelector('.cart-close');
    const cartClear = cartModal && cartModal.querySelector('.cart-clear');
    const cartCheckout = cartModal && cartModal.querySelector('.cart-checkout');

    function renderCart(){
      const items = JSON.parse(localStorage.getItem('gs_cart') || '[]');
      if(cartBtn){ const b = cartBtn.querySelector('.cart-badge'); if(b) b.textContent = items.length; }
      if(!cartContent) return;
      cartContent.innerHTML = '';
      if(items.length === 0){ cartContent.innerHTML = '<p style="color:#cfcfcf">Cart is empty.</p>'; return; }
      items.slice().reverse().forEach((it)=>{
        const el = document.createElement('div'); el.className='order-item';
        el.innerHTML = `<img src="${it.img}" alt=""><div class="meta"><strong>${it.title}</strong><div>Size: ${it.size}</div><div class="muted">Added: ${new Date(it.added).toLocaleString()}</div></div>`;
        cartContent.appendChild(el);
      });
    }

    if(cartBtn) cartBtn.addEventListener('click', (e)=>{ e.preventDefault(); renderCart(); cartModal.classList.add('show'); cartModal.setAttribute('aria-hidden','false'); });
    if(cartClose) cartClose.addEventListener('click', ()=>{ cartModal.classList.remove('show'); cartModal.setAttribute('aria-hidden','true'); });
    if(cartClear) cartClear.addEventListener('click', ()=>{ localStorage.removeItem('gs_cart'); renderCart(); if(cartBtn) cartBtn.querySelector('.cart-badge').textContent = 0; });
    if(cartCheckout) cartCheckout.addEventListener('click', ()=>{ alert('Cart checkout not implemented.'); });

    renderCart();

    window.addEventListener('storage', (ev) => {
      if(ev.key === 'gs_cart') renderCart();
    });
  })();

  (function(){
    const cards = document.querySelectorAll('.product-card');
    const cartCountEl = document.getElementById('cartCount');
    const cartBtn = document.getElementById('cart-btn');

    function loadCart(){ try { return JSON.parse(localStorage.getItem('gs_cart') || '[]'); } catch(e){ return []; } }
    function saveCart(c){ localStorage.setItem('gs_cart', JSON.stringify(c)); }
    function renderCartCount(){ const c = loadCart(); if(cartCountEl) cartCountEl.textContent = String(c.length); }
    renderCartCount();

    function animateToCart(imgSrc, fromRect){
      if(!cartBtn) return;
      const t = cartBtn.getBoundingClientRect();
      const fly = document.createElement('img');
      fly.src = imgSrc;
      fly.className = 'fly-image';
      fly.style.left = (fromRect.left + fromRect.width/2 - 40) + 'px';
      fly.style.top = (fromRect.top + fromRect.height/2 - 40) + 'px';
      document.body.appendChild(fly);
      requestAnimationFrame(()=>{ fly.style.transform = `translate(${t.left - fromRect.left}px, ${t.top - fromRect.top}px) scale(0.28)`; fly.style.opacity = '0.2'; });
      setTimeout(()=> fly.remove(), 700);
    }

    cards.forEach(card => {
      if (card.querySelector('.add-cart-border')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'add-cart-border';
      btn.innerHTML = '<i class="fa fa-cart-plus"></i><span>Add</span>';
      card.appendChild(btn);

      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const title = card.querySelector('.product-title')?.textContent?.trim() || 'Product';
        const rawImg = card.querySelector('.product-image')?.getAttribute('src') || '';
        const img = rawImg ? (new URL(rawImg, location.href)).href : '';
        const price = card.querySelector('.price-original')?.textContent?.trim() || '';
        const size = card.querySelector('.size-select')?.value || '';

        const cart = loadCart();
        cart.push({ title, img, price, size, added: Date.now() });
        saveCart(cart);
        renderCartCount();

        const rect = btn.getBoundingClientRect();
        animateToCart(img || '', rect);
        const toast = document.createElement('div'); toast.className='gs-toast'; toast.textContent = `${title} added to cart`; document.body.appendChild(toast);
        requestAnimationFrame(()=> toast.classList.add('visible'));
        setTimeout(()=> toast.classList.remove('visible'), 1600); setTimeout(()=> toast.remove(), 2000);
      });
    });
  })();

});


const slides = document.querySelectorAll('.carousel .slide');
const dots = document.querySelectorAll('.dot');
let idx = 0, playing = true, interval = 4000;
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playBtn = document.getElementById('play');

function show(n){
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[n].classList.add('active');
  dots[n].classList.add('active');
  idx = n;
}

function next(){
  show((idx + 1) % slides.length);
}
function prev(){
  show((idx - 1 + slides.length) % slides.length);
}

let timer = setInterval(next, interval);

function togglePlay(){
  if(playing){ clearInterval(timer); playBtn.textContent = '▶'; playing = false; }
  else { timer = setInterval(next, interval); playBtn.textContent = '❚❚'; playing = true; }
}

nextBtn.addEventListener('click', () => { next(); if(playing){ clearInterval(timer); timer = setInterval(next, interval); }});
prevBtn.addEventListener('click', () => { prev(); if(playing){ clearInterval(timer); timer = setInterval(next, interval); }});
playBtn.addEventListener('click', togglePlay);
dots.forEach((d,i)=> d.addEventListener('click', ()=> show(i)));

show(0);
