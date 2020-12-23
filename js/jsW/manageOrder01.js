var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"已完成",
        orderListFlag:true,
        detailFlag:false,
        codeDivFlag:false,
        payDivFlag:false,
        cancelDivFlag:false
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
        }
    }
})