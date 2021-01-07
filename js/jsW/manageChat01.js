var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"测试",
        detailFlag:false,
        //--------
        //网关地址
        chatIP:"http://localhost:5050/chat/",
        //当前用户id
        userId:2,
        //分页
        pageNo:1,
        pageSize:6,
        pages:1,
        dateTotal:0,
        navigatePageNums:[],
        //数组
        IdsList:[],
        noViewCountList:[]
    },
    mounted:function(){
        this.getIds(1);
    },
    methods:{
        //展示订单详情
        detailShow:function () {
            this.detailFlag = true;
        },
        //关闭订单详情
        detailClose:function () {
            this.detailFlag = false;
        },
        //-------------------
        //根据自己的id，获取与自己有聊天记录的所有用户的id
        getIds:function (pageNo) {
            var that = this;
            if(pageNo == null){
                pageNo = that.pageNo;
            }
            if(pageNo < 1){
                pageNo = that.pageNo;
            }
            if(pageNo > that.pages){
                pageNo = that.pages;
            }
            axios.get(that.chatIP+"getOthersList?pageNo="+pageNo+"&pageSize="+that.pageSize+"&selfId="+that.userId).then(
                function (value) {
                    console.log(value.data.flag);
                    //console.log(value.data.data.list);
                    that.pageNo = pageNo;
                    that.navigatePageNums = value.data.data.navigatepageNums;
                    that.pages = value.data.data.pages;
                    that.dateTotal = value.data.data.total;
                    that.ordersList = value.data.data.list;
                    //获取与各个用户的未读消息条数
                    for(var i=0;i<that.ordersList.length;i++){
                        that.getNoViewCounts(that.ordersList[i]);
                    }
                }
            )
        },
        //未读消息条数
        getNoViewCounts:function (otherId) {
            var that = this;
            axios.get(that.chatIP+"noViewCounts?otherId="+otherId+"&selfId="+that.userId).then(
                function (value) {
                    //console.log(value.data.flag);
                    console.log(value.data.data);
                    that.noViewCountList.push(value.data.data);
                }
            )
        }
    }
})