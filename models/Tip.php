<?php
/**
 * Tip Model
 * Author: Matteo Morreale
 */

require_once __DIR__ . '/../config/database.php';

class Tip {
    private $conn;
    private $table_name = "tips";
    
    public $id;
    public $country_id;
    public $tip_text;
    
    public function __construct() {
        $database = new DatabaseConfig();
        $this->conn = $database->getConnection();
    }
    
    public function getByCountryId($country_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE country_id = :country_id ORDER BY RANDOM() LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':country_id', $country_id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (country_id, tip_text) VALUES (:country_id, :tip_text)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':country_id', $this->country_id);
        $stmt->bindParam(':tip_text', $this->tip_text);
        
        return $stmt->execute();
    }
}
?>

