// Controle de música
const audio = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.querySelector('.music-icon');
let isPlaying = false;

// Função para tocar música
function playMusic() {
    audio.play()
        .then(() => {
            isPlaying = true;
            musicIcon.textContent = '🔊';
            musicToggle.classList.add('playing');
        })
        .catch(error => {
            console.log('Erro ao reproduzir áudio:', error);
            // Tenta novamente após interação do usuário
        });
}

// Função para pausar música
function pauseMusic() {
    audio.pause();
    isPlaying = false;
    musicIcon.textContent = '🎵';
    musicToggle.classList.remove('playing');
}

// Toggle de música
musicToggle.addEventListener('click', function() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// Tentar tocar música quando o usuário clicar no botão surpresa
document.getElementById('surpriseBtn').addEventListener('click', function() {
    // Tenta tocar a música automaticamente ao clicar no botão
    playMusic();
    
    // Esconde o botão
    document.getElementById('splashScreen').classList.add('hidden');
    
    // Aguarda 1 segundo antes de mostrar as luzes vermelhas
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.remove('hidden');
        document.getElementById('loadingScreen').classList.add('visible');
    }, 1300);
    
    // Aguarda 4 segundos (total) antes de mostrar a tela de aniversário
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.remove('visible');
        document.getElementById('loadingScreen').classList.add('hidden');
        
        setTimeout(() => {
            document.getElementById('anniversaryScreen').classList.remove('hidden');
            document.getElementById('anniversaryScreen').classList.add('visible');
            
            // Após 5 segundos, esconde a tela de aniversário e mostra o conteúdo principal
            setTimeout(() => {
                document.getElementById('anniversaryScreen').classList.add('fade-out');
                setTimeout(() => {
                    document.getElementById('mainContent').classList.add('visible');
                }, 800);
            }, 5000);
        }, 500);
    }, 4000);
});

// Função de contador
function updateCountdown() {
    const startDate = new Date('2025-02-06T00:00:00');
    const now = new Date();
    const diff = now - startDate;
    
    if (diff < 0) {
        document.getElementById('years').textContent = '0';
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

// Controle de alternância entre anos
const yearButtons = document.querySelectorAll('.year-btn');
const yearContents = document.querySelectorAll('.year-content');

yearButtons.forEach(button => {
    button.addEventListener('click', function() {
        const year = this.getAttribute('data-year');
        
        // Remove classe active de todos os botões
        yearButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona classe active no botão clicado
        this.classList.add('active');
        
        // Esconde todos os conteúdos
        yearContents.forEach(content => content.classList.remove('active'));
        
        // Mostra o conteúdo do ano selecionado
        document.getElementById('year-' + year).classList.add('active');
    });
});

// Sistema de Modais - Galeria de Fotos do Mês
const monthModal = document.getElementById('monthModal');
const monthModalOverlay = document.getElementById('monthModalOverlay');
const monthModalClose = document.getElementById('monthModalClose');
const monthModalTitle = document.getElementById('monthModalTitle');
const monthModalGrid = document.getElementById('monthModalGrid');

const photoModal = document.getElementById('photoModal');
const photoModalOverlay = document.getElementById('photoModalOverlay');
const photoModalClose = document.getElementById('photoModalClose');
const photoModalImg = document.getElementById('photoModalImg');
const photoModalPrev = document.getElementById('photoModalPrev');
const photoModalNext = document.getElementById('photoModalNext');

let currentMonthMedia = [];
let currentMediaIndex = 0;

// Definir quantos slots de mídia mostrar no modal (12 slots = 3 linhas de 4)
const MODAL_MEDIA_SLOTS = 12;

// Função para verificar se é vídeo
function isVideo(src) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
}

// Adicionar evento de clique nos cards de mês
document.addEventListener('click', function(e) {
    const monthCard = e.target.closest('.month-card');
    if (monthCard) {
        const monthName = monthCard.querySelector('.month-name').textContent;
        const yearSection = monthCard.closest('.year-content');
        const year = yearSection.id.replace('year-', '');
        
        // Coletar todas as mídias do mês (fotos e vídeos)
        const mediaSlots = monthCard.querySelectorAll('.photo-slot');
        currentMonthMedia = [];
        
        mediaSlots.forEach(slot => {
            const img = slot.querySelector('img');
            const video = slot.querySelector('video');
            
            if (img) {
                currentMonthMedia.push({ type: 'image', src: img.src });
            } else if (video) {
                currentMonthMedia.push({ type: 'video', src: video.src });
            }
        });
        
        // Abrir modal do mês com mais slots
        openMonthModal(monthName, year, mediaSlots);
    }
});

function openMonthModal(monthName, year, mainMediaSlots) {
    monthModalTitle.textContent = `${monthName} ${year}`;
    monthModalGrid.innerHTML = '';
    
    // Coletar mídias principais
    const mainMedia = [];
    mainMediaSlots.forEach(slot => {
        const img = slot.querySelector('img');
        const video = slot.querySelector('video');
        
        if (img) {
            mainMedia.push({ type: 'image', src: img.src });
        } else if (video) {
            mainMedia.push({ type: 'video', src: video.src });
        }
    });
    
    // Atualizar array de mídias para navegação
    currentMonthMedia = [...mainMedia];
    
    // Criar slots no modal (12 slots ao invés de 4)
    for (let i = 0; i < MODAL_MEDIA_SLOTS; i++) {
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'month-modal-photo';
        
        if (i < mainMedia.length) {
            const media = mainMedia[i];
            
            if (media.type === 'image') {
                // Imagem
                const imgElement = document.createElement('img');
                imgElement.src = media.src;
                imgElement.alt = `Mídia ${i + 1}`;
                mediaDiv.appendChild(imgElement);
            } else if (media.type === 'video') {
                // Vídeo
                const videoElement = document.createElement('video');
                videoElement.src = media.src;
                videoElement.muted = true;
                videoElement.style.pointerEvents = 'none';
                mediaDiv.appendChild(videoElement);
                
                // Adicionar indicador de vídeo
                const indicator = document.createElement('div');
                indicator.className = 'video-indicator';
                indicator.innerHTML = '▶';
                mediaDiv.appendChild(indicator);
            }
            
            // Adicionar evento de clique para abrir mídia individual
            const mediaIndex = i;
            mediaDiv.addEventListener('click', () => {
                openPhotoModal(mediaIndex);
            });
        } else {
            // Slot vazio
            mediaDiv.classList.add('empty');
            const plusIcon = document.createElement('span');
            plusIcon.className = 'plus-icon';
            plusIcon.textContent = '+';
            mediaDiv.appendChild(plusIcon);
        }
        
        monthModalGrid.appendChild(mediaDiv);
    }
    
    monthModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMonthModal() {
    monthModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Eventos para fechar modal do mês
monthModalClose.addEventListener('click', closeMonthModal);
monthModalOverlay.addEventListener('click', closeMonthModal);

// Fechar com tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (photoModal.classList.contains('active')) {
            closePhotoModal();
        } else if (monthModal.classList.contains('active')) {
            closeMonthModal();
        }
    }
});

