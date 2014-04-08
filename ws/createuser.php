<?php
if(isset($_GET['u']) && isset($_GET['p']) && isset($_GET['e'])) {
	$username = 'espheras_dbuser';
	$password = 'Goingupinlife123';
	$database = 'cochezwl';
	
	$link = mysql_connect('localhost',$username,$password) or die('Cannot connect to the DB');
	mysql_select_db($database) or die(mysql_errno());
	header('Content-type: application/json');
	header("access-control-allow-origin: *");

	// TODO VERIFICAR QUE EL USUARIO YA EXISTE Y ENVIAR ERROR
	
	$uname = $_GET['u'];
	$pwd = $_GET['p'];
	$name = $_GET['n'] ? $_GET['n'] : '';
	$lname = $_GET['l'] ? $_GET['l'] : '';
	$email = $_GET['e'];
	$query = "INSERT INTO users (username, password, name, lastname, email) VALUES ('$uname', '$pwd', '$name', '$lname', '$email')";
	mysql_query($query,$link) or die('Errant query:  '.$query);
	echo json_encode(mysql_insert_id());

	/* disconnect from the db */
	@mysql_close($link);
}