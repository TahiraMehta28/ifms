<?php
require 'backend/config/database.php';
$db = getMongoDBConnection();
$proj = $db->projects->findOne([], ['projection' => ['sanctionedLetterFile' => 1]]);
if ($proj) {
    echo 'Length of sanctionedLetterFile: ' . strlen((string)($proj['sanctionedLetterFile'] ?? '')) . PHP_EOL;
} else {
    echo 'No projects found' . PHP_EOL;
}
