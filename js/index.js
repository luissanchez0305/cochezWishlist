/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('verifyUserBtn').addEventListener('click', this.checkCredentials, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        db = window.openDatabase("cochezwl", "1.0", "Test DB", 1000000);
        db.transaction(initDb, txError, initTxSuccess);
    }
};
function initDb(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS cochezusers(user,pwd,online)');
}

function txError(error) {
    alert("Database error: " + error);
}

function initTxSuccess() {
    db.executeSql('SELECT * FROM cochezusers', [], selectSuccess, txError);  
}

function selectSuccess(tx, results) {
	alert('results: ' + results.rows.length);
	var usr = $('#user').val();
	var pwd = $('#pwd').val();
	
	if(results.rows.length > 0) {
		changePage('list-page');
		//TODO: Traer lista del usuario logueado
	}
	else {
		changePage('main-page');
	}
}

function checkCredentials(){
	alert('check');
    db.transaction(checkCredentialsDB, errorDB, successDB);    	
}

function checkCredentialsDB(tx){
	var usr = $('#user').val();
	var pwd = $('#pwd').val();
	// Revisar credenciales primero en el telefono
    db.executeSql('SELECT * FROM cochezusers WHERE user = '+ usr + ' AND pwd = ' + pwd, [], selectCheckCredentialsSuccess, txError); 	
}

function selectCheckCredentialsSuccess(tx, results) {

	if(results.rows.length > 0) {
		changePage('list-page');
	}
	else {	
		//Revisar credenciales desde webservice
		$.get('http://cochezwl.espherasoluciones.com/cred.php', {u: usr, p: pwd}, function(data){
			if(data.posts.length > 0)
				db.executeSql('INSERT INTO Users (id, user, pwd) VALUES (1, "'+usr+'", "'+pwd+'")');  
			else
				alert('usuario no existe');
		})		
	}
}

function changePage(showPage){
	$('div[data-role="page"]').each(function(){
		alert();
		if($(this).attr('id') == showPage){
			$(this).removeClass('hide');
			$(this).addClass('ui-page ui-body-c ui-page-active');
		}
		else{
			$(this).addClass('hide');
			$(this).removeClass('ui-page ui-body-c ui-page-active');
		}
	});
}