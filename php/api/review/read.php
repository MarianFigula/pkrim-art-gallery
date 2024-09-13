<?php

header("Content-Type: application/json");

include_once '../../config/Database.php';
include_once '../../classes/Review.php';
include_once "../../config/cors.php";

$database = new Database();
$db = $database->getConnection();

$review = new Review($db);

$method = $_SERVER['REQUEST_METHOD'];

$data = json_decode(file_get_contents("php://input"));

// TODO: mozno sa to bude posielat cez URL (GET)
if ($method == "GET"){
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."]);
    exit();
}


if (isset($data->user_id)){
    $review->setUserId($data->user_id);
    $stmt = $review->getReviewsByUserId();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $reviews]);
    exit();
}

if (isset($data->art_id)){
    $review->setArtId($data->art_id);
    $stmt = $review->getReviewsByArtId();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $reviews]);
    exit();
}


if (isset($data->id)){
    $review->setId($data->id);
    $stmt = $review->getReviewById();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Art not found."]);
        exit();
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "data" => $row]);
    exit();
}
