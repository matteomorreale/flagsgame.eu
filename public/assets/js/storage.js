/**
 * Indovina la Bandiera! - Game Storage Module
 * Copyright (C) 2025 Matteo Morreale
 * 
 * Questo software è di proprietà esclusiva di Matteo Morreale.
 * È vietato l'uso commerciale e la redistribuzione non autorizzata.
 * 
 * Autore: Matteo Morreale
 * Tutti i diritti riservati.
 */

window.GameStorage = (function() {
    'use strict';
    
    const STORAGE_KEY = 'flagGame_stats_morreale';
    const STORAGE_VERSION = '1.0';
    
    function isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    function saveStats(stats) {
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage non disponibile, i dati non verranno salvati');
            return false;
        }
        
        try {
            const dataToSave = {
                version: STORAGE_VERSION,
                timestamp: Date.now(),
                stats: stats
            };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio dei dati:', error);
            return false;
        }
    }
    
    function loadStats() {
        if (!isLocalStorageAvailable()) {
            return null;
        }
        
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (!savedData) {
                return null;
            }
            
            const parsedData = JSON.parse(savedData);
            
            // Verifica la versione dei dati
            if (parsedData.version !== STORAGE_VERSION) {
                console.warn('Versione dei dati salvati non compatibile, reset dei dati');
                clearStats();
                return null;
            }
            
            return parsedData.stats;
        } catch (error) {
            console.error('Errore nel caricamento dei dati:', error);
            return null;
        }
    }
    
    function clearStats() {
        if (!isLocalStorageAvailable()) {
            return false;
        }
        
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Errore nella cancellazione dei dati:', error);
            return false;
        }
    }
    
    function getStorageInfo() {
        if (!isLocalStorageAvailable()) {
            return {
                available: false,
                size: 0,
                lastSaved: null
            };
        }
        
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (!savedData) {
                return {
                    available: true,
                    size: 0,
                    lastSaved: null
                };
            }
            
            const parsedData = JSON.parse(savedData);
            return {
                available: true,
                size: new Blob([savedData]).size,
                lastSaved: new Date(parsedData.timestamp)
            };
        } catch (error) {
            return {
                available: true,
                size: 0,
                lastSaved: null,
                error: error.message
            };
        }
    }
    
    function exportStats() {
        const stats = loadStats();
        if (!stats) {
            return null;
        }
        
        const exportData = {
            version: STORAGE_VERSION,
            exportDate: new Date().toISOString(),
            gameStats: stats
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    function importStats(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            
            if (!importData.gameStats) {
                throw new Error('Dati non validi: mancano le statistiche del gioco');
            }
            
            return saveStats(importData.gameStats);
        } catch (error) {
            console.error('Errore nell\'importazione dei dati:', error);
            return false;
        }
    }
    
    // Funzione per mostrare un avviso sui cookie/localStorage
    function showStorageNotice() {
        if (!isLocalStorageAvailable()) {
            const notice = document.createElement('div');
            notice.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ef4444;
                color: white;
                padding: 1rem;
                text-align: center;
                z-index: 1000;
                font-weight: 500;
            `;
            notice.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                Attenzione: Il salvataggio locale non è disponibile. I tuoi progressi non verranno salvati!
            `;
            document.body.insertBefore(notice, document.body.firstChild);
            
            // Rimuovi l'avviso dopo 5 secondi
            setTimeout(() => {
                if (notice.parentNode) {
                    notice.parentNode.removeChild(notice);
                }
            }, 5000);
        }
    }
    
    // Mostra l'avviso al caricamento se necessario
    document.addEventListener('DOMContentLoaded', function() {
        showStorageNotice();
    });
    
    // API pubblica
    return {
        saveStats: saveStats,
        loadStats: loadStats,
        clearStats: clearStats,
        getStorageInfo: getStorageInfo,
        exportStats: exportStats,
        importStats: importStats,
        isAvailable: isLocalStorageAvailable
    };
})();

