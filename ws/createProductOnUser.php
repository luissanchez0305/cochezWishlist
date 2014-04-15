<?php

if(isset($_GET['u']) && isset($_GET['b'])) {
	$username = 'espheras_dbuser';
	$password = 'Goingupinlife123';
	$database = 'cochezwl';
	
	$link = mysql_connect('localhost',$username,$password) or die('Cannot connect to the DB');
	mysql_select_db($database) or die(mysql_errno());
	header('Content-type: application/json');
	header("access-control-allow-origin: *");

	$uname = $_GET['u'];
	$bcode = $_GET['b'];
	$query = "SELECT id FROM lists WHERE barcodeid = (SELECT id FROM barcodes WHERE barcode = '$bcode') AND userid = (SELECT id FROM users WHERE username = '$uname')";
	$result = mysql_query($query,$link) or die('Errant query:  '.$query);

	/* create one master array of the records */
	$posts = array();
	if(mysql_num_rows($result)) {
		while($post = mysql_fetch_assoc($result)) {
			$posts[] = array('post'=>$post);
		}
	}
	if (count($posts) == 0) {
		$query = "INSERT INTO lists (barcodeid, userid) VALUES ((SELECT id FROM barcodes WHERE barcode = '$bcode'), (SELECT id FROM users WHERE username = '$uname'))";
		mysql_query($query,$link) or die(array('response'=>'fail', 'query'=>$query));
		echo json_encode(array('response'=>'success'));
	}
	else 
		echo json_encode(array('response'=>'already'));

	/* disconnect from the db */
	@mysql_close($link);
}