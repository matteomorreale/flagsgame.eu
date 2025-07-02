<?php
/**
 * Random Flag API Endpoint
 * Author: Matteo Morreale
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Previeni il cache del browser
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

require_once __DIR__ . '/../models/Country.php';
require_once __DIR__ . '/../models/Flag.php';
require_once __DIR__ . '/../models/Tip.php';

try {
    $country = new Country();
    $flag = new Flag();
    $tip = new Tip();
    
    // Ottieni un paese casuale
    $correct_country = $country->getRandomCountry();
    
    // Debug: verifica il paese ottenuto
    if (!$correct_country) {
        throw new Exception('Nessun paese trovato nel database');
    }
    
    // Debug aggiuntivo
    error_log('Paese selezionato: ' . print_r($correct_country, true));
    
    // Ottieni la bandiera del paese
    $flag_data = $flag->getByCountryId($correct_country['id']);
    
    // Se non c'è una bandiera nel database, usa l'API esterna
    $flag_url = $flag_data ? $flag_data['image_url'] : 
                "https://flagsapi.com/{$correct_country['iso2_code']}/flat/64.png";
    
    // Ottieni 3 paesi casuali diversi per le opzioni sbagliate
    $wrong_countries = $country->getRandomCountries(3, $correct_country['id']);
    
    // Crea l'array delle opzioni
    $options = [];
    $options[] = [
        'name' => $correct_country['name'],
        'is_correct' => true
    ];
    
    foreach ($wrong_countries as $wrong_country) {
        $options[] = [
            'name' => $wrong_country['name'],
            'is_correct' => false
        ];
    }
    
    // Mescola le opzioni
    shuffle($options);
    
    // Ottieni un suggerimento per il paese
    $tip_data = $tip->getByCountryId($correct_country['id']);
    $tip_text = $tip_data ? $tip_data['tip_text'] : 
                "Questo paese si trova in " . ($correct_country['capital'] ? "capitale " . $correct_country['capital'] : "una posizione interessante");
    
    $response = [
        'flag_id' => $flag_data ? $flag_data['id'] : $correct_country['id'], // Usa flag ID se disponibile, altrimenti country ID
        'image_url' => $flag_url,
        'options' => $options,
        'tip' => $tip_text
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

