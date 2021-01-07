var app = new Vue({
    el:"#cancelSuccessModal",
    data:{
        option:"test1",
    },
    methods:{
        //模态框点击确认跳转回订单列表页面
        goOrderList:function () {
            window.location.href="manageOrder01.html";
        }
    }
})