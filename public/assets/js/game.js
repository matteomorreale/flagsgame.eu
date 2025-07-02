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
            
            // Reset completo dello stato del pulsante
            button.className = 'option-button';
            button.disabled = false;
            
            // Rimuovi gli stili inline applicati per touch devices
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
            
            // Rimuovi anche eventuali classi di animazione
            button.classList.remove('pulse');
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
        
        // Evidenzia l'opzione selezionata con forzatura per touch devices
        const selectedButton = document.getElementById(`option-${selectedIndex}`);
        if (isCorrect) {
            selectedButton.className = 'option-button correct';
            // Forza il ridisegno per dispositivi touch
            selectedButton.style.background = 'var(--gradient-success)';
            selectedButton.style.borderColor = 'var(--success-color)';
            selectedButton.style.color = 'white';
        } else {
            selectedButton.className = 'option-button incorrect';
            // Forza il ridisegno per dispositivi touch
            selectedButton.style.background = 'var(--gradient-error)';
            selectedButton.style.borderColor = 'var(--error-color)';
            selectedButton.style.color = 'white';
        }
        
        // Evidenzia l'opzione corretta se diversa da quella selezionata
        if (!isCorrect && correctIndex !== -1) {
            const correctButton = document.getElementById(`option-${correctIndex}`);
            correctButton.className = 'option-button correct';
            // Forza il ridisegno per dispositivi touch
            correctButton.style.background = 'var(--gradient-success)';
            correctButton.style.borderColor = 'var(--success-color)';
            correctButton.style.color = 'white';
        }
        
        // Aggiungi animazione pulse all'opzione corretta
        if (correctIndex !== -1) {
            const correctButton = document.getElementById(`option-${correctIndex}`);
            correctButton.classList.add('pulse');
        }
        
        // Forza un reflow per assicurarsi che i cambiamenti siano applicati
        selectedButton.offsetHeight;
        if (!isCorrect && correctIndex !== -1) {
            document.getElementById(`option-${correctIndex}`).offsetHeight;
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
        
        // Crea il contenitore principale con stile tech
        mapContent.innerHTML = `
            <div style="text-align: center; color: var(--text-primary);">
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">${countryData.name}</h4>
                <p style="margin-bottom: 0.5rem;"><strong>Capitale:</strong> ${countryData.capital || 'N/A'}</p>
                <p style="margin-bottom: 1rem;"><strong>Coordinate:</strong> ${countryData.latitude?.toFixed(2)}°, ${countryData.longitude?.toFixed(2)}°</p>
                
                <!-- Sezione mappa del mondo separata per test -->
                <div style="margin-bottom: 1rem;">
                    <h5 style="color: var(--primary-color); margin-bottom: 0.5rem;">🗺️ Posizione nel mondo:</h5>
                    <div style="
                        width: 100%;
                        height: 200px;
                        background: #4b5563;
                        border: 2px solid #6b7280;
                        border-radius: 0.5rem;
                        position: relative;
                        overflow: hidden;
                    ">
                        <!-- Forme dei continenti più visibili -->
                        <div style="
                            position: absolute;
                            top: 20%;
                            left: 8%;
                            width: 15%;
                            height: 25%;
                            background: #374151;
                            border-radius: 30% 20% 40% 50%;
                            border: 1px solid #9ca3af;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 15%;
                            left: 25%;
                            width: 18%;
                            height: 30%;
                            background: #374151;
                            border-radius: 40% 30% 20% 60%;
                            border: 1px solid #9ca3af;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 30%;
                            left: 45%;
                            width: 25%;
                            height: 35%;
                            background: #374151;
                            border-radius: 20% 50% 30% 40%;
                            border: 1px solid #9ca3af;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 45%;
                            left: 18%;
                            width: 12%;
                            height: 30%;
                            background: #374151;
                            border-radius: 50% 20% 60% 30%;
                            border: 1px solid #9ca3af;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 55%;
                            left: 75%;
                            width: 10%;
                            height: 15%;
                            background: #374151;
                            border-radius: 60% 40% 50% 30%;
                            border: 1px solid #9ca3af;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 65%;
                            left: 15%;
                            width: 8%;
                            height: 20%;
                            background: #374151;
                            border-radius: 40% 60% 30% 50%;
                            border: 1px solid #9ca3af;
                        "></div>
                        
                        <!-- Etichette dei continenti -->
                        <div style="position: absolute; top: 32%; left: 15%; color: #d1d5db; font-size: 0.6rem; font-weight: bold;">N.AM</div>
                        <div style="position: absolute; top: 30%; left: 34%; color: #d1d5db; font-size: 0.6rem; font-weight: bold;">EUR</div>
                        <div style="position: absolute; top: 47%; left: 57%; color: #d1d5db; font-size: 0.6rem; font-weight: bold;">ASIA</div>
                        <div style="position: absolute; top: 60%; left: 24%; color: #d1d5db; font-size: 0.6rem; font-weight: bold;">AFR</div>
                        <div style="position: absolute; top: 62%; left: 79%; color: #d1d5db; font-size: 0.6rem; font-weight: bold;">AUS</div>
                        <div style="position: absolute; top: 75%; left: 18%; color: #d1d5db; font-size: 0.6rem; font-weight: bold;">S.AM</div>
                        
                        <!-- Punto del paese -->
                        <div style="
                            position: absolute;
                            width: 8px;
                            height: 8px;
                            background: #ef4444;
                            border: 2px solid #fef2f2;
                            border-radius: 50%;
                            left: ${((countryData.longitude + 180) / 360 * 100)}%;
                            top: ${((90 - countryData.latitude) / 180 * 100)}%;
                            transform: translate(-50%, -50%);
                            z-index: 10;
                            animation: pulse 1.5s ease-in-out infinite;
                            box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
                        "></div>
                        
                        <!-- Etichetta del paese -->
                        <div style="
                            position: absolute;
                            left: ${((countryData.longitude + 180) / 360 * 100)}%;
                            top: ${Math.max(5, ((90 - countryData.latitude) / 180 * 100) - 15)}%;
                            transform: translateX(-50%);
                            background: rgba(239, 68, 68, 0.9);
                            color: white;
                            padding: 0.2rem 0.4rem;
                            border-radius: 0.2rem;
                            font-size: 0.6rem;
                            font-weight: bold;
                            z-index: 11;
                            white-space: nowrap;
                        ">
                            📍 ${countryData.name}
                        </div>
                        
                        <!-- Griglia di coordinate -->
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-image: 
                                linear-gradient(rgba(156, 163, 175, 0.2) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(156, 163, 175, 0.2) 1px, transparent 1px);
                            background-size: 20% 25%;
                            z-index: 1;
                        "></div>
                    </div>
                    <p style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.5rem; text-align: center;">
                        Lat: ${countryData.latitude?.toFixed(2)}° | Lon: ${countryData.longitude?.toFixed(2)}°
                    </p>
                </div>
                
                <!-- Mappa interattiva con stile tech -->
                <div id="country-map" style="
                    width: 100%;
                    height: 300px;
                    position: relative;
                    background: linear-gradient(135deg, #0f172a, #1e293b);
                    border-radius: 0.5rem;
                    overflow: hidden;
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                ">
                    <!-- Griglia tech di sfondo -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-image: 
                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
                        background-size: 30px 30px;
                        opacity: 0.5;
                    "></div>
                    
                    <!-- Linea di scansione animata -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 2px;
                        background: linear-gradient(90deg, transparent, #3b82f6, transparent);
                        animation: scanLine 2s ease-in-out infinite;
                    "></div>
                    
                    <!-- Mappa del mondo semplificata -->
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: #1e293b;
                        position: relative;
                        z-index: 1;
                        border-radius: 0.5rem;
                        overflow: hidden;
                    ">
                        <!-- Continenti stilizzati con testo -->
                        <div style="
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 300\"><rect width=\"600\" height=\"300\" fill=\"%231e293b\"/><g fill=\"%234b5563\" stroke=\"%236b7280\" stroke-width=\"1\"><path d=\"M50,150 Q80,120 120,140 Q180,130 220,150 Q250,140 280,160 L300,180 Q280,200 250,190 Q220,200 180,180 Q120,190 80,170 Q50,160 50,150 Z\" opacity=\"0.8\"/><path d=\"M320,100 Q380,90 420,110 Q460,100 500,120 Q540,110 580,130 L580,170 Q540,180 500,170 Q460,180 420,160 Q380,170 320,150 Z\" opacity=\"0.8\"/><path d=\"M100,200 Q140,190 180,210 Q220,200 260,220 L280,240 Q240,250 200,240 Q160,250 120,230 Q100,220 100,200 Z\" opacity=\"0.7\"/><path d=\"M350,180 Q390,170 430,190 Q470,180 510,200 L530,220 Q490,230 450,220 Q410,230 370,210 Q350,200 350,180 Z\" opacity=\"0.7\"/><path d=\"M80,80 Q120,70 160,90 Q200,80 240,100 L260,120 Q220,130 180,120 Q140,130 100,110 Q80,100 80,80 Z\" opacity=\"0.6\"/><path d=\"M480,200 Q520,190 560,210 L580,230 Q540,240 500,230 Q480,220 480,200 Z\" opacity=\"0.6\"/></g></svg>');
                            background-size: cover;
                            background-position: center;
                        "></div>
                        
                        <!-- Etichette dei continenti -->
                        <div style="
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            font-size: 0.6rem;
                            color: #6b7280;
                            font-weight: bold;
                            pointer-events: none;
                        ">
                            <div style="position: absolute; top: 25%; left: 15%; transform: translate(-50%, -50%);">EUR</div>
                            <div style="position: absolute; top: 30%; left: 35%; transform: translate(-50%, -50%);">ASIA</div>
                            <div style="position: absolute; top: 55%; left: 20%; transform: translate(-50%, -50%);">AFR</div>
                            <div style="position: absolute; top: 45%; left: 80%; transform: translate(-50%, -50%);">AUS</div>
                            <div style="position: absolute; top: 40%; left: 8%; transform: translate(-50%, -50%);">AM.N</div>
                            <div style="position: absolute; top: 70%; left: 25%; transform: translate(-50%, -50%);">AM.S</div>
                        </div>
                        
                        <!-- Punto del paese calcolato -->
                        <div id="country-marker" style="
                            position: absolute;
                            width: 12px;
                            height: 12px;
                            background: #ef4444;
                            border: 3px solid #fef2f2;
                            border-radius: 50%;
                            transform: translate(-50%, -50%);
                            left: ${((countryData.longitude + 180) / 360 * 100)}%;
                            top: ${((90 - countryData.latitude) / 180 * 100)}%;
                            z-index: 3;
                            animation: pulse 1.5s ease-in-out infinite;
                            box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
                        ">
                        </div>
                        
                        <!-- Etichetta del paese -->
                        <div style="
                            position: absolute;
                            left: ${((countryData.longitude + 180) / 360 * 100)}%;
                            top: ${Math.max(10, ((90 - countryData.latitude) / 180 * 100) - 8)}%;
                            transform: translateX(-50%);
                            background: rgba(239, 68, 68, 0.9);
                            color: white;
                            padding: 0.25rem 0.5rem;
                            border-radius: 0.25rem;
                            font-size: 0.7rem;
                            font-weight: bold;
                            z-index: 4;
                            white-space: nowrap;
                        ">
                            ${countryData.name}
                        </div>
                        
                        <!-- Griglia di coordinate -->
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-image: 
                                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
                            background-size: 60px 30px;
                            z-index: 2;
                        "></div>
                    </div>
                    
                    <!-- Overlay con informazioni tech -->
                    <div class="country-infos">
                        <div class="info-title">TARGET ACQUIRED</div>
                        <div class="info-coords">
                            LAT: ${countryData.latitude?.toFixed(4)}°<br>
                            LON: ${countryData.longitude?.toFixed(4)}°
                        </div>
                    </div>
                    
                    <!-- Crosshair nel centro -->
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 30px;
                        height: 30px;
                        border: 2px solid #ef4444;
                        border-radius: 50%;
                        z-index: 2;
                        animation: pulse 1.5s ease-in-out infinite;
                    ">
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 8px;
                            height: 8px;
                            background: #ef4444;
                            border-radius: 50%;
                        "></div>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; padding: 1rem; background: var(--surface-color); border-radius: 0.5rem;">
                    <i class="fas fa-satellite" style="color: var(--primary-color); margin-right: 0.5rem;"></i>
                    <span style="color: var(--text-secondary);">Posizione identificata e confermata</span>
                </div>
            </div>
        `;
        
        // Aggiungi le animazioni CSS se non esistono
        if (!document.getElementById('map-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'map-animation-styles';
            style.textContent = `
                @keyframes scanLine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                @keyframes pulse {
                    0%, 100% { 
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    50% { 
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 0.7;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
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
        
        // Reset completo delle classi CSS e stili inline sui pulsanti
        for (let i = 0; i < 4; i++) {
            const button = document.getElementById(`option-${i}`);
            button.className = 'option-button';
            button.disabled = false;
            
            // Rimuovi gli stili inline applicati per touch devices
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
            
            // Rimuovi anche eventuali classi di animazione
            button.classList.remove('pulse');
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

