<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

if (!file_exists('db.php')) {
    echo json_encode(["status" => "error", "message" => "Database file (db.php) not found."]);
    exit();
}

require_once 'db.php';

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!isset($data['queryInput']) || !isset($data['currentPin']) || !isset($data['newPin'])) {
    echo json_encode(["status" => "error", "message" => "Incomplete parameters provided"]);
    exit();
}

// Siguraduhing clinic_db ang ginagamit na database kung sakaling iba ang nade-default
$conn->select_db("clinic_db");

$queryInput = $conn->real_escape_string(strtolower(trim($data['queryInput'])));
$currentPin = $conn->real_escape_string(trim($data['currentPin']));
$newPin = $conn->real_escape_string(trim($data['newPin']));

if (strlen($newPin) !== 4) {
    echo json_encode(["status" => "error", "message" => "New PIN must be exactly 4 digits"]);
    exit();
}

// Subukang hanapin sa patients table
$sqlCheck = "SELECT * FROM patients WHERE (LOWER(student_num) = '$queryInput' OR LOWER(name) = '$queryInput') AND pin = '$currentPin'";
$result = $conn->query($sqlCheck);

if ($result === false) {
    echo json_encode(["status" => "error", "message" => "Database Error: " . $conn->error]);
    exit();
}

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $studentNum = $row['student_num'];
    
    $sqlUpdate = "UPDATE patients SET pin = '$newPin' WHERE student_num = '$studentNum'";

    if ($conn->query($sqlUpdate) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Student PIN updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Update Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Student Name/Number or Current PIN"]);
}

$conn->close();
?>