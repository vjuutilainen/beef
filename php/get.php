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
  $rows = array();
  $stmt = $con->prepare("SELECT count(*) as count, sentence_id FROM articles_data WHERE article_id = :article_id GROUP BY sentence_id ORDER BY sentence_id ASC");

  $article_id = $_GET['article_id'];
  $stmt->bindParam(':article_id', $article_id);
  $stmt->execute();
  if ($stmt->rowCount() > 0) {
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $value => $row) {
      $rows[] = $row;
    }
  }
  echo json_encode($rows);
}
catch (PDOException $err) {  
  // echo "harmless error message if the connection fails";
  // $err->getMessage() . "<br/>";
  die();  //  terminate connection
}
?>