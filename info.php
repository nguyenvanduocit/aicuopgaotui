<?php
  include_once 'lib/DB.class.php';
  $db = new DB();
  var_dump($db->isExistUser(12));
?>