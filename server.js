var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));


var articleOne={
  title:'Raees | Kuharan Bhowmik',
  heading:'Raees (film)',
  date:'Feb 18,2017',
  content:`
        <p>
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
};

function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    
    var htmltemplate=`
    <html>
        <head>
            <title> ${title} </title>
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <link href="ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div><a href="/">Home</a><br>
            </div>
            <div>${date}</div>
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

app.get('/article-one',function(req,res){
    res.send(createTemplate(articleOne));

});

app.get('/article-two',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));

});

app.get('/article-three',function(req,res){
     res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));

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
