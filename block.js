var uuid=require('uuid/v1');
var sha256=require('sha256');
var currentNodeUrl=process.argv[3];

function blockchain(){
    this.chain=[];
    this.pendingtransactions=[];
    //adding genesis block
    var blockofchains={
        "transactions":this.pendingtransactions,
        "hash":0,
        "nonce":0,
        "timestamp":Date.now(),
        "index":this.chain.length+1,
        "previousBlockHash":0
    }
    this.pendingtransactions=[];
    this.chain.push(blockofchains);
    this.currentNode=currentNodeUrl;
    this.NetworkNode=[];


}

blockchain.prototype.addtransaction=function(transactiondata){
    var transid=uuid().split("-").join("");
    console.log(transactiondata);
    var newtransaction={
        "transid":transid,
        "sender":transactiondata.sender,
        "receiver":transactiondata.receiver,
        "amount":transactiondata.amount
    };
    this.pendingtransactions.push(newtransaction);
    var st="transaction added in block "+this.chain.length+1;
    return(newtransaction);
}

blockchain.prototype.getblockchain=function(){
    var blockch={
        "blocks":this.chain,
        "pendingtransactions":this.pendingtransactions
    }
    console.log(blockch);
    return(blockch);
}
blockchain.prototype.proofofwork=function(nonce,previousblockhash,currentblockdata){
    var data=nonce+previousblockhash+currentblockdata;
    var curhash=sha256(data);
    while(curhash.substring(0,4)!=="0000"){
        nonce=nonce+1;
        data=nonce+previousblockhash+currentblockdata;
        curhash=sha256(data);
    }
    return {
        "nonce":nonce,
        "currenthash":curhash
    }
}

blockchain.prototype.mineblock=function(){
   
   var pow=this.proofofwork(0,this.chain[this.chain.length-1]['hash'],this.pendingtransactions)
    var blockofchains={
        "transactions":this.pendingtransactions,
        "hash":pow.currenthash,
        "previousBlockHash":this.chain[this.chain.length-1]['hash'],
        "nonce":pow.nonce,
        "timestamp":Date.now(),
        "index":this.chain.length+1
    }
    this.pendingtransactions=[];
    this.chain.push(blockofchains);
    return(blockofchains);

}

module.exports=blockchain;