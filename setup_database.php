<?php
/**
 * Database Setup Script
 * Author: Matteo Morreale
 */

require_once 'config/database.php';

// Verifica che il driver SQLite sia disponibile
if (!extension_loaded('pdo_sqlite')) {
    die("Errore: L'estensione PDO SQLite non è installata. Installa php-sqlite3 o php-pdo-sqlite.\n");
}

try {
    $database = new DatabaseConfig();
    $pdo = $database->getConnection();
    
    echo "Creazione delle tabelle...\n";
    
    // Crea la tabella countries
    $sql = "CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        capital TEXT,
        iso2_code TEXT NOT NULL UNIQUE,
        iso3_code TEXT NOT NULL UNIQUE,
        latitude REAL,
        longitude REAL,
        geojson_data TEXT
    )";
    $pdo->exec($sql);
    echo "Tabella 'countries' creata.\n";
    
    // Crea la tabella flags
    $sql = "CREATE TABLE IF NOT EXISTS flags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries(id)
    )";
    $pdo->exec($sql);
    echo "Tabella 'flags' creata.\n";
    
    // Crea la tabella tips
    $sql = "CREATE TABLE IF NOT EXISTS tips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_id INTEGER NOT NULL,
        tip_text TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries(id)
    )";
    $pdo->exec($sql);
    echo "Tabella 'tips' creata.\n";
    
    // Popola con alcuni dati di esempio
    echo "Popolamento con dati di esempio...\n";
    
    $sample_countries = [
        ['Italia', 'Roma', 'IT', 'ITA', 41.87194, 12.56738, 'Il tricolore italiano è ispirato alla bandiera francese.'],
        ['Francia', 'Parigi', 'FR', 'FRA', 46.603354, 1.888334, 'Il tricolore francese rappresenta libertà, uguaglianza e fraternità.'],
        ['Germania', 'Berlino', 'DE', 'DEU', 51.165691, 10.451526, 'I colori nero, rosso e oro hanno origini storiche medievali.'],
        ['Spagna', 'Madrid', 'ES', 'ESP', 40.463667, -3.74922, 'Lo stemma al centro rappresenta i regni storici spagnoli.'],
        ['Regno Unito', 'Londra', 'GB', 'GBR', 55.378051, -3.435973, 'La Union Jack combina le croci di Inghilterra, Scozia e Irlanda.'],
        ['Giappone', 'Tokyo', 'JP', 'JPN', 36.204824, 138.252924, 'Il cerchio rosso rappresenta il sole nascente.'],
        ['Stati Uniti', 'Washington D.C.', 'US', 'USA', 37.09024, -95.712891, 'Le 50 stelle rappresentano i 50 stati federali.'],
        ['Brasile', 'Brasília', 'BR', 'BRA', -14.235004, -51.92528, 'Il rombo giallo rappresenta le ricchezze minerarie del paese.'],
        ['Canada', 'Ottawa', 'CA', 'CAN', 56.130366, -106.346771, 'La foglia d\'acero è il simbolo nazionale del Canada.'],
        ['Australia', 'Canberra', 'AU', 'AUS', -25.274398, 133.775136, 'La Union Jack ricorda i legami storici con il Regno Unito.']
    ];
    
    foreach ($sample_countries as $country_data) {
        // Controlla se il paese esiste già
        $stmt = $pdo->prepare("SELECT id FROM countries WHERE iso2_code = ?");
        $stmt->execute([$country_data[2]]);
        $existing_country = $stmt->fetch();
        
        if (!$existing_country) {
            // Inserisci il paese solo se non esiste
            $stmt = $pdo->prepare("INSERT INTO countries (name, capital, iso2_code, iso3_code, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$country_data[0], $country_data[1], $country_data[2], $country_data[3], $country_data[4], $country_data[5]]);
            $country_id = $pdo->lastInsertId();
        } else {
            $country_id = $existing_country['id'];
        }
        
        // Inserisci il suggerimento
        if ($country_id) {
            $stmt = $pdo->prepare("SELECT id FROM tips WHERE country_id = ?");
            $stmt->execute([$country_id]);
            if (!$stmt->fetch()) {
                $stmt = $pdo->prepare("INSERT INTO tips (country_id, tip_text) VALUES (?, ?)");
                $stmt->execute([$country_id, $country_data[6]]);
            }
            
            // Inserisci anche la bandiera (usando un URL placeholder per ora)
            $flag_url = "https://flagcdn.com/w320/" . strtolower($country_data[2]) . ".png";
            $stmt = $pdo->prepare("SELECT id FROM flags WHERE country_id = ?");
            $stmt->execute([$country_id]);
            if (!$stmt->fetch()) {
                $stmt = $pdo->prepare("INSERT INTO flags (country_id, image_url) VALUES (?, ?)");
                $stmt->execute([$country_id, $flag_url]);
            }
        }
    }
    
    echo "Database configurato con successo!\n";
    echo "Paesi inseriti: " . count($sample_countries) . "\n";
    
} catch (Exception $e) {
    echo "Errore durante la configurazione del database: " . $e->getMessage() . "\n";
}
?>

