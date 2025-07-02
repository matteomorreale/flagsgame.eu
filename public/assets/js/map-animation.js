/**
 * Indovina la Bandiera! - Map Animation Module
 * Copyright (C) 2025 Matteo Morreale
 * 
 * Questo software è di proprietà esclusiva di Matteo Morreale.
 * È vietato l'uso commerciale e la redistribuzione non autorizzata.
 * 
 * Autore: Matteo Morreale
 * Tutti i diritti riservati.
 */

window.MapAnimation = (function() {
    'use strict';
    
    let currentAnimation = null;
    let leafletMap = null;
    let currentMarker = null;
    
    function createTechMapVisualization(countryData) {
        const mapContent = document.getElementById('map-content');
        
        // Crea il contenitore per la visualizzazione tech con mappa del mondo
        const techContainer = document.createElement('div');
        techContainer.className = 'tech-map-container';
        techContainer.style.cssText = `
            width: 100%;
            height: 450px;
            position: relative;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border-radius: 0.5rem;
            overflow: hidden;
            border: 2px solid #3b82f6;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        `;
        
        // Container per la mappa Leaflet
        const mapContainer = document.createElement('div');
        mapContainer.id = 'leaflet-map';
        mapContainer.style.cssText = `
            position: absolute;
            top: 30px;
            left: 15px;
            right: 15px;
            height: 280px;
            border: 1px solid #3b82f6;
            border-radius: 0.5rem;
            overflow: hidden;
            z-index: 2;
        `;
        
        // Griglia di sfondo tech
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
            z-index: 1;
            pointer-events: none;
        `;
        
        // Coordinate display
        const coordsDisplay = document.createElement('div');
        coordsDisplay.style.cssText = `
            position: absolute;
            top: 290px;
            left: 20px;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid #3b82f6;
            border-radius: 0.25rem;
            padding: 0.5rem;
            color: #3b82f6;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            z-index: 3;
            width: 200px;
        `;
        coordsDisplay.innerHTML = `
            TARGET COORDS ✓<br>
            LAT: ${countryData.latitude.toFixed(4)}°<br>
            LON: ${countryData.longitude.toFixed(4)}°<br>
            <small style="color: #6b7280;">
                🔍 ZOOM: Usa rotella mouse<br>
                🖱️ DRAG: Trascina per muovere<br>
                📍 MARKER: Clicca per info<br>
                ❌ POPUP: Clicca X per chiudere
            </small>
        `;
        
        // Mini radar in alto a destra
        const miniRadar = document.createElement('div');
        miniRadar.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            width: 60px;
            height: 60px;
            border: 2px solid #3b82f6;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent);
            z-index: 3;
        `;
        
        const miniRadarLine = document.createElement('div');
        miniRadarLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 1px;
            background: #3b82f6;
            transform-origin: 0 50%;
            animation: radarScan 2s linear infinite;
        `;
        miniRadar.appendChild(miniRadarLine);
        
        const miniRadarTarget = document.createElement('div');
        miniRadarTarget.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: #ef4444;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: targetBlink 1s ease-in-out infinite alternate;
        `;
        miniRadar.appendChild(miniRadarTarget);
        
        // Pannello informazioni tech a destra in basso
        const countryInfo = document.createElement('div');
        countryInfo.style.cssText = `
            position: absolute;
            top: 255px;
            right: 5px;
            width: 220px;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid #3b82f6;
            border-radius: 0.5rem;
            padding: 1rem;
            color: #f8fafc;
            font-family: 'Courier New', monospace;
            z-index: 3;
        `;
        
        countryInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="color: #3b82f6; font-weight: bold;">🎯 TARGET ACQUIRED</span>
                <span style="color: #10b981; font-size: 0.8rem;">● ONLINE</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.85rem;">
                <div>COUNTRY: <span style="color: #3b82f6;">${countryData.name}</span></div>
                <div>CAPITAL: <span style="color: #3b82f6;">${countryData.capital || 'N/A'}</span></div>
                <div>LAT: <span style="color: #10b981;">${countryData.latitude.toFixed(4)}°</span></div>
                <div>LON: <span style="color: #10b981;">${countryData.longitude.toFixed(4)}°</span></div>
            </div>
        `;
        
        // Assembla tutti gli elementi
        techContainer.appendChild(techGrid);
        techContainer.appendChild(mapContainer);
        techContainer.appendChild(coordsDisplay);
        techContainer.appendChild(miniRadar);
        techContainer.appendChild(countryInfo);
        
        // Inizializza la mappa Leaflet dopo che il container è nel DOM
        setTimeout(() => {
            initializeLeafletMap(countryData);
        }, 100);
        
        // Aggiungi gli stili CSS per le animazioni
        addTechAnimationStyles();
        
        return techContainer;
    }
    
    function initializeLeafletMap(countryData) {
        // Rimuovi la mappa precedente se esiste
        if (leafletMap) {
            leafletMap.remove();
            leafletMap = null;
        }
        
        // Crea la mappa Leaflet con controlli di zoom abilitati
        leafletMap = L.map('leaflet-map', {
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            boxZoom: true,
            keyboard: true,
            tap: true,
            zoomControlOptions: {
                position: 'topright'
            }
        });
        
        // Usa un tile layer dark/tech style
        // CartoDB Dark Matter per stile tech
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '', // Rimosso per stile pulito
            subdomains: 'abcd',
            maxZoom: 18,
            minZoom: 1
        }).addTo(leafletMap);
        
        // Applica filtri CSS per stile tech/spy (molto alleggeriti per visibilità)
        const mapElement = document.getElementById('leaflet-map');
        mapElement.style.filter = 'hue-rotate(180deg) contrast(0.9) brightness(1.4)';
        
        // Posiziona la mappa sul paese
        const lat = parseFloat(countryData.latitude);
        const lng = parseFloat(countryData.longitude);
        
        // Zoom level intelligente basato sul tipo di paese
        let zoomLevel = 5;
        const smallIslands = ['Malta', 'Cipro', 'Lussemburgo', 'Monaco', 'San Marino', 'Vaticano', 
                             'Nauru', 'Tuvalu', 'Palau', 'Malta', 'Maldive', 'Seychelles', 
                             'Antigua e Barbuda', 'Barbados', 'Saint Kitts e Nevis', 'Saint Lucia', 
                             'Saint Vincent e Grenadine', 'Grenada', 'Dominica', 'Kiribati', 
                             'Isole Marshall', 'Micronesia', 'Bahrain', 'Singapore'];
        
        const largeCoutries = ['Russia', 'Canada', 'Stati Uniti', 'Cina', 'Brasile', 'Australia', 
                              'India', 'Argentina', 'Kazakistan', 'Algeria', 'Repubblica Democratica del Congo'];
        
        if (smallIslands.some(island => countryData.name.includes(island))) {
            zoomLevel = 8; // Zoom molto alto per isole piccole
        } else if (largeCoutries.some(country => countryData.name.includes(country))) {
            zoomLevel = 3; // Zoom basso per paesi grandi
        }
        
        leafletMap.setView([lat, lng], zoomLevel);
        
        // Crea un marker personalizzato tech/spy
        const techIcon = L.divIcon({
            className: 'tech-marker',
            html: `
                <div style="
                    position: relative;
                    width: 20px;
                    height: 20px;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 14px;
                        height: 14px;
                        background: #ef4444;
                        border: 3px solid #fef2f2;
                        border-radius: 50%;
                        box-shadow: 0 0 20px rgba(239, 68, 68, 1.0);
                        animation: techPulse 1.5s ease-in-out infinite;
                    "></div>
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 35px;
                        height: 35px;
                        border: 2px solid rgba(239, 68, 68, 0.7);
                        border-radius: 50%;
                        animation: techRipple 2s linear infinite;
                    "></div>
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Aggiungi il marker con popup
        currentMarker = L.marker([lat, lng], {
            icon: techIcon
        }).addTo(leafletMap);
        
        // Aggiungi popup informativo al marker
        const popupContent = `
            <div style="color: #1e293b; font-family: 'Courier New', monospace; text-align: center; min-width: 150px;">
                <strong style="color: #ef4444; font-size: 1.1em;">📍 ${countryData.name}</strong><br>
                <small style="color: #000000;">
                    🏛️ ${countryData.capital || 'N/A'}<br>
                    📍 ${lat.toFixed(2)}°, ${lng.toFixed(2)}°<br>
                    💡 Clicca X per chiudere
                </small>
            </div>
        `;
        
        currentMarker.bindPopup(popupContent, {
            closeButton: true,
            className: 'tech-popup',
            autoPan: false,
            closeOnClick: true
        });
        
        // Apri automaticamente il popup dopo 1 secondo, ma permettendo la chiusura
        setTimeout(() => {
            if (currentMarker) {
                currentMarker.openPopup();
                // Chiudi automaticamente dopo 5 secondi per non disturbare
                setTimeout(() => {
                    if (currentMarker && currentMarker.isPopupOpen()) {
                        currentMarker.closePopup();
                    }
                }, 5000);
            }
        }, 1000);
        
        // Aggiungi effetto di scansione sulla mappa
        addMapScanEffect();
    }
    
    function addMapScanEffect() {
        const mapElement = document.getElementById('leaflet-map');
        
        // Linea di scansione
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #3b82f6, transparent);
            animation: scanLine 3s ease-in-out infinite;
            z-index: 1000;
            pointer-events: none;
        `;
        mapElement.appendChild(scanLine);
        
        // Griglia tech overlay (ridotta per migliore visibilità)
        const techOverlay = document.createElement('div');
        techOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 999;
            pointer-events: none;
            opacity: 0.1;
        `;
        mapElement.appendChild(techOverlay);
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
            
            @keyframes techPulse {
                0%, 100% { 
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0.7;
                }
            }
            
            @keyframes techRipple {
                0% { 
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.8;
                }
                100% { 
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes scanLine {
                0% { left: -100%; }
                100% { left: 100%; }
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
            
            /* Override Leaflet styles per tema tech */
            .leaflet-container {
                background: #1e293b !important;
            }
            
            .tech-marker {
                background: transparent !important;
                border: none !important;
            }
            
            /* Stili per il popup tech */
            .tech-popup .leaflet-popup-content-wrapper {
                background: rgba(248, 250, 252, 0.95) !important;
                border: 2px solid #3b82f6 !important;
                border-radius: 0.5rem !important;
                box-shadow: 0 0 15px rgba(59, 130, 246, 0.5) !important;
            }
            
            .tech-popup .leaflet-popup-tip {
                background: rgba(248, 250, 252, 0.95) !important;
                border: 2px solid #3b82f6 !important;
                border-top: none !important;
                border-right: none !important;
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
        
        // Rimuovi la mappa precedente se esiste
        if (leafletMap) {
            leafletMap.remove();
            leafletMap = null;
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
    
    // API pubblica
    return {
        animateToCountry: animateToCountry,
        createTechMapVisualization: createTechMapVisualization
    };
})();

