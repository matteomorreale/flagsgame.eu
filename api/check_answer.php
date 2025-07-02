<?php
/**
 * Indovina la Bandiera! - Check Answer API Endpoint
 * Copyright (C) 2025 Matteo Morreale
 * 
 * Questo software è di proprietà esclusiva di Matteo Morreale.
 * È vietato l'uso commerciale e la redistribuzione non autorizzata.
 * 
 * Autore: Matteo Morreale
 * Tutti i diritti riservati.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../models/Country.php';

try {
    // Leggi i dati JSON dalla richiesta POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['flag_id']) || !isset($input['selected_country_name'])) {
        throw new Exception('Parametri mancanti: flag_id e selected_country_name sono richiesti');
    }
    
    $flag_id = $input['flag_id'];
    $selected_country_name = $input['selected_country_name'];
    
    $country = new Country();
    
    // Ottieni i dati del paese corretto tramite flag_id
    $correct_country = $country->getByFlagId($flag_id);
    
    if (!$correct_country) {
        throw new Exception('Paese non trovato');
    }
    
    // Verifica se la risposta è corretta
    $is_correct = ($selected_country_name === $correct_country['name']);
    
    $response = [
        'is_correct' => $is_correct,
        'correct_country_name' => $correct_country['name'],
        'country_data' => [
            'name' => $correct_country['name'],
            'capital' => $correct_country['capital'],
            'latitude' => (float)$correct_country['latitude'],
            'longitude' => (float)$correct_country['longitude'],
            'geojson' => $correct_country['geojson_data'] ? json_decode($correct_country['geojson_data']) : null
        ]
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

