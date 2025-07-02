<?php
/**
 * Country Model
 * Author: Matteo Morreale
 */

require_once __DIR__ . '/../config/database.php';

class Country {
    private $conn;
    private $table_name = "countries";
    
    public $id;
    public $name;
    public $capital;
    public $iso2_code;
    public $iso3_code;
    public $latitude;
    public $longitude;
    public $geojson_data;
    
    public function __construct() {
        $database = new DatabaseConfig();
        $this->conn = $database->getConnection();
    }
    
    public function getRandomCountry() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY RANDOM() LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function getRandomCountries($limit = 4, $exclude_id = null) {
        $query = "SELECT id, name FROM " . $this->table_name;
        if ($exclude_id) {
            $query .= " WHERE id != :exclude_id";
        }
        $query .= " ORDER BY RANDOM() LIMIT :limit";
        
        $stmt = $this->conn->prepare($query);
        if ($exclude_id) {
            $stmt->bindParam(':exclude_id', $exclude_id, PDO::PARAM_INT);
        }
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
    
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function getByName($name) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE name = :name LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function getByFlagId($flag_id) {
        // Prima prova a cercare tramite la tabella flags
        $query = "SELECT c.* FROM " . $this->table_name . " c 
                  INNER JOIN flags f ON c.id = f.country_id 
                  WHERE f.id = :flag_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':flag_id', $flag_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetch();
        
        // Se non trova nulla, prova con l'ID diretto del paese (fallback)
        if (!$result) {
            $result = $this->getById($flag_id);
        }
        
        return $result;
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (name, capital, iso2_code, iso3_code, latitude, longitude, geojson_data) 
                  VALUES (:name, :capital, :iso2_code, :iso3_code, :latitude, :longitude, :geojson_data)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':capital', $this->capital);
        $stmt->bindParam(':iso2_code', $this->iso2_code);
        $stmt->bindParam(':iso3_code', $this->iso3_code);
        $stmt->bindParam(':latitude', $this->latitude);
        $stmt->bindParam(':longitude', $this->longitude);
        $stmt->bindParam(':geojson_data', $this->geojson_data);
        
        return $stmt->execute();
    }
}
?>

