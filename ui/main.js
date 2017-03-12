var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
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
    Console.log(username);
    Console.log(password);
    request.open('POST','http://kuharan.imad.hasura-app.io/login',true);
    request.send(JSON.stringfigy({username: username, password:password}));
    
};