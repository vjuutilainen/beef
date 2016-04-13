<?php
header("Access-Control-Allow-Origin: *");
try {
  $db_host = 'localhost';
  $db_name = 'beef';
  $db_user = 'beef';
  $user_pw = 'ELzefUEpvwldgwvG'; 
  $con = new PDO('mysql:host=' . $db_host . '; dbname=' . $db_name, $db_user, $user_pw);
  $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $con->exec('SET CHARACTER SET utf8');
  $stmt = $con->prepare("INSERT INTO articles_data (`article_id`, `sentence_id`, `sentence_class`, `sentence`) VALUES (:article_id, :sentence_id, :sentence_class, :sentence)");
  $stmt->bindParam(':article_id', $article_id);
  $stmt->bindParam(':sentence_id', $sentence_id);
  $stmt->bindParam(':sentence_class', $sentence_class);
  $stmt->bindParam(':sentence', $sentence);
  $article_id = $_POST['article_id'];
  $sentence_id = $_POST['sentence_id'];
  $sentence_class = $_POST['sentence_class'];
  $sentence = $_POST['sentence'];
  $stmt->execute();
}
catch (PDOException $err) {
  // echo "harmless error message if the connection fails";
  // echo $err->getMessage() . "<br/>";
  die();  //  terminate connection
}
?>