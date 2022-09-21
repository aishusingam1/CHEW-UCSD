const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { resolveSoa } = require("dns");
const app = express();

//use ejs 
app.set('view engine', 'ejs');

//use body-parser to take in value from html form
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aishu123',
    database: 'mealsDB'
})

// Connect to MySQl
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySQL Connected...')
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
    //__dirname shows path to file from any local repo
});

var obj = {};
app.post('/suggest', function(req,res){

    //Checking which of the colleges have been chosen
    var colleges = [];

    if(req.body.revelle){
        colleges.push('Revelle');
    } if(req.body.muir){
        colleges.push('Muir');
    } if(req.body.marshall){
        colleges.push('Marshall');
    } if(req.body.warren){
        colleges.push('Warren');
    } if(req.body.roosevelt){
        colleges.push('Roosevelt');
    } if(req.body.sixth){
        colleges.push('Sixth');
    } if(req.body.seventh){
        colleges.push('Seventh');
    }

    // Choosing a random meal from the colleges chosen and displaying in output.ejs
    var sql = "";
    for(let i = 0; i < colleges.length-1; i++){
        sql += "SELECT * FROM meals WHERE college='"+colleges[i]+"' UNION ";
    }
    sql += "SELECT * FROM meals WHERE college='"+colleges[colleges.length-1]+"' ORDER BY RAND() LIMIT 1";
    //console.log("SQL Query: " + sql);
    db.query(sql, function(err, res1){
        if(err){
            throw err;
        } else{
            obj = {data: res1};
            res.render('output', obj);
        }
    });
    console.log(colleges);
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});