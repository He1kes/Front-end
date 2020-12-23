var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"测试",
        detailFlag:false,
    },
    methods:{
        //关闭聊天详情窗口
        detailClose:function () {
            window.location.href = "manageChat01.html";
        }
    }
})