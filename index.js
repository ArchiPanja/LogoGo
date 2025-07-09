import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();


const app=express();
const port=3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"Zoneify",
    password:process.env.PassWord,
    port:5432,
});
let quiz=[];
db.connect();
db.query("SELECT * FROM logo",(err,res)=>{
    if(err){
        console.log("Error Executing Query",err.stack);
    }else{
        quiz=res.rows;
    }
    db.end();
});

let totalCorrect=0;
let currentQuestion={};
function nextQuestion(){
    const randomLogo=quiz[Math.floor(Math.random()*quiz.length)];
    currentQuestion=randomLogo;
}
app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/welcome",(req,res)=>{
    res.render("welcome.ejs");
});


app.get("/index",(req,res)=>{
    totalCorrect=0;
    nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs",{question:currentQuestion});
});
app.post("/submit",(req,res)=>{
    let answer=req.body.answer.trim();
    console.log(answer);
    let isCorrect=false;
    if(currentQuestion.logoname.toLowerCase()===answer.toLowerCase()){
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect=true;
    }else{
       return(res.render("submit.ejs",{
        question:currentQuestion,
        totalScore:totalCorrect}));
    }
    nextQuestion();
    res.render("index.ejs",{
        question:currentQuestion,
        wasCorrect: isCorrect,
        totalScore:totalCorrect,
    });
});

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
});