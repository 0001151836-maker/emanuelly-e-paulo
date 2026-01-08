// Botão de surpresa
document.getElementById('surpriseBtn').addEventListener('click', function() {
    document.getElementById('splashScreen').classList.add('hidden');
    setTimeout(() => document.getElementById('mainContent').classList.add('visible'), 300);
});

// Efeito de corações ao clicar nas fotos
const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];

function createHeart(parent, x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-explosion';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = x + (Math.random() * 40 - 20) + 'px';
    heart.style.top = y + (Math.random() * 40 - 20) + 'px';
    parent.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
}

// Galeria de fotos com scroll contínuo infinito
const gallery = document.getElementById('photoGallery');
const originalPhotos = Array.from(gallery.querySelectorAll('.photo'));

// Duplicar fotos para criar loop infinito
function setupInfiniteScroll() {
    // Criar múltiplas cópias das fotos
    for (let i = 0; i < 3; i++) {
        originalPhotos.forEach(photo => {
            const clone = photo.cloneNode(true);
            gallery.appendChild(clone);
        });
    }
    
    // Adicionar evento de clique em todas as fotos
    const allPhotos = gallery.querySelectorAll('.photo');
    allPhotos.forEach(photo => {
        photo.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createHeart(this, x, y), i * 100);
            }
        });
    });
}

// Auto-scroll contínuo
let autoScrollInterval;
let userInteracting = false;

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        if (!userInteracting) {
            gallery.scrollLeft += 1;
            
            // Quando passar metade, reseta para criar loop infinito
            const scrollWidth = gallery.scrollWidth;
            const clientWidth = gallery.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            const midPoint = maxScroll / 2;
            
            if (gallery.scrollLeft >= midPoint) {
                gallery.scrollLeft = 0;
            }
        }
    }, 30);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
}

// Eventos de interação do usuário (mobile)
gallery.addEventListener('touchstart', () => {
    userInteracting = true;
    stopAutoScroll();
});

gallery.addEventListener('touchend', () => {
    setTimeout(() => {
        userInteracting = false;
        startAutoScroll();
    }, 2000);
});

// Eventos de interação do usuário (desktop)
gallery.addEventListener('mousedown', () => {
    userInteracting = true;
    stopAutoScroll();
});

gallery.addEventListener('mouseup', () => {
    setTimeout(() => {
        userInteracting = false;
        startAutoScroll();
    }, 2000);
});

// Iniciar quando carregar
window.addEventListener('load', () => {
    setupInfiniteScroll();
    startAutoScroll();
});

// Função de atualização do contador
function updateCountdown() {
    const startDate = new Date('2025-02-06T00:00:00');
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) {
        document.getElementById('years').textContent = '1';
        document.getElementById('months').textContent = '0';
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        document.getElementById('totalDays').textContent = '0';
        return;
    }
    
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    const totalDays = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    document.getElementById('totalDays').textContent = totalDays;
}

// Iniciar contador
updateCountdown();
setInterval(updateCountdown, 1000);