var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"已完成",
        orderListFlag:false,
        detailFlag:false,
        //取消原因
        cancelDivFlag:false,
        //--------
        tipFlag:false,
        //取消订单按钮
        dateFlag:true,
        //网关地址
        tIP:txqIP,
        orderIP:"/order/front/private/",
        //当前用户token
        nowToken:localStorage.getItem("token"),
        //当前用户id
        userId:"1",
        nowUser:{},
        pickUserId:"",
        pickUser:{},
        //分页
        pageNo:1,
        pageSize:3,
        pages:1,
        dateTotal:0,
        navigatePageNums:[],
        //数组
        ordersList:[],
        landlordsList:[],
        houseIdList:[],
        //选中的订单index
        pickIndex:0,
        cancelCause:"其他",
    },
    mounted:function(){
        this.getUidByToken();
    },
    methods:{
        //展示订单详情
        detailShow:function () {
            this.orderListFlag = false;
            this.detailFlag = true;
        },
        //关闭订单详情
        detailClose:function () {
            this.orderListFlag = true;
            this.detailFlag = false;
        },
        //展示取消订单
        cancelShow:function () {
            this.cancelDivFlag = true;
            this.orderListFlag = false;
            this.detailFlag = false;
        },
        //关闭取消订单
        cancelClose:function () {
            this.cancelDivFlag = false;
            this.orderListFlag = true;
        },
        //订单详情页联系房东
        contactFD:function (fdID) {
            window.location.href = "manageChatTemp.html?id="+fdID;
        },
        //--------------------------------------
        //通过token拿userId
        getUidByToken: function(){
            var that = this;
            console.log(that.nowToken);
            axios.get(that.tIP+that.orderIP+"getUserIdByToken", {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    console.log("getUidByToken:"+value.data.data);
                    if(value.data.flag == true){
                        that.userId = value.data.data;
                        that.getOrders(1);
                    }else {
                        console.log(value.data.message);
                    }
                    that.getUserData(that.userId);
                }
            )
        },
        //获取用户信息
        getUserData:function (userId) {
            var that = this;
            axios.get(that.tIP+"/user/front/private/getUserData?userId="+userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log("getUserData:");
                    //console.log(value.data.data[0]);
                    if(userId != that.userId){
                        that.pickUser = value.data.data[0];
                        //that.pickUserId = value.data.data[1];
                    }else {
                        that.nowUser = value.data.data[0];
                        //that.userId = value.data.data[1];
                    }
                }
            )
        },
        //获取当前用户的订单
        getOrders:function (pageNo) {
            var that = this;
            //因为订单详情也在这个页面，进来就会加载，所以先给个0保证有值，不会加载页面出错
            that.pickIndex = 0;
            if(pageNo == null){
                pageNo = that.pageNo;
            }
            if(pageNo < 1){
                pageNo = that.pageNo;
            }
            if(pageNo > that.pages){
                pageNo = that.pages;
            }
            axios.get(that.tIP+that.orderIP+"getOrdersByUserIdOrderStatus?pageNo="+pageNo+"&pageSize="+that.pageSize+"&userId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    that.pageNo = pageNo;
                    that.navigatePageNums = value.data.orders.navigatepageNums;
                    that.pages = value.data.orders.pages;
                    that.dateTotal = value.data.orders.total;
                    //数据
                    console.log(value.data.orders.list);
                    that.ordersList = value.data.orders.list;
                    that.landlordsList = value.data.landIds;
                    that.houseIdList = value.data.houseIds;
                    if (that.ordersList.length <= 0) {
                        that.tipFlag = true;
                        that.orderListFlag = false;
                    }else {
                        that.tipFlag = false;
                        that.orderListFlag = true;
                    }
                }
            )
        },
        //选中的订单
        pickOrder:function (index) {
            var that = this;
            that.pickIndex = index;
            that.pickUserId = that.landlordsList[index];
            that.getUserData(that.pickUserId);
            that.checkDate();
        },
        //根据houseId获取房源信息------------------------------------
        getHouseInfo:function () {
            var that = this;

        },
        //判断是否超过入住时间
        checkDate:function () {
            var that = this;
            var orderStatus = that.ordersList[that.pickIndex].orderStatus;
            var orderId = that.ordersList[that.pickIndex].id;
            var success = "已消费";
            if(orderStatus == "待入住"){
                var startDate = that.ordersList[that.pickIndex].startDate;
                var beginDate = new Date(new Date(new Date(startDate).toLocaleDateString()).getTime()+18*60*60*1000-1);
                var nowDate = new Date();
                //当前时间大于入住时间18:00，则隐藏取消订单按钮
                if(nowDate.getTime() - beginDate.getTime() > 0){
                    that.dateFlag = false;
                    //将待入住置为已消费
                    axios.get(that.tIP+that.orderIP+"updateOrderStatus?orderId="+orderId+"&orderStatus="+success, {headers: {'token': that.nowToken}}).then(
                        function (value) {
                            if(value.data.flag == true){
                                console.log("成功置为已消费！");
                                //刷新订单列表
                                that.getOrders(that.pageNo);
                            }else {
                                console.log(value.data.message);
                            }
                        }
                    )
                }else{
                    that.dateFlag = true;
                }
            }else{
                that.dateFlag = false;
            }
        },
        //提交取消订单原因
        getCancel:function (orderId) {
            var that = this;
            axios.get(that.tIP+that.orderIP+"setOrderRemark?orderId="+orderId+"&cancel="+that.cancelCause, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    if(value.data.flag == true){
                        console.log("提交成功！");
                    }else {
                        console.log(value.data.message);
                    }
                }
            )
        },
        //发起退款--------------------------
        refund:function () {
            var that = this;
        }
    }
})