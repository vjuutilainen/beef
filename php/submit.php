<?php
header("Access-Control-Allow-Origin: *");
try {
  $db_host = 'localhost';
  $db_name = 'beef';
  $db_user = 'beef';
  $user_pw = ''; 
  $con = new PDO('mysql:host=' . $db_host . '; dbname=' . $db_name, $db_user, $user_pw);
  $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $con->exec('SET CHARACTER SET utf8');
  $stmt = $con->prepare("INSERT INTO articles_data () VALUES (:, :, :)");
  $stmt->bindParam(':', $);
  $stmt->bindParam(':', $);
  $stmt->bindParam(':', $);
  $birdhouses = $_POST[''];
  $municipality = $_POST[''];
  $description = $_POST[''];
    $stmt->execute();
  }
}
catch (PDOException $err) {
  echo "harmless error message if the connection fails";
  $err->getMessage() . "<br/>";
  die();  //  terminate connection
}
?>