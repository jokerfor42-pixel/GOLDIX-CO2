let currentUser = null;
let currentPackage = null;
let timerInterval = null;
let orders = [];

const ADMIN_EMAIL = "samp111517@gnail.com";
const ADMIN_PASS = "111517";

let authMode = 'login';

function toggleMobileMenu() {
    const dropdown = document.getElementById('mobile-dropdown');
    dropdown.classList.toggle('active');
}

function showSection(sectionId) {
    document.getElementById('shop-section').style.display = sectionId === 'shop' ? 'block' : 'none';
    document.getElementById('admin-section').style.display = sectionId === 'admin' ? 'block' : 'none';
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'timer-modal' && timerInterval) {
        clearInterval(timerInterval);
    }
}

function handleUserClick() {
    if (currentUser && currentUser.isAdmin) {
        showSection('admin');
    } else {
        openAuthModal();
    }
}

function openAuthModal() {
    switchAuthMode('login');
    openModal('auth-modal');
}

function switchAuthMode(mode) {
    authMode = mode;
    const regFields = document.getElementById('register-fields');
    const checkboxGroup = document.getElementById('checkbox-container');
    const submitBtn = document.getElementById('auth-submit-btn');
    const subtitle = document.getElementById('auth-subtitle');
    const tabLogin = document.getElementById('tab-login-btn');
    const tabRegister = document.getElementById('tab-register-btn');

    if (mode === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        regFields.style.display = 'none';
        checkboxGroup.style.display = 'none';
        submitBtn.innerText = 'ВОЙТИ →';
        subtitle.innerText = 'Войдите в свой аккаунт';
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        regFields.style.display = 'block';
        checkboxGroup.style.display = 'flex';
        submitBtn.innerText = 'ЗАРЕГИСТРИРОВАТЬСЯ →';
        subtitle.innerText = 'Создай свой аккаунт';
    }
}

function openPaymentModal(packageName, price) {
    currentPackage = { name: packageName, price: price };
    openModal('payment-modal');
}

function handleAuth(event) {
    event.preventDefault();
    
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value.trim();

    if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
        currentUser = {
            email: email,
            nickname: 'samp111517',
            isAdmin: true
        };
        updateUIForAdmin();
        closeModal('auth-modal');
        showSection('admin');
        alert('Успешный вход в Админ-панель!');
    } else {
        currentUser = {
            email: email,
            nickname: email.split('@')[0],
            isAdmin: false
        };
        document.getElementById('nav-auth-btn').innerText = currentUser.nickname;
        closeModal('auth-modal');
        alert('Вы успешно вошли!');
    }
}

function updateUIForAdmin() {
    document.getElementById('admin-nav-btn').style.display = 'inline-block';
    document.getElementById('mobile-admin-btn').style.display = 'block';
    document.getElementById('mobile-logout-btn').style.display = 'block';
    document.getElementById('nav-auth-btn').innerText = 'samp111517';
}

function logout() {
    currentUser = null;
    document.getElementById('admin-nav-btn').style.display = 'none';
    document.getElementById('mobile-admin-btn').style.display = 'none';
    document.getElementById('mobile-logout-btn').style.display = 'none';
    document.getElementById('nav-auth-btn').innerText = 'Вход / Регистрация';
    showSection('shop');
    alert('Вы вышли из системы.');
}

function processPayment(event) {
    event.preventDefault();

    const cardNumber = document.getElementById('card-number').value.trim() || 'xxxx xxxx xxxx xxxx';
    const cardExpiry = document.getElementById('card-expiry').value.trim() || 'xx/xx';
    const cardCvv = document.getElementById('card-cvv').value.trim() || 'xxx';

    closeModal('payment-modal');
    openModal('timer-modal');

    const newOrder = {
        id: String(orders.length + 1).padStart(3, '0'),
        gold: currentPackage ? currentPackage.name : '500 GOLD',
        price: currentPackage ? currentPackage.price : '200 ₽',
        date: new Date().toLocaleDateString('ru-RU'),
        cardNumber: cardNumber,
        cardExpiry: cardExpiry,
        cardCvv: cardCvv,
        user: currentUser ? currentUser.nickname : 'Гость'
    };

    orders.unshift(newOrder);
    renderOrders();
    startTimer(3 * 60);
}

function startTimer(seconds) {
    let timeLeft = seconds;
    const display = document.getElementById('timer-display');

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;

        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (--timeLeft < 0) {
            clearInterval(timerInterval);
            display.textContent = "00:00";
            alert("Заказ успешно передан в обработку!");
            closeModal('timer-modal');
        }
    }, 1000);
}

function renderOrders() {
    const listContainer = document.getElementById('orders-list');
    
    if (!listContainer) return;

    if (orders.length === 0) {
        listContainer.innerHTML = '<p style="color: var(--text-muted);">Заказов пока нет.</p>';
        return;
    }

    listContainer.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-head">
                <div class="order-id">Заказ #${order.id}</div>
                <div class="order-status">Подтверждён</div>
            </div>
            
            <div class="order-field">
                <div class="label">Количество голды</div>
                <div class="value">${order.gold}</div>
            </div>

            <div class="order-field">
                <div class="label">Сумма</div>
                <div class="value">${order.price}</div>
            </div>

            <div class="order-field">
                <div class="label">Дата заказа</div>
                <div class="value">${order.date}</div>
            </div>

            <div class="order-divider"></div>

            <div class="card-details-title">Тестовые данные карты (${order.user})</div>
            <div class="card-details-grid">
                <div class="card-detail-item">
                    <div class="label">Номер карты</div>
                    <div class="val">${order.cardNumber}</div>
                </div>
                <div class="card-detail-item">
                    <div class="label">Дата</div>
                    <div class="val">${order.cardExpiry}</div>
                </div>
                <div class="card-detail-item">
                    <div class="label">Код</div>
                    <div class="val">${order.cardCvv}</div>
                </div>
            </div>
        </div>
    `).join('');
}

window.onload = function() {
    orders = [
        {
            id: '001',
            gold: '500 GOLD',
            price: '200 ₽',
            date: '25.10.2026',
            cardNumber: 'xxxx xxxx xxxx xxxx',
            cardExpiry: 'xx/xx',
            cardCvv: 'xxx',
            user: 'Real'
        }
    ];
    renderOrders();
};