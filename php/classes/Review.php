<?php

class Review {
    private $conn;
    private $table_name = "review";
    private $id;
    private $user_id;
    private $art_id;
    private $review_text;
    private $rating;
    private $review_creation_date;
    public function getTableName() {return $this->table_name;}
    public function setTableName($table_name) {
        $this->table_name = $table_name;
    }
    public function getId() {return $this->id;}
    public function setId($id) {$this->id = $id;}
    public function getUserId() {return $this->user_id;}
    public function setUserId($user_id) {$this->user_id = $user_id;}
    public function getArtId() {return $this->art_id;}
    public function setArtId($art_id) {$this->art_id = $art_id;}
    public function getRating(){return $this->rating;}
    public function setRating($rating): void{$this->rating = $rating;}
    public function getReviewText() {return $this->review_text;}
    public function setReviewText($review_text){
        $this->review_text = $review_text;
    }
    public function getReviewCreationDate(){
        return $this->review_creation_date;
    }
    public function setReviewCreationDate($review_creation_date) {
        $this->review_creation_date = $review_creation_date;
    }
    public function __construct($db) { $this->conn = $db;}

    public function createReview() {
        $this->review_creation_date = date('Y-m-d H:i:s');

        $query = "INSERT INTO " . $this->table_name . " (user_id, 
        art_id, review_text, rating, review_creation_date)
                  VALUES (:user_id,:art_id,
                   :review_text, :rating, :review_creation_date)";

        $stmt = $this->conn->prepare($query);

        // Bind values directly, no need for excessive sanitization since we are using prepared statements
        $stmt->bindValue(":user_id", $this->user_id, PDO::PARAM_INT);
        $stmt->bindValue(":art_id", $this->art_id, PDO::PARAM_INT);
        $stmt->bindValue(":review_text", $this->review_text, PDO::PARAM_STR);
        $stmt->bindValue(":rating", $this->rating, PDO::PARAM_INT);
        $stmt->bindValue(":review_creation_date", $this->review_creation_date);

        return $stmt->execute();

    }

    public function getReviews() {
        $query = "SELECT id, user_id, review_text, review_creation_date
                FROM " . $this->table_name;

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);

        $stmt->execute();
        return $stmt;
    }

    public function getReviewById(){
        $query = "SELECT id, user_id, art_id, 
       review_text, rating, review_creation_date
                FROM " . $this->table_name .  " WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);

        $stmt->execute();
        return $stmt;
    }

    public function getReviewsByUserId() {
        $query = "SELECT id, user_id, art_id,
       review_text, rating, review_creation_date
                FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->user_id);

        $stmt->execute();
        return $stmt;
    }

    public function getReviewsByArtId() {
        $query = "SELECT id, user_id, art_id,
       review_text, rating, review_creation_date
                FROM " . $this->table_name . " WHERE art_id = :art_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":art_id", $this->art_id);

        $stmt->execute();
        return $stmt;
    }

    public function updateReviewById() {
        $query = "UPDATE " . $this->table_name . "
                  SET review_text = :review_text,
                  rating = :rating,
                  review_creation_date = CURRENT_TIMESTAMP()
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':review_text', $this->getReviewText());
        $stmt->bindParam(':rating', $this->getRating());
        $stmt->bindParam(':id', $this->getId());

        $stmt->execute();
        return $stmt;
    }

    public function updateReviewByUserId() {
        $query = "UPDATE " . $this->table_name . "
                  SET review_text = :review_text,
                  rating = :rating,
                  review_creation_date = CURRENT_TIMESTAMP()
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':review_text', $this->getReviewText());
        $stmt->bindParam(':rating', $this->getRating());
        $stmt->bindParam(':user_id', $this->getUserId());

        $stmt->execute();
        return $stmt;
    }

    public function updateReviewByArtId() {
        $query = "UPDATE " . $this->table_name . "
                  SET review_text = :review_text,
                  rating = :rating,
                  review_creation_date = CURRENT_TIMESTAMP()
                  WHERE art_id = :art_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':review_text', $this->getReviewText());
        $stmt->bindParam(':rating', $this->getRating());
        $stmt->bindParam(':art_id', $this->getArtId());

        $stmt->execute();
        return $stmt;
    }
    public function deleteReviewById() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }
}