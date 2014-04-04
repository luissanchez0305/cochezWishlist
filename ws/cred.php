<?php

if(isset($_GET['u']) && isset($_GET['p'])) {
	$username = 'espheras_dbuser';
	$password = 'Goingupinlife123';
	$database = 'cochezwl';
	
	$link = mysql_connect('localhost',$username,$password) or die('Cannot connect to the DB');
	mysql_select_db($database) or die(mysql_errno());
	header('Content-type: application/json');
	header("access-control-allow-origin: *");

	/* grab the posts from the db */
	$uname = $_GET['u'];
	$pwd = $_GET['p'];
	$query = "SELECT id FROM users WHERE username = '$uname' AND password = '$pwd'";
	$result = mysql_query($query,$link) or die('Errant query:  '.$query);
		
	/* create one master array of the records */
	$posts = array();
	if(mysql_num_rows($result)) {
		while($post = mysql_fetch_assoc($result)) {
			$posts[] = array('post'=>$post);
		}
	}
	echo json_encode(array('posts'=>$posts));

	/* disconnect from the db */
	@mysql_close($link);
}