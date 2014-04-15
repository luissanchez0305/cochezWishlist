<?php

if(isset($_GET['u']) && isset($_GET['b'])) {
	$username = 'espheras_dbuser';
	$password = 'Goingupinlife123';
	$database = 'cochezwl';
	
	$link = mysql_connect('localhost',$username,$password) or die('Cannot connect to the DB');
	mysql_select_db($database) or die(mysql_errno());
	header('Content-type: application/json');
	header("access-control-allow-origin: *");

	$query = "SELECT id FROM barcodes WHERE barcode = '$bcode'";
	$result = mysql_query($query,$link) or die('Errant query:  '.$query);

	/* create one master array of the records */
	$posts = array();
	if(mysql_num_rows($result)) {
		while($post = mysql_fetch_assoc($result)) {
			$posts[] = array('post'=>$post);
		}
	}
	
	if (count($posts) > 0) {
		$uname = $_GEt['u'];
		$bcode = $_GET['b'];
		$query = "INSERT INTO lists (barcodeid, userid) VALUES ($posts[0].id, (SELECT id FROM users WHERE username = '$uname'))";
		mysql_query($query,$link) or die('Errant query:  '.$query);
		echo json_encode(array('posts'=>$posts));
	}
	else 
		echo '0';

	/* disconnect from the db */
	@mysql_close($link);
}