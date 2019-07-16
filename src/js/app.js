App = {

    web3Provider: null,
    Voting: null,


    init: function(){
        return App.initWeb3();
    },

    //初始化web3
    initWeb3: function() {
        if(typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        }else{
            App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    //初始化合约
    initContract: function() {
        $.getJSON('Voting.json', function(data){
            App.Voting = TruffleContract(data);
            App.Voting.setProvider(App.web3Provider);

            return App.initData();
        });

        $("#vote").on("click", App.voteForCandidate);
    },

    //初始化初始数据
    initData: function() {
        //读取每一个候选人的得票数
        let candidates = {"Palm": "candidate-1", "Jack": "candidate-2", "Penny": "candidate-3"};
        let candiateNames = Object.keys(candidates);
        for(var i = 0; i < candiateNames.length; i++) {
            //获取候选人的名字
            let name = candiateNames[i];
            App.Voting.deployed().then(function(contractInstance){
                //获取每一个候选人的得票数
                return contractInstance.totalVotesFor(name);
            }).then(function(v){
                //填写
                $("#" + candidates[name]).html(v.toString());
            }).catch(function(err){
                console.log(err.message);
            });
        }
    },

    voteForCandidate: function(){
        let candidateName = $("#candidate").val();
        let ethvalue = $("#value").val();   //ether
        let weiValue = web3.toWei(ethvalue * 0.01, 'ether')

        App.Voting.deployed().then(function(contractInstance){
            return contractInstance.voteForCandidate(candidateName, {value: weiValue});
        }).then(function(v){
            App.initData();
        }).catch(function(err){
            console.log(err.message);
        })

    }

}

$(function(){
    $(window).on('load', function(){
        App.init();
    })
})
