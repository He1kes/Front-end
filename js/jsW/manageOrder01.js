var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"已完成",
        orderListFlag:true,
        detailFlag:false,
        codeDivFlag:false,
        payDivFlag:false,
        cancelDivFlag:false,
        //--------
        //网关地址
        orderIP:"http://localhost:5050/order/",
        //当前用户id
        userId:1,
        //分页
        pageNo:1,
        pageSize:1,
        pages:1,
        dateTotal:0,
        navigatePageNums:[],
        //数组
        ordersList:[],
        landlordsList:[""],
        //选中的订单index
        pickOrderId:0
    },
    mounted:function(){
        this.getOrders(1);
    },
    methods:{
        //展示订单详情
        detailShow:function (status) {
            this.orderListFlag = false;
            if(status == 1){
                this.detailFlag = true;
            }else if(status == 2){
                this.detailFlag = true;
                this.payDivFlag = true;
                this.option = "待支付";
            }else{
                this.detailFlag = true;
                this.codeDivFlag = true;
                this.option = "待使用";
            }
        },
        //关闭订单详情
        detailClose:function () {
            this.orderListFlag = true;
            this.detailFlag = false;
            this.codeDivFlag = false;
            this.payDivFlag = false;
        },
        //展示取消订单
        cancelShow:function () {
            this.cancelDivFlag = true;
            this.orderListFlag = false;
            this.detailFlag = false;
            this.codeDivFlag = false;
            this.payDivFlag = false;
        },
        //关闭取消订单
        cancelClose:function () {
            this.cancelDivFlag = false;
            this.orderListFlag = true;
        },
        //订单详情页联系房东
        contactFD:function () {
            window.location.href = "manageChatTemp.html";
        },
        //--------------------------------------
        //获取当前用户的订单
        testfunction:function(){
            console.log("testfunction");
        },
        getOrders:function (pageNo) {
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
            axios.get(that.orderIP+"getOrdersByUserIdOrderStatus?pageNo="+pageNo+"&pageSize="+that.pageSize+"&userId="+that.userId).then(
                function (value) {
                    console.log(value.data.flag);
                    //console.log(value.data.data.navigatepageNums);
                    that.pageNo = pageNo;
                    that.navigatePageNums = value.data.data.navigatepageNums;
                    that.pages = value.data.data.pages;
                    that.dateTotal = value.data.data.total;
                    that.ordersList = value.data.data.list;
                }
            )
        },
        pickOrder:function (index) {
            var that = this;
            that.pickOrderId = index;
        }

    }
})