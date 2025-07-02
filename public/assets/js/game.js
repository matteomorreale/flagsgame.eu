/**
 * Flag Game Main Logic
 * Author: Matteo Morreale
 */

class FlagGame {
    constructor() {
        this.currentQuestion = null;
        this.selectedOption = null;
        this.isAnswered = false;
        this.gameStats = {
            correct: 0,
            incorrect: 0,
            bonusPoints: 0,
            currentStreak: 0,
            multiplier: 1,
            totalCorrect: 0
        };
        
        this.apiBaseUrl = 'api';
        this.init();
    }
    
    init() {
        this.loadGameStats();
        this.updateStatsDisplay();
        this.updateMedalsDisplay();
        this.loadNewQuestion();
    }
    
    async loadNewQuestion() {
        try {
            this.showLoading();
            this.resetQuestionState();
            
            // Aggiungi un parametro timestamp per evitare il cache
            const timestamp = Date.now();
            const response = await fetch(`${this.apiBaseUrl}/random_flag.php?t=${timestamp}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            this.currentQuestion = data;
            this.displayQuestion();
            this.hideLoading();
            
        } catch (error) {
            console.error('Errore nel caricamento della domanda:', error);
            this.showError('Errore nel caricamento della bandiera. Riprova.');
        }
    }
    
    displayQuestion() {
        const flagImage = document.getElementById('flag-image');
        flagImage.src = this.currentQuestion.image_url;
        flagImage.alt = 'Bandiera da indovinare';
        
        // Popola le opzioni
        this.currentQuestion.options.forEach((option, index) => {
            const button = document.getElementById(`option-${index}`);
            const textSpan = button.querySelector('.option-text');
            textSpan.textContent = option.name;
            
            // Reset dello stato del pulsante
            button.className = 'option-button';
            button.disabled = false;
        });
        
        // Nascondi elementi che appaiono dopo la risposta
        document.getElementById('tip-container').style.display = 'none';
        document.getElementById('map-container').style.display = 'none';
        document.getElementById('continue-container').style.display = 'none';
    }
    
    async selectOption(optionIndex) {
        if (this.isAnswered) return;
        
        this.selectedOption = optionIndex;
        this.isAnswered = true;
        
        // Disabilita tutti i pulsanti
        for (let i = 0; i < 4; i++) {
            document.getElementById(`option-${i}`).disabled = true;
        }
        
        const selectedOptionData = this.currentQuestion.options[optionIndex];
        
        try {
            // Invia la risposta al backend per la verifica
            const response = await fetch(`${this.apiBaseUrl}/check_answer.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flag_id: this.currentQuestion.flag_id,
                    selected_country_name: selectedOptionData.name
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            
            this.processAnswer(result, optionIndex);
            
        } catch (error) {
            console.error('Errore nella verifica della risposta:', error);
            this.showError('Errore nella verifica della risposta. Riprova.');
        }
    }
    
    processAnswer(result, selectedIndex) {
        const isCorrect = result.is_correct;
        
        // Aggiorna le statistiche
        if (isCorrect) {
            this.gameStats.correct++;
            this.gameStats.currentStreak++;
            this.gameStats.totalCorrect++;
            
            // Calcola i punti bonus con il moltiplicatore
            // Il moltiplicatore aumenta con la streak, ma ha un massimo
            this.gameStats.multiplier = Math.min(this.gameStats.currentStreak, 10);
            
            // I punti bonus sono calcolati come: punti base (1) * moltiplicatore
            const pointsEarned = 1 * this.gameStats.multiplier;
            this.gameStats.bonusPoints += pointsEarned;
            
        } else {
            this.gameStats.incorrect++;
            this.gameStats.currentStreak = 0;
            this.gameStats.multiplier = 1;
        }
        
        // Evidenzia le opzioni
        this.highlightOptions(selectedIndex, isCorrect, result.correct_country_name);
        
        // Mostra il suggerimento
        this.showTip();
        
        // Mostra l'animazione della mappa
        this.showMapAnimation(result.country_data);
        
        // Aggiorna le statistiche visualizzate
        this.updateStatsDisplay();
        this.updateMedalsDisplay();
        this.checkForNewMedals();
        
        // Salva le statistiche
        this.saveGameStats();
        
        // Mostra il pulsante continua
        setTimeout(() => {
            document.getElementById('continue-container').style.display = 'block';
        }, 1000);
    }
    
    highlightOptions(selectedIndex, isCorrect, correctCountryName) {
        // Trova l'indice dell'opzione corretta
        let correctIndex = -1;
        for (let i = 0; i < this.currentQuestion.options.length; i++) {
            if (this.currentQuestion.options[i].name === correctCountryName) {
                correctIndex = i;
                break;
            }
        }
        
        // Evidenzia l'opzione selezionata
        const selectedButton = document.getElementById(`option-${selectedIndex}`);
        if (isCorrect) {
            selectedButton.classList.add('correct');
        } else {
            selectedButton.classList.add('incorrect');
        }
        
        // Evidenzia l'opzione corretta se diversa da quella selezionata
        if (!isCorrect && correctIndex !== -1) {
            const correctButton = document.getElementById(`option-${correctIndex}`);
            correctButton.classList.add('correct');
        }
        
        // Aggiungi animazione pulse all'opzione corretta
        if (correctIndex !== -1) {
            const correctButton = document.getElementById(`option-${correctIndex}`);
            correctButton.classList.add('pulse');
        }
    }
    
    showTip() {
        const tipContainer = document.getElementById('tip-container');
        const tipText = document.getElementById('tip-text');
        
        tipText.textContent = this.currentQuestion.tip;
        tipContainer.style.display = 'block';
    }
    
    showMapAnimation(countryData) {
        const mapContainer = document.getElementById('map-container');
        const mapContent = document.getElementById('map-content');
        
        // Per ora mostra informazioni di base del paese
        mapContent.innerHTML = `
            <div style="text-align: center; color: var(--text-primary);">
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">${countryData.name}</h4>
                <p style="margin-bottom: 0.5rem;"><strong>Capitale:</strong> ${countryData.capital || 'N/A'}</p>
                <p style="margin-bottom: 0.5rem;"><strong>Coordinate:</strong> ${countryData.latitude?.toFixed(2)}°, ${countryData.longitude?.toFixed(2)}°</p>
                <div style="margin-top: 1rem; padding: 1rem; background: var(--surface-color); border-radius: 0.5rem;">
                    <i class="fas fa-satellite" style="color: var(--primary-color); margin-right: 0.5rem;"></i>
                    <span style="color: var(--text-secondary);">Posizione identificata</span>
                </div>
            </div>
        `;
        
        mapContainer.style.display = 'block';
        
        // Attiva l'animazione della mappa (implementata in map-animation.js)
        if (window.MapAnimation) {
            window.MapAnimation.animateToCountry(countryData);
        }
    }
    
    nextQuestion() {
        this.loadNewQuestion();
    }
    
    resetQuestionState() {
        this.selectedOption = null;
        this.isAnswered = false;
        this.currentQuestion = null;
        
        // Reset delle classi CSS sui pulsanti
        for (let i = 0; i < 4; i++) {
            const button = document.getElementById(`option-${i}`);
            button.className = 'option-button';
            button.disabled = false;
        }
    }
    
    updateStatsDisplay() {
        document.getElementById('correct-count').textContent = this.gameStats.correct;
        document.getElementById('incorrect-count').textContent = this.gameStats.incorrect;
        document.getElementById('bonus-points').textContent = this.gameStats.bonusPoints;
        document.getElementById('multiplier').textContent = `(x${this.gameStats.multiplier})`;
    }
    
    updateMedalsDisplay() {
        const medals = [
            { id: 'medal-5', threshold: 5 },
            { id: 'medal-10', threshold: 10 },
            { id: 'medal-20', threshold: 20 },
            { id: 'medal-50', threshold: 50 },
            { id: 'medal-100', threshold: 100 },
            { id: 'medal-200', threshold: 200 }
        ];
        
        medals.forEach(medal => {
            const element = document.getElementById(medal.id);
            if (this.gameStats.totalCorrect >= medal.threshold) {
                element.classList.add('earned');
            } else {
                element.classList.remove('earned');
            }
        });
    }
    
    checkForNewMedals() {
        const medals = [
            { threshold: 5, name: 'Bronzo', description: '5 bandiere indovinate!' },
            { threshold: 10, name: 'Argento', description: '10 bandiere indovinate!' },
            { threshold: 20, name: 'Oro', description: '20 bandiere indovinate!' },
            { threshold: 50, name: 'Platino', description: '50 bandiere indovinate!' },
            { threshold: 100, name: 'Diamante', description: '100 bandiere indovinate!' },
            { threshold: 200, name: 'Leggendario', description: '200 bandiere indovinate!' }
        ];
        
        // Controlla se è stata appena raggiunta una nuova medaglia
        const previousTotal = this.gameStats.totalCorrect - 1;
        
        medals.forEach(medal => {
            if (this.gameStats.totalCorrect >= medal.threshold && previousTotal < medal.threshold) {
                this.showMedalNotification(medal);
            }
        });
    }
    
    showMedalNotification(medal) {
        // Crea una notifica per la nuova medaglia
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ffd700, #ffb347);
            color: #1e293b;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            text-align: center;
            font-weight: bold;
            animation: medalPopup 3s ease-in-out forwards;
            min-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Nuova Medaglia!</h3>
            <p style="margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #8b4513;">${medal.name}</p>
            <p style="margin: 0; font-size: 1rem; color: #6b5b47;">${medal.description}</p>
        `;
        
        // Aggiungi l'animazione CSS se non esiste
        if (!document.getElementById('medal-animation-style')) {
            const style = document.createElement('style');
            style.id = 'medal-animation-style';
            style.textContent = `
                @keyframes medalPopup {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.5);
                    }
                    20% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.1);
                    }
                    30% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                    80% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Rimuovi la notifica dopo l'animazione
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
        
        // Aggiungi effetto sonoro (se disponibile)
        this.playMedalSound();
    }
    
    playMedalSound() {
        // Crea un suono sintetico per la medaglia usando Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // Ignora errori audio se non supportato
            console.log('Audio non supportato');
        }
    }
    
    showLoading() {
        document.getElementById('loading-spinner').style.display = 'block';
        document.getElementById('game-content').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
    }
    
    showError(message) {
        this.hideLoading();
        const mapContent = document.getElementById('map-content');
        mapContent.innerHTML = `
            <div style="text-align: center; color: var(--error-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>${message}</p>
                <button onclick="game.loadNewQuestion()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    Riprova
                </button>
            </div>
        `;
        document.getElementById('map-container').style.display = 'block';
        document.getElementById('game-content').style.display = 'block';
    }
    
    saveGameStats() {
        if (window.GameStorage) {
            window.GameStorage.saveStats(this.gameStats);
        }
    }
    
    loadGameStats() {
        if (window.GameStorage) {
            const savedStats = window.GameStorage.loadStats();
            if (savedStats) {
                this.gameStats = { ...this.gameStats, ...savedStats };
            }
        }
    }
}

// Funzioni globali per l'interfaccia
function selectOption(index) {
    if (window.game) {
        window.game.selectOption(index);
    }
}

function nextQuestion() {
    if (window.game) {
        window.game.nextQuestion();
    }
}

// Inizializza il gioco quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    window.game = new FlagGame();
});

