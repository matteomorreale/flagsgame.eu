# Indovina la Bandiera! 🏁

**Autore:** Matteo Morreale

Un gioco web interattivo per indovinare le bandiere dei paesi del mondo, con sistema di punteggi, medaglie e animazioni in stile tech/spionaggio.

## Caratteristiche Principali

### 🎮 Gameplay
- **Quiz interattivo**: Mostra una bandiera e 4 opzioni di risposta
- **Feedback immediato**: Evidenzia la risposta corretta/sbagliata con colori
- **Suggerimenti**: Ogni bandiera include un tip per memorizzarla meglio
- **Animazione mappa**: Effetti tech/spionaggio che mostrano la posizione del paese

### 🏆 Sistema di Punteggi
- **Contatori**: Risposte corrette e sbagliate
- **Moltiplicatore**: Aumenta con le risposte consecutive corrette (max x10)
- **Punti bonus**: Calcolati come risposte corrette × moltiplicatore
- **Medaglie**: 6 livelli di achievement (5, 10, 20, 50, 100, 200 bandiere)

### 💾 Salvataggio Locale
- **localStorage**: Tutti i progressi salvati localmente
- **Persistenza**: I dati rimangono tra le sessioni
- **Avviso cookie**: Notifica all'utente sulla perdita dati se cancella i cookie

### 🎨 Design
- **Tema scuro**: Interfaccia moderna con colori tech
- **Responsive**: Funziona su desktop e mobile
- **Animazioni**: Effetti fluidi e feedback visivo
- **Stile tech**: Radar, griglia, effetti di scansione

## Struttura del Progetto

```
flag_game/
├── api/                    # API PHP
│   ├── random_flag.php     # Endpoint per bandiera casuale
│   └── check_answer.php    # Endpoint per verifica risposta
├── assets/                 # Risorse frontend
│   ├── css/
│   │   └── style.css       # Stili principali
│   └── js/
│       ├── game.js         # Logica principale del gioco
│       ├── map-animation.js # Animazioni mappa tech
│       └── storage.js      # Gestione localStorage
├── config/
│   └── database.php        # Configurazione database SQLite
├── data/
│   └── flag_game.db        # Database SQLite
├── models/                 # Modelli PHP
│   ├── Country.php         # Modello paesi
│   ├── Flag.php           # Modello bandiere
│   └── Tip.php            # Modello suggerimenti
├── public/                 # Directory web root
│   └── index.html         # Pagina principale
└── setup_database.php     # Script inizializzazione DB
```

## Installazione e Setup

### Requisiti
- PHP 8.1+ con estensioni:
  - php-sqlite3
  - php-json
  - php-mbstring
- Server web (Apache/Nginx) o PHP built-in server

### Installazione

1. **Clona o scarica il progetto**
   ```bash
   git clone [repository] flag_game
   cd flag_game
   ```

2. **Installa le dipendenze PHP** (Ubuntu/Debian)
   ```bash
   sudo apt update
   sudo apt install php php-cli php-sqlite3 php-json php-mbstring
   ```

3. **Inizializza il database**
   ```bash
   php setup_database.php
   ```

4. **Avvia il server**
   ```bash
   php -S localhost:8080 -t public
   ```

5. **Apri il browser**
   Vai su `http://localhost:8080`

## API Endpoints

### GET /api/random_flag.php
Restituisce una bandiera casuale con opzioni di risposta.

**Risposta:**
```json
{
  "flag_id": 123,
  "image_url": "https://flagsapi.com/IT/flat/64.png",
  "options": [
    {"name": "Italia", "is_correct": true},
    {"name": "Francia", "is_correct": false},
    {"name": "Germania", "is_correct": false},
    {"name": "Spagna", "is_correct": false}
  ],
  "tip": "Il tricolore italiano è ispirato alla bandiera francese."
}
```

### POST /api/check_answer.php
Verifica la risposta dell'utente e restituisce dati geografici.

**Richiesta:**
```json
{
  "flag_id": 123,
  "selected_country_name": "Italia"
}
```

**Risposta:**
```json
{
  "is_correct": true,
  "correct_country_name": "Italia",
  "country_data": {
    "name": "Italia",
    "capital": "Roma",
    "latitude": 41.87194,
    "longitude": 12.56738,
    "geojson": null
  }
}
```

## Database Schema

### Tabella `countries`
- `id` (INTEGER PRIMARY KEY)
- `name` (VARCHAR) - Nome del paese
- `capital` (VARCHAR) - Capitale
- `iso2_code` (VARCHAR) - Codice ISO a 2 lettere
- `iso3_code` (VARCHAR) - Codice ISO a 3 lettere
- `latitude` (DECIMAL) - Latitudine
- `longitude` (DECIMAL) - Longitudine
- `geojson_data` (JSON) - Dati geografici (opzionale)

### Tabella `flags`
- `id` (INTEGER PRIMARY KEY)
- `country_id` (INTEGER) - FK verso countries
- `image_url` (VARCHAR) - URL dell'immagine bandiera

