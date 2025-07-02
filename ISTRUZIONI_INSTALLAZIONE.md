# 🚀 Istruzioni di Installazione - Indovina la Bandiera!

**Autore:** Matteo Morreale

## Installazione Rapida

### 1. Estrai l'archivio
```bash
tar -xzf flag_game_complete.tar.gz
cd flag_game
```

### 2. Installa PHP e le estensioni necessarie

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install php php-cli php-sqlite3 php-json php-mbstring
```

**CentOS/RHEL:**
```bash
sudo yum install php php-cli php-pdo php-json php-mbstring
```

**Windows (XAMPP):**
- Scarica e installa XAMPP
- Assicurati che le estensioni sqlite3 e pdo_sqlite siano abilitate

### 3. Inizializza il database
```bash
php setup_database.php
```

Dovresti vedere:
```
Creazione delle tabelle...
Tabella 'countries' creata.
Tabella 'flags' creata.
Tabella 'tips' creata.
Popolamento con dati di esempio...
Database configurato con successo!
Paesi inseriti: 10
```

### 4. Avvia il server
```bash
php -S localhost:8080 -t public
```

### 5. Apri il browser
Vai su: `http://localhost:8080`

## Verifica Installazione

### Test API
Verifica che le API funzionino:
```bash
curl http://localhost:8080/api/random_flag.php
```

Dovresti ricevere una risposta JSON con una bandiera casuale.

### Test Gioco
1. Apri `http://localhost:8080` nel browser
2. Dovresti vedere l'interfaccia del gioco
3. Il gioco dovrebbe caricare automaticamente una bandiera
4. Prova a rispondere per testare il sistema di punteggi

## Risoluzione Problemi

### Errore "could not find driver"
```bash
# Installa l'estensione SQLite per PHP
sudo apt install php-sqlite3
```

### Errore "Permission denied" sul database
```bash
# Assicurati che la directory data sia scrivibile
chmod 755 data/
chmod 666 data/flag_game.db
```

### Il gioco non carica le bandiere
1. Verifica che il server PHP sia in esecuzione
2. Controlla che l'API risponda: `curl http://localhost:8080/api/random_flag.php`
3. Apri la console del browser (F12) per vedere eventuali errori JavaScript

### Bandiere non visualizzate
- Le immagini delle bandiere vengono caricate da `https://flagsapi.com/`
- Assicurati di avere una connessione internet attiva

## Configurazione Avanzata

### Aggiungere Nuovi Paesi
Modifica il file `setup_database.php` e aggiungi nuovi paesi nell'array `$sample_countries`:

```php
['Nome Paese', 'Capitale', 'ISO2', 'ISO3', lat, lng, 'Suggerimento'],
```

Poi riesegui:
```bash
php setup_database.php
```

### Personalizzare l'Aspetto
Modifica il file `assets/css/style.css` per cambiare:
- Colori del tema
- Font e dimensioni
- Animazioni
- Layout responsive

### Configurare per Produzione

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1.php [L]
```

**Nginx:**
```nginx
location /api/ {
    try_files $uri $uri.php =404;
    fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}
```

## Struttura File Importante

```
flag_game/
├── public/index.html          # Pagina principale (ENTRY POINT)
├── api/                       # API PHP (accessibili via web)
├── assets/                    # CSS, JS, immagini
├── data/flag_game.db         # Database SQLite (auto-creato)
└── setup_database.php        # Script inizializzazione
```

## Backup e Manutenzione

### Backup Progressi Utenti
I progressi sono salvati nel localStorage del browser. Per backup:
1. Apri la console del browser (F12)
2. Vai su Application > Local Storage
3. Esporta i dati di `flag_game_stats`

### Backup Database
```bash
cp data/flag_game.db data/flag_game_backup_$(date +%Y%m%d).db
```

### Aggiornamenti
Per aggiornare il gioco:
1. Fai backup del database
2. Sostituisci i file del progetto
3. Riesegui `php setup_database.php` se necessario

## Supporto

Per problemi tecnici:
1. Controlla i log del server PHP
2. Verifica la console del browser per errori JavaScript
3. Testa le API direttamente con curl
4. Controlla i permessi dei file

**Autore:** Matteo Morreale
**Versione:** 1.0
**Data:** 2025

