/**
 * Map Animation Module - Tech/Spy Style
 * Author: Matteo Morreale
 */

window.MapAnimation = (function() {
    'use strict';
    
    let currentAnimation = null;
    
    // Coordinate approssimative dei continenti per l'effetto zoom
    const continentBounds = {
        'Europe': { lat: 54.5260, lng: 15.2551, zoom: 4 },
        'Asia': { lat: 34.0479, lng: 100.6197, zoom: 3 },
        'Africa': { lat: -8.7832, lng: 34.5085, zoom: 3 },
        'North America': { lat: 54.5260, lng: -105.2551, zoom: 3 },
        'South America': { lat: -8.7832, lng: -55.4915, zoom: 3 },
        'Oceania': { lat: -25.2744, lng: 133.7751, zoom: 4 }
    };
    
    function createTechMapVisualization(countryData) {
        const mapContent = document.getElementById('map-content');
        
        // Crea il contenitore per la visualizzazione tech
        const techContainer = document.createElement('div');
        techContainer.className = 'tech-map-container';
        techContainer.style.cssText = `
            width: 100%;
            height: 300px;
            position: relative;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border-radius: 0.5rem;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Crea la griglia di sfondo tech
        const techGrid = document.createElement('div');
        techGrid.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            animation: techGridMove 20s linear infinite;
        `;
        
        // Crea il radar circolare
        const radar = document.createElement('div');
        radar.style.cssText = `
            width: 200px;
            height: 200px;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            position: relative;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent);
            animation: radarPulse 3s ease-in-out infinite;
        `;
        
        // Crea i cerchi concentrici del radar
        for (let i = 1; i <= 3; i++) {
            const circle = document.createElement('div');
            circle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${60 * i}px;
                height: ${60 * i}px;
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 50%;
            `;
            radar.appendChild(circle);
        }
        
        // Crea la linea di scansione rotante
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #3b82f6, transparent);
            transform-origin: 0 50%;
            animation: radarScan 2s linear infinite;
        `;
        radar.appendChild(scanLine);
        
        // Crea il punto target per il paese
        const targetPoint = document.createElement('div');
        targetPoint.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            background: #ef4444;
            border: 2px solid #fff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: targetBlink 1s ease-in-out infinite alternate;
            box-shadow: 0 0 20px #ef4444;
        `;
        radar.appendChild(targetPoint);
        
        // Crea le informazioni del paese
        const countryInfo = document.createElement('div');
        countryInfo.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid #3b82f6;
            border-radius: 0.5rem;
            padding: 1rem;
            color: #f8fafc;
            font-family: 'Courier New', monospace;
        `;
        
        countryInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: #3b82f6; font-weight: bold;">TARGET ACQUIRED</span>
                <span style="color: #10b981; font-size: 0.8rem;">● ONLINE</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
                <div>COUNTRY: <span style="color: #3b82f6;">${countryData.name}</span></div>
                <div>CAPITAL: <span style="color: #3b82f6;">${countryData.capital || 'N/A'}</span></div>
                <div>LAT: <span style="color: #10b981;">${countryData.latitude?.toFixed(4)}°</span></div>
                <div>LNG: <span style="color: #10b981;">${countryData.longitude?.toFixed(4)}°</span></div>
            </div>
        `;
        
        // Assembla tutti gli elementi
        techContainer.appendChild(techGrid);
        techContainer.appendChild(radar);
        techContainer.appendChild(countryInfo);
        
        // Aggiungi gli stili CSS per le animazioni
        addTechAnimationStyles();
        
        return techContainer;
    }
    
    function addTechAnimationStyles() {
        if (document.getElementById('tech-animation-styles')) {
            return; // Gli stili sono già stati aggiunti
        }
        
        const style = document.createElement('style');
        style.id = 'tech-animation-styles';
        style.textContent = `
            @keyframes techGridMove {
                0% { transform: translate(0, 0); }
                100% { transform: translate(30px, 30px); }
            }
            
            @keyframes radarPulse {
                0%, 100% { 
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                }
                50% { 
                    transform: scale(1.05);
                    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
                }
            }
            
            @keyframes radarScan {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes targetBlink {
                0% { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% { 
                    opacity: 0.6;
                    transform: translate(-50%, -50%) scale(1.2);
                }
            }
            
            @keyframes zoomIn {
                0% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .tech-map-container {
                animation: zoomIn 0.8s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    function createScanningEffect() {
        const scanningOverlay = document.createElement('div');
        scanningOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(59, 130, 246, 0.1) 45%,
                rgba(59, 130, 246, 0.3) 50%,
                rgba(59, 130, 246, 0.1) 55%,
                transparent 100%
            );
            animation: scanningLine 3s ease-in-out;
            pointer-events: none;
        `;
        
        // Aggiungi l'animazione della linea di scansione
        if (!document.getElementById('scanning-animation-style')) {
            const style = document.createElement('style');
            style.id = 'scanning-animation-style';
            style.textContent = `
                @keyframes scanningLine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }
        
        return scanningOverlay;
    }
    
    function animateToCountry(countryData) {
        const mapContent = document.getElementById('map-content');
        
        // Cancella l'animazione precedente se presente
        if (currentAnimation) {
            clearTimeout(currentAnimation);
        }
        
        // Fase 1: Effetto di scansione iniziale
        mapContent.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary);">
                <div style="font-family: 'Courier New', monospace; color: #3b82f6; margin-bottom: 1rem;">
                    SATELLITE SCANNING...
                </div>
                <div style="width: 100%; height: 4px; background: var(--surface-color); border-radius: 2px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(90deg, transparent, #3b82f6, transparent); animation: scan 2s ease-in-out;"></div>
                </div>
            </div>
        `;
        
        // Fase 2: Mostra la visualizzazione tech dopo 2 secondi
        currentAnimation = setTimeout(() => {
            const techVisualization = createTechMapVisualization(countryData);
            mapContent.innerHTML = '';
            mapContent.appendChild(techVisualization);
            
            // Aggiungi l'effetto di scansione finale
            const scanningEffect = createScanningEffect();
            techVisualization.appendChild(scanningEffect);
            
            // Rimuovi l'effetto di scansione dopo l'animazione
            setTimeout(() => {
                if (scanningEffect.parentNode) {
                    scanningEffect.parentNode.removeChild(scanningEffect);
                }
            }, 3000);
            
        }, 2000);
    }
    
    function createWorldMapSVG() {
        // Semplificata mappa del mondo SVG per l'effetto zoom
        return `
            <svg viewBox="0 0 1000 500" style="width: 100%; height: 100%;">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59, 130, 246, 0.1)" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <!-- Continenti semplificati -->
                <path d="M200,150 L300,120 L350,180 L280,220 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="1"/>
                <path d="M400,100 L600,80 L650,200 L420,180 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="1"/>
                <path d="M350,250 L500,230 L480,350 L370,340 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="1"/>
                <path d="M100,200 L200,180 L180,300 L120,280 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="1"/>
                <path d="M700,250 L800,240 L780,320 L720,310 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="1"/>
            </svg>
        `;
    }
    
    // API pubblica
    return {
        animateToCountry: animateToCountry,
        createTechMapVisualization: createTechMapVisualization
    };
})();

