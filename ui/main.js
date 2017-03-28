function loadLoginForm () {
    var loginHtml = `<h3> Login / register </h3>
                      <form action="#">
					<input type ="text" id="username" placeholder="Your Username" class="text-search">
					<input type="password" id="password" placeholder="Your Password" class="text-search">
                    <!-- <input type="text" value="Search here..." onblur="if(this.value == '') { this.value = 'Search here...'; }" onfocus="if (this.value == 'Search here...') { this.value = ''; }" class="text-search">
                     <input type="submit" value="" class="submit-search" disabled>-->
					 <input type="BUTTON" id="login_btn" class="button" value="Login">
					 <input type="BUTTON" id="register_btn" class="button" value="Register">
					 
                  </form>
                  `;

    document.getElementById('login-area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Success!';
                 // loadLoginforComment();
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
                  var exists = document.getElementById("login-area");
                if ( !exists ) {
                    document.getElementById('login-area').innerHTML = '';
                }
              } else if (request.status === 500) {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
         var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;     
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                 // alert('User created successfully');
                  register.value = 'Registered!';
                 loginRegisteredUser( username, password );
                 loadLogin();
                  
              } else {
                 //alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
       
        //console.log(username);
        //console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
        
    
    };
}

function loginRegisteredUser ( username, password ){
    

        var request = new XMLHttpRequest();
        var submit = document.getElementById('register_btn');    
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Logging in...';
                  loadLoggedInUser(username);
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Registered!';
              } else {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Registered!';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
      //  var username = document.getElementById('username').value;
    //    var password = document.getElementById('password').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    }
    

function loadLoggedInUser (username) {
    var loginArea = document.getElementById( 'login-area');
    var currentlocation = window.location.pathname.split('/')[2];
    loginArea.innerHTML = `<h5> Welcome 
    <a href="#" title="Change Profile"> ${username}!</a></h5>
        
        <a href="#" title="Compose a new Article">Compose an Article</a>
        <br />
        <a href="#" title="Edit an Article" >Edit Your Article</a>
        <br />
        <a href="#" onclick="logout()">Logout</a>`;
}

function loadLogin () {
    //Check if the user is already logged in 
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
               // alert(this.responseText);
                loadLoggedInUser(this.responseText);
            }
            else {
                loadLoginForm();
            }
        }
    };

    request.open('GET', '/auth/check-login',true);
    request.send(null);
    
}

/*function logout() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var exists = document.getElementById("login-area");
                if ( !exists ) {
                    document.getElementById('login-area').innerHTML = '';
                }
                loadLoginForm();
            }
            
        }
    };

    request.open('GET', '/logout',true);
    request.send(null);
    
}*/






// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();


