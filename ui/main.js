var submit = document.getElementById('submit_btn');
submit.onclick = function () {
    //create request object
    var request = new XMLHttpRequest();
    
    //capture the response and store it in avariable
    request.onreadystatechange = function () {
        if(request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200){
                Console.log('User logged in');
                alert('Logged in Successfully');
            }else if(request.status === 403){
                alert('username/password incorrect');
            }else if(request.status === 500){
                alert('Something went Wrong on the server');
            }
            
        }
      //not done yet
    };
    
    
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    if ( typeof ( console ) !== 'undefined' && console !== null) {
        console.log(username);
        console.log(password);
    }else{
        //console == {log: function () {},warn: function () {},error: function () {}}
    }
    
    request.open('POST','http://kuharan.imad.hasura-app.io/login',true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password:password}));
    
};