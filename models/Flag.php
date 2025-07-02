<?php
/**
 * Flag Model
 * Author: Matteo Morreale
 */

require_once __DIR__ . '/../config/database.php';

class Flag {
    private $conn;
    private $table_name = "flags";
    
    public $id;
    public $country_id;
    public $image_url;
    
    public function __construct() {
        $database = new DatabaseConfig();
        $this->conn = $database->getConnection();
    }
    
    public function getByCountryId($country_id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE country_id = :country_id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':country_id', $country_id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (country_id, image_url) VALUES (:country_id, :image_url)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':country_id', $this->country_id);
        $stmt->bindParam(':image_url', $this->image_url);
        
        return $stmt->execute();
    }
}
?>

