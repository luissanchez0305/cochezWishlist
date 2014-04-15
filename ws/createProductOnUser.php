<?php

if(isset($_GET['u']) && isset($_GET['b'])) {
	$username = 'espheras_dbuser';
	$password = 'Goingupinlife123';
	$database = 'cochezwl';
	
	$link = mysql_connect('localhost',$username,$password) or die('Cannot connect to the DB');
	mysql_select_db($database) or die(mysql_errno());
	header('Content-type: application/json');
	header("access-control-allow-origin: *");

	$bcode = $_GET['b'];
	$query = "SELECT id FROM barcodes WHERE barcode = '$bcode'";
	$result = mysql_query($query,$link) or die('Errant query:  '.$query);
	if ($bcid = mysql_fetch_assoc ($result)){
		$uname = $_GET['u'];
		$query = "INSERT INTO lists (barcodeid, userid) VALUES ($bcid, (SELECT id FROM users WHERE username = '$uname'))";
		mysql_query($query,$link) or die('Errant query:  '.$query);
		echo json_encode(array('posts'=>$posts));
	}
	else 
		echo '0';

	/* disconnect from the db */
	@mysql_close($link);
}