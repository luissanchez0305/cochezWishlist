<?php

if(isset($_GET['n']) && isset($_GET['b'])) {
	$username = 'espheras_dbuser';
	$password = 'Goingupinlife123';
	$database = 'cochezwl';

	$link = mysql_connect('localhost',$username,$password) or die('Cannot connect to the DB');
	mysql_select_db($database) or die(mysql_errno());
	header('Content-type: application/json');
	header("access-control-allow-origin: *");

	$name = $_GET['n'];
	$bcode = $_GET['b'];
	$query = "INSERT INTO barcodes (barcode, name) VALUES ('$bcode', '$name')";
	mysql_query($query,$link) or die('Errant query:  '.$query);
	echo json_encode(mysql_insert_id());

	/* disconnect from the db */
	@mysql_close($link);
}