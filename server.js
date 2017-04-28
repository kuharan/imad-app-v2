var express=require('express');var morgan=require('morgan');var path=require('path');var Pool=require('pg').Pool;var crypto=require('crypto');var bodyParser=require('body-parser');var session=require('express-session');var config={host:'db.imad.hasura-app.io',user:'kuharan',password:process.env.DB_PASSWORD,database:'kuharan',port:'5432'};var app=express();app.use(morgan('combined'));app.use(bodyParser.json());app.use(session({secret:'someRandomSecretValue',cookie:{maxAge:1000*60*60*24*30}}));function createTemplate(data){var title=data.title;var date=data.date;var heading=data.heading;var content=data.content;var htmlTemplate=`
    <html>
        <head>
            <title> ${title} </title>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div><a href="/">Home</a><br>
            </div>
            <div>${date.toDateString()}</div>
            <div><p>Copyright wikipedia</p></div>
            <hr/>
            <h3> ${heading}</h3>
            <hr/>
            <div class="container">
                <div>
                  ${content}
                </div>
            </div>
        </body>
    </html>
    `;return htmlTemplate}
app.get('/',function(req,res){res.sendFile(path.join(__dirname,'ui','index.html'))});function hash(input,salt){var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');return["pbkdf2Sync","10000",salt,hashed.toString('hex')].join('$')}
app.get('/hash/:input',function(req,res){var hashedString=hash(req.params.input,'this-is-some-random-string');res.send(hashedString)});app.post('/create-user',function(req,res){var username=req.body.username;var password=req.body.password;var salt=crypto.randomBytes(128).toString('hex');var dbString=hash(password,salt);pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)',[username,dbString],function(err,result){if(err){res.status(500).send(err.toString())}else{res.send('User Successfully Created'+username)}})});app.post('/login',function(req,res){var username=req.body.username;var password=req.body.password;pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){if(err){res.status(500).send(err.toString())}else{if(result.rows.length===0){res.send(403).send('username/password invalid')}else{var dbString=result.rows[0].password;var salt=dbString.split('$')[2];var hashedPassword=hash(password,salt);if(hashedPassword===dbString){req.session.auth={userId:result.rows[0].id};res.send('Credentials Correct')}else{res.send(400).send('username/password invalid')}}}})});app.get('/check-login',function(req,res){if(req.session&&req.session.auth&&req.session.auth.userId){pool.query('SELECT * FROM "user" WHERE id = $1',[req.session.auth.userId],function(err,result){if(err){res.status(500).send(err.toString())}else{res.send(result.rows[0].username)}})}else{res.status(400).send('You are not logged in')}});app.get('/logout',function(req,res){delete req.session.auth;res.send('You are Logged out')});var pool=new Pool(config);app.get('/:test-db',function(req,res){pool.query('SELECT * FROM article',function(err,result){if(err){res.status(500).send(err.toString())}else{res.send(JSON.stringify(result.rows))}})});app.get('/articles/:articleName',function(req,res){pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function(err,result){if(err){res.status(500).send(err.toString())}else{if(result.rows.length===0){res.status(404).send('Article not found')}else{var articleData=result.rows[0];res.send(createTemplate(articleData))}}})});app.get('/ui/main.js',function(req,res){res.sendFile(path.join(__dirname,'ui','main.js'))});app.get('/ui/style.css',function(req,res){res.sendFile(path.join(__dirname,'ui','style.css'))});app.get('/ui/madi.png',function(req,res){res.sendFile(path.join(__dirname,'ui','madi.png'))});var port=8080;app.listen(8080,function(){console.log(`IMAD course app listening on port ${port}!`)})