<?php
/**
 * Database Configuration
 * Author: Matteo Morreale
 */

class DatabaseConfig {
    private $db_path = __DIR__ . '/../data/flag_game.db';
    
    public function getConnection() {
        // Crea la directory data se non esiste
        $dataDir = dirname($this->db_path);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        try {
            $pdo = new PDO("sqlite:" . $this->db_path);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        } catch(PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }
}
?>

