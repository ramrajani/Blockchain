var express=require('express'),
    app=express(),
    bodyparser=require('body-parser'),
    blockchain=require("./block.js"),
    port=process.argv[2],
    currentNodeUrl=process.argv[3];


var bitblock=new blockchain();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get("/",function(req,res){
    res.send("Live Forever");
});
app.get("/getblockchain",function(req,res){
       res.send(bitblock);
});
app.post("/addtransaction",function(req,res){
      res.send(bitblock.addtransaction(req.body));
       
})
app.get("/mine",function(req,res){
       var b= bitblock.mineblock();
       res.send(b);

});
//decentralize

app.post("/addnode",function(req,res){
       
})

    
app.listen(port,function(){
 console.log("start again fuck world "+port+"  "+currentNodeUrl);
    });