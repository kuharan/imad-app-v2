var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var config = {
  host: 'db.imad.hasura-app.io',
  user: 'kuharan',
  password: process.env.DB_PASSWORD,
  database: 'kuharan',
  port:'5432'
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.Json());




/*var articles = {
    'article-one' : {
    title: 'Raees | Kuharan Bhowmik',
    heading: 'Raees (film)',
    date: 'Feb 18,2017',
    content:
            `<p>
               Raees is a 2017 Indian action crime thriller film directed by Rahul Dholakia and produced by Gauri Khan,
                Ritesh Sidhwani and Farhan Akhtar under their banners Red Chillies Entertainment and Excel Entertainment.
                It stars Shah Rukh Khan, Mahira Khan and Nawazuddin Siddiqui.
            </p>
            <p>
                Raees was said to be based on criminal Abdul Latif's life but, the filmmakers denied this, 
                saying "The story of the film is a pure work of fiction, not based on any person; living or
                dead." The film was released on 25 January 2017.
            </p>
            <p>
                Raees, from Fatehpur, Gujarat gets involved in illegal liquor trade at a very young age. Along with Sadiq, Raees works for a notorious gangster Jairaj, smuggles alcohol illegally by bribing the police. Though he is a smuggler, he lives by the philosophy, as taught by his mother that every occupation is good, and no religion is greater than any occupation till it does not cause any harm to anyone. 
            </p>
            <p>
                He decides to part ways with Jairaj and start operating on his own. He meets Musabhai and Nawab in Mumbai, and with their help he starts his bootlegging business. Meanwhile, an honest police offer of the IPS cadre, J. A. Majmudar, wants to end this illegal liquor trade.
            </p>`
    },
     
    'article-two' : {
        title:'Dangal | Kuharan Bhowmik',
        heading:'Dangal (film)',
        date:'Feb 19,2017',
        content:`
            <p>
               Dangal (English: Wrestling competition) is a 2016 Indian Hindi-language biographical sports drama
               film directed by Nitesh Tiwari. It stars Aamir Khan as Mahavir Singh Phogat, who taught wrestling
               to his daughters Geeta Phogat and Babita Kumari.
            </p>
            <p>
               The former is India's first female wrestler to win
               at the 2010 Commonwealth Games, where she won the gold medal (55 kg). Her sister Babita Kumari won
               the silver (51 kg). "Dangal" is the Hindi term for "a wrestling competition".
            </p>`
    },
    
    'article-three' : {
        title:'Sultan | Kuharan Bhowmik',
        heading:'Sultan (film)',
        date:'Feb 20,2017',
        content:`
            <p>
               Sultan is a 2016 Indian romantic sports-drama film directed by Ali Abbas Zafar.
               Produced by Aditya Chopra under the Yash Raj Films banner, the film stars Salman
               Khan as the title character opposite Anushka Sharma. 
            </p>
            <p>
               The film focuses on Sultan Ali Khan,
               a fictional wrestling champion from Haryana whose successful career creates a rift in his personal life.
            </p>`
    }

    
 };*/

function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    
    var htmlTemplate=`
    <html>
        <head>
            <title> ${title} </title>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <link href="ui/style.css" rel="stylesheet" />
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
    `;
    return htmlTemplate;
}



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt){
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2Sync", "10000", salt, hashed.toString('hex')].join('$');
    
}


app.get('/hash/:input', function (req, res) {
    
    var hashedString=hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);

});

app.post('/create-user/', function(req, res) {
    //JSON
    var username=req.body.username;
    var password=req.body.password;
    
    var salt=crypto.RandomBytes(128).toString('hex');
    var dbString=hash(password, salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)', [username, dbString], function(err, result){
        if (err){
            res.status(500).send(err.toString());
        }else{
            res.send('User Successfully Created' + username);
        } 
    });
});


var pool = new Pool(config);

app.get('/:test-db',function (req,res) {
   
    pool.query('SELECT * FROM article', function(err,result){
        if (err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/articles/:articleName', function(req,res){
    
pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.status(404).send('Article not found');
            }else{
                var articleData=result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
    
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
  
});