// Modal de Foto/Vídeo Individual
function openPhotoModal(index) {
    if (currentMonthMedia.length === 0) return;
    
    currentMediaIndex = index;
    updatePhotoModal();
    photoModal.classList.add('active');
}

function closePhotoModal() {
    photoModal.classList.remove('active');
    // Pausar vídeo ao fechar se existir
    const videoElement = document.querySelector('#photoModal video');
    if (videoElement) {
        videoElement.pause();
    }
}

function updatePhotoModal() {
    const media = currentMonthMedia[currentMediaIndex];
    
    if (!media) return;
    
    // Limpar conteúdo anterior
    const modalContent = photoModal.querySelector('.photo-modal-content');
    const existingMedia = modalContent.querySelectorAll('img, video');
    existingMedia.forEach(el => {
        if (el.tagName === 'VIDEO') {
            el.pause();
        }
        if (el.id !== 'photoModalImg') {
            el.remove();
        }
    });
    
    if (media.type === 'image') {
        // Mostrar imagem
        photoModalImg.src = media.src;
        photoModalImg.style.display = 'block';
    } else if (media.type === 'video') {
        // Esconder imagem
        photoModalImg.style.display = 'none';
        
        // Criar e mostrar vídeo
        const videoElement = document.createElement('video');
        videoElement.src = media.src;
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.style.maxWidth = '100%';
        videoElement.style.maxHeight = '90vh';
        videoElement.style.borderRadius = '15px';
        videoElement.style.boxShadow = '0 10px 50px rgba(0, 0, 0, 0.8)';
        
        modalContent.appendChild(videoElement);
    }
}

function nextPhoto() {
    currentMediaIndex = (currentMediaIndex + 1) % currentMonthMedia.length;
    updatePhotoModal();
}

function prevPhoto() {
    currentMediaIndex = (currentMediaIndex - 1 + currentMonthMedia.length) % currentMonthMedia.length;
    updatePhotoModal();
}

// Eventos do modal de foto/vídeo individual
photoModalClose.addEventListener('click', closePhotoModal);
photoModalOverlay.addEventListener('click', closePhotoModal);
photoModalNext.addEventListener('click', nextPhoto);
photoModalPrev.addEventListener('click', prevPhoto);

// Navegação com teclas de seta
document.addEventListener('keydown', function(e) {
    if (photoModal.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === 'ArrowLeft') {
            prevPhoto();
        }
    }
});
