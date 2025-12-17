// Общий JavaScript файл для всех страниц сайта

// Функция инициализации навигации
function initNavigation() {
    // Проверка авторизации на всех страницах
    const userData = JSON.parse(localStorage.getItem('user'));
    const loginLink = document.getElementById('loginLink');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutLink = document.getElementById('logoutLink');
    
    if (userData && loginLink && userInfo && userName && userAvatar) {
        // Пользователь авторизован
        loginLink.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = userData.name;
        userAvatar.textContent = getInitials(userData.name);
        
        // Обработка выхода
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }
    }
    
    // Активация текущей страницы в меню
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a, .sidebar-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Функция для получения инициалов
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// Функция для форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Функция для форматирования цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

// Функция для показа уведомления
function showNotification(type, title, message, duration = 3000) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}"></i>
        </div>
        <div class="notification-content">
            <h4 class="notification-title">${title}</h4>
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Добавляем в body
    document.body.appendChild(notification);
    
    // Показываем с анимацией
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('active');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
}

// Функция для подтверждения действия
function confirmAction(message) {
    return new Promise((resolve) => {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Подтверждение</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelBtn">Отмена</button>
                    <button class="btn btn-danger" id="confirmBtn">Подтвердить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Обработчики событий
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
        
        modal.querySelector('#cancelBtn').addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
        
        modal.querySelector('#confirmBtn').addEventListener('click', () => {
            closeModal();
            resolve(true);
        });
        
        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(false);
            }
        });
    });
}

// Функция для загрузки данных
async function loadData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// Функция для сохранения данных
async function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Функция для проверки авторизации
function checkAuth() {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData || null;
}

// Функция для проверки роли администратора
function isAdmin() {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData && userData.role === 'admin';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация навигации
    initNavigation();
    
    // Инициализация анимаций при скролле
    initScrollAnimations();
    
    // Инициализация счетчика на главной странице
    if (document.getElementById('visitor-counter')) {
        initVisitorCounter();
    }
});

// Функция для анимаций при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с классом .animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Функция для счетчика посещений
function initVisitorCounter() {
    const counter = document.getElementById('visitor-counter');
    if (!counter) return;
    
    // Получаем текущее значение из localStorage или устанавливаем начальное
    let count = parseInt(localStorage.getItem('visitorCount')) || 120;
    
    // Обновляем отображение
    counter.textContent = count;
    
    // Обновляем счетчик каждые 5 секунд
    setInterval(() => {
        // Случайное изменение от -2 до +2
        let change = Math.floor(Math.random() * 5) - 2;
        count = Math.max(100, count + change);
        
        // Сохраняем в localStorage
        localStorage.setItem('visitorCount', count);
        
        // Анимация обновления
        counter.style.transform = 'scale(1.1)';
        counter.style.color = '#ff8c00';
        
        // Плавное изменение числа
        let current = parseInt(counter.textContent);
        let step = Math.sign(count - current);
        
        const updateNumber = () => {
            current += step;
            counter.textContent = current;
            
            if (current !== count) {
                setTimeout(updateNumber, 50);
            } else {
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                    counter.style.color = 'var(--accent-color)';
                }, 300);
            }
        };
        
        updateNumber();
    }, 5000);
}

// Функция для создания модального окна
function createModal(options) {
    const {
        title,
        content,
        buttons = [],
        onClose = null,
        size = 'medium' // small, medium, large
    } = options;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    const sizeClass = `modal-${size}`;
    
    modal.innerHTML = `
        <div class="modal-content ${sizeClass}">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            ${buttons.length > 0 ? `
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn ${btn.class || 'btn-secondary'}" 
                                data-action="${btn.action || 'close'}">
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Функция закрытия модального окна
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            if (onClose) onClose();
        }, 300);
    };
    
    // Обработчики событий
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    modal.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            if (action === 'close') {
                closeModal();
            }
        });
    });
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return {
        close: closeModal,
        element: modal
    };
}

// Экспорт функций для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        getInitials,
        formatDate,
        formatPrice,
        showNotification,
        confirmAction,
        loadData,
        saveData,
        checkAuth,
        isAdmin,
        createModal
    };
}