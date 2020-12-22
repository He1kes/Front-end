var app = new Vue({
    el:"#cancelSuccessModal",
    data:{
        option:"test1",
    },
    methods:{
        //test
        goOrderList:function () {
            this.option = "test2"
        }
    }
})