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
    	alert('check');
        document.getElementById('verifyUserBtn').addEventListener('click', this.checkCredentials, false);
        /*document.getElementById('signupBtn').addEventListener('click', this.createUser, false);*/
        document.getElementById('scanCode').addEventListener('click', this.scan, false);
        document.getElementById('logout').addEventListener('click', this.logout, false);
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
        var value = window.localStorage.getItem("cochezwl_user");
        if(value){
        	if(value.length > 0){
    	        $('#changeListing').trigger('click');
        		fillList(value);
        	}
        }
    	else {
            $('#changeLogin').trigger('click');
    	}
        	
    },    
    /*createUser: function(){
    	if($('#email').val().length > 0 && 
    			$('#pwd1').val().length > 0 && 
    			$('#pwd2').val().length > 0 && 
    			$('#uname').val().length > 0 &&
    			$('#pwd1').val() == $('#pwd2').val()){
	    	var usr = $('#uname').val();
	    	var pwd = $('#pwd1').val();
	    	var email = $('#email').val();
	    	var fname = $('#name').val();
	    	var lname = $('#lname').val();
	    	
	    	$.ajax({
	    		ur: 'http://cochezwl.espherasoluciones.com/createuser.php',
	    		data: {u: usr, p: pwd, e: email, n: fname, l: lname },
	    		success: function(data){
	    			// TODO VALIDAR QUE EL USUARIO EXISTE O NO
	    	        window.localStorage.setItem("cochezwl_user", usr);
	    	        $('#missingDataList').html('');
	    			changePage('list-page');   	
	    		}
	    	});
    	}
    	else{
    		var missingData = '<ul data-role="listview">';
    		if($('#email').val().length == 0)
    			missingData += '<li>Email</li>';
    		if($('#uname').val().length == 0)
    			missingData += '<li>Username</li>';
    		if($('#pwd1').val().length == 0)
    			missingData += '<li>Password</li>';
    		if($('#pwd2').val().length == 0)
    			missingData += '<li>Confirmacion de password</li>';
    		if($('#pwd1').val().length > 0 && $('#pwd2').val().length > 0)
    			missingData += '<li>Contraseñas no son iguales</li>';
			missingData += '</ul>';
    		$('#missingDataList').html(missingData);
    	}
    },*/
    checkCredentials: function(){
    	var usr = $('#usr').val();
    	var pwd = $('#pwd').val(); 	

    	//Revisar credenciales desde webservice
    	$.ajax({
    	  url: 'http://cochezwl.espherasoluciones.com/cred.php',
    	  data: {u: usr, p: pwd},
    	  success: function(data){
    		if(data.posts.length > 0){
    	        window.localStorage.setItem("cochezwl_user", usr);
    	        $('#changeListing').trigger('click');
    			fillList(usr);
    			$('#usr').val('');
    	    	$('#pwd').val(''); 
    		}
    		else
    			alert('usuario no existe');
    	  	},
    	  dataType: 'json'
    	});
    },
    scan: function(){
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) {  
            alert(result.text);
            $.ajax({
            	url: 'http://cochezwl.espherasoluciones.com/getproduct.php',
            	data { b: result.text },
            	success: function(data){
            		if(data.posts.length > 0){
            			$.ajax({
            				url: 'http://cochezwl.espherasoluciones.com/createproductonuser.php',
            				data: { b: result.text, u: window.localStorage.setItem("cochezwl_user") },
            				success: function(data){
            					if(data != '0'){
            						$('#listSection').append('<li data-icon="false">'+result.text+' - '+data.posts[0].post.name+'</li>')
            					}
            					else {
            						alert('error guardando');
            					}
            				},
            				dataType: 'json'
            			
            			});
            		}
            		else {
            			alert('producto no existe');
            		}
            	},
            	dataType: 'json'
            })
        }, function (error) { 
            alert("Scanning failed: ", error); 
        });
    },
    logout: function(){
        window.localStorage.removeItem("cochezwl_user");
        $('#changeLogin').trigger('click');
    }
};

function fillList(user){
	$.ajax({
		url: 'http://cochezwl.espherasoluciones.com/getList.php',
		data: { u: user },
		success: function(data){
			if(data.posts.length == 0){
				$('#listSection').html('<li>Aun no has agregado ningun producto</li>');
			}
			else{
				var list = '';
				for(var i = 0; i < data.posts.length; i++){
					list += '<li data-icon="false">'+data.posts[i].post.barcode+' - '+data.posts[i].post.name+'</li>';
				}
				$('#listSection').html(list);
			}
		},
    	dataType: 'json'
	});
}

function changePage(showPage){
	$('div[data-role="page"]').each(function(){
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