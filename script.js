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
    const startDate = new Date('2025-02-07T00:00:00');
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
