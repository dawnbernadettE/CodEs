<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['queryInput']) || !isset($data['pin'])) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit();
}

$queryInput = $conn->real_escape_string(strtolower(trim($data['queryInput'])));
$pin = $conn->real_escape_string(trim($data['pin']));

$sql = "SELECT * FROM patients WHERE (LOWER(student_num) = '$queryInput' OR LOWER(name) = '$queryInput') AND pin = '$pin'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $patient = $result->fetch_assoc();
    echo json_encode(["status" => "success", "patient" => $patient]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Student ID/Name or PIN"]);
}

$conn->close();
?>