### Tabella `tips`
- `id` (INTEGER PRIMARY KEY)
- `country_id` (INTEGER) - FK verso countries
- `tip_text` (TEXT) - Suggerimento per memorizzare la bandiera

## Tecnologie Utilizzate

### Backend
- **PHP 8.1+**: Linguaggio server-side
- **SQLite**: Database leggero e portatile
- **PDO**: Astrazione database per sicurezza

### Frontend
- **HTML5**: Struttura semantica
- **CSS3**: Stili moderni con variabili CSS e animazioni
- **JavaScript ES6+**: Logica client-side moderna
- **Fetch API**: Comunicazione asincrona con il backend

### Servizi Esterni
- **FlagsAPI**: Immagini delle bandiere (https://flagsapi.com/)
- **Font Awesome**: Icone
- **Google Fonts**: Tipografia (Inter)

## Funzionalità Implementate

✅ **Core Gameplay**
- Quiz bandiere con 4 opzioni
- Feedback visivo immediato
- Sistema di punteggi e moltiplicatori
- Medaglie e achievement

✅ **Interfaccia Utente**
- Design responsive
- Tema scuro moderno
- Animazioni fluide
- Feedback audio (medaglie)

✅ **Backend API**
- Endpoint per bandiere casuali
- Verifica risposte
- Database con 10 paesi di esempio

✅ **Persistenza Dati**
- Salvataggio localStorage
- Gestione errori storage
- Avvisi utente

✅ **Animazioni Tech**
- Radar con scansione
- Griglia tech animata
- Effetti di zoom e pulse
- Stile spionaggio/militare

## Possibili Estensioni Future

- 🌍 **Più paesi**: Espandere il database con tutti i paesi del mondo
- 🗺️ **Mappa interattiva**: Integrazione con Leaflet o Google Maps
- 🎵 **Audio**: Suoni per feedback e atmosfera
- 👥 **Multiplayer**: Sfide tra giocatori
- 📊 **Statistiche avanzate**: Grafici e analisi prestazioni
- 🌐 **Localizzazione**: Supporto multilingua
- 🏅 **Classifiche**: Leaderboard globali
- 🎯 **Modalità gioco**: Tempo limitato, difficoltà variabile

## Licenza

### © 2025 Matteo Morreale - Tutti i diritti riservati

Questo progetto è rilasciato sotto licenza proprietaria con le seguenti condizioni:

#### ✅ **Permessi**

- ✅ **Uso Personale**: È consentito l'uso del software per scopi personali e didattici
- ✅ **Modifica**: È possibile modificare il codice per uso personale
- ✅ **Studio**: È consentito studiare il codice per scopi educativi
- ✅ **Fork**: È possibile creare fork del progetto su GitHub per contribuire

#### ❌ **Restrizioni**

- ❌ **Uso Commerciale**: È vietato qualsiasi uso commerciale del software
- ❌ **Redistribuzione**: È vietata la redistribuzione del software senza autorizzazione
- ❌ **Vendita**: È vietata la vendita del software o di sue parti
- ❌ **Rimozione Copyright**: È vietata la rimozione delle informazioni di copyright

#### 📋 **Obblighi**

- 📋 **Attribuzione**: L'autore originale (Matteo Morreale) deve essere sempre citato
- 📋 **Copyright**: Tutte le opere derivate devono mantenere questa licenza
- 📋 **Disclaimer**: Il software è fornito "così com'è" senza garanzie

### Nota Legale

```text
Indovina la Bandiera! - Interactive Flag Guessing Game
Copyright (C) 2025 Matteo Morreale

Questo software e il relativo codice sorgente sono di proprietà esclusiva di
Matteo Morreale. È vietato l'uso commerciale, la redistribuzione non autorizzata
o la rimozione di questo avviso di copyright.

Per richieste di licenze commerciali o permessi speciali, contattare l'autore.

IL SOFTWARE È FORNITO "COSÌ COM'È", SENZA GARANZIE DI ALCUN TIPO, ESPLICITE O
IMPLICITE, INCLUSE MA NON LIMITATE ALLE GARANZIE DI COMMERCIABILITÀ, IDONEITÀ
PER UN PARTICOLARE SCOPO E NON VIOLAZIONE.
```

### Richieste di Licenza

Per richieste di **licenze commerciali** o **permessi speciali** per l'uso del software,
contattare l'autore del progetto.

## Supporto

Per problemi tecnici, bug report o domande sul progetto, contattare:

**Matteo Morreale** - Autore e Proprietario del Progetto

---

### Disclaimer

Questo software utilizza il servizio **FlagsAPI** (<https://flagsapi.com/>) per le immagini
delle bandiere. Le immagini delle bandiere potrebbero essere soggette a diritti d'autore
separati. L'uso delle bandiere è limitato al contesto educativo e non commerciale di questo gioco.

