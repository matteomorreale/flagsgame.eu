<?php
/**
 * Index redirect per il gioco delle bandiere
 * Author: Matteo Morreale
 */

// Serve il file index.html dalla cartella public
$indexFile = __DIR__ . '/public/index.html';

if (file_exists($indexFile)) {
    // Imposta il content type corretto
    header('Content-Type: text/html; charset=UTF-8');
    
    // Leggi e mostra il contenuto dell'index.html
    readfile($indexFile);
} else {
    // Se il file non esiste, mostra un errore
    http_response_code(404);
    echo "Errore: File index.html non trovato.";
}
?>
