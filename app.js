var express=require('express'),
    app=express(),
    bodyparser=require('body-parser'),
    blockchain=require("./block.js"),
    port=process.argv[2],
    currentNodeUrl=process.argv[3],
    rp=require('request-promise');


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
       var abc=bitblock.addtransaction(req.body);
       console.log(abc);
       var broadtransnodearray=[...bitblock.NetworkNode];
       var broadrequest=[];
       broadtransnodearray.forEach(node=>{
              const transreq={
                     uri:node+"/broadcast-transaction",
                     method:'POST',
                     body:{transnew:abc},
                     json:true
              }
              broadrequest.push(rp(transreq))
       });
       Promise.all(broadrequest)
       .then(data=>{
              res.send("transaction updated succcessfully");
       })

       
});
app.post("/broadcast-transaction",function(req,res){
       bitblock.pendingtransactions.push(req.body.transnew);
       res.json({"note":"transaction added"});
});


app.post("/mine",function(req,res){
       var b= bitblock.mineblock();
       var broadcastblock=[...bitblock.NetworkNode];
       var broadBlockMine=[];
       broadcastblock.forEach(node=>{
              var blockdata={
                     uri:node+"/register-block",
                     method:'POST',
                     body:{blk:b},
                     json:true
              }
              broadBlockMine.push(rp(blockdata));
       });
       Promise.all(broadBlockMine)
       .then(data=>{
              res.json({"note":"Block Mined and broadcasted successfully"});
       });

});
app.post("register-block",function(req,res){
       console.log("vgccgh");
       if(bitblock.chain[bitblock.chain.length-1]['hash']===req.body.blk.previousBlockHash){
              if(bitblock.chain.length==req.body.blk.index){
                     bitblock.chain.push(req.body.blk);
                     bitblock.pendingtransactions=[];
                     res.json({"note":"block mined successfully"});
              }

       }


});
//decentralize

app.post("/register-and-broadcast-node",function(req,res){
       var NodetoRegister=req.body.node;
       bitblock.NetworkNode.push(NodetoRegister);
       const promisearray=[];
       bitblock.NetworkNode.forEach(node=>{
              const broadreq={
                     uri:node+'/register-node',
                     method:'POST',
                     body:{node:NodetoRegister},
                     json:true
                     
              }
              promisearray.push(rp(broadreq));

       });
       Promise.all(promisearray)
       .then(data=>{
              // bulk all nodes to the added node
              var bulknodearray=[]; 
              const bulknodesreq={
                     uri:NodetoRegister+"/register-nodes-bulk",
                     method:'POST',
                     body:{node:[...bitblock.NetworkNode,bitblock.currentNode]},
                     json:true
              }
              bulknodearray.push(rp(bulknodesreq));
              Promise.all(bulknodearray).
              then(data=>{
                     res.json({"note":"node added successfully"});
              })

       })
})

app.post("/register-node",function(req,res){
       if(bitblock.currentNode!==req.body.node && bitblock.NetworkNode.indexOf(req.body.node)===-1){
              bitblock.NetworkNode.push(req.body.node);
       }
       res.json({"note":"done"});

});
app.post("/register-nodes-bulk",function(req,res){
      var bulknodes=req.body.node;
      console.log(bulknodes);
      bulknodes.forEach(node=>{
             if(node!==bitblock.currentNode && bitblock.NetworkNode.indexOf(node)===-1){
                    bitblock.NetworkNode.push(node);
             }
      })
      res.json({"note":"done"});
});



app.listen(port,function(){
 console.log("start again fuck world "+port+"  "+currentNodeUrl);
    });