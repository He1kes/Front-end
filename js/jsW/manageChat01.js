var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"测试",
        detailFlag:false,
        tipFlag:false,
        //--------
        //网关地址
        tIP:txqIP,
        chatIP:"/chat/front/private/",
        //当前用户token
        nowToken:localStorage.getItem("token"),
        //当前用户id
        userId:0,
        userName:"",
        nowUserNP:[],
        pickId:0,
        pickUserImag:"",
        pickUserName:"",
        //分页
        pageNo:1,
        pageSize:6,
        pages:1,
        dateTotal:0,
        navigatePageNums:[],
        //数组
        IdsList:[],
        noViewCountList:[],
        userNamePhoList:[],
        chatDetailList:[],
        //对象
        chatContent:"",
        chatMessage:{},
        //定时
        myds:""
    },
    mounted:function(){
        this.getUidByToken();
    },
    methods:{
        //展示聊天详情
        detailShow:function () {
            this.detailFlag = true;
        },
        //关闭聊天详情
        detailClose:function () {
            this.detailFlag = false;
            clearInterval(this.myds);
        },
        //-------------------
        //通过token拿userId
        getUidByToken: function(){
            var that = this;
            axios.get(that.tIP+that.chatIP+"getUserIdByToken", {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    console.log(that.nowToken);
                    console.log("getUidByToken:"+value.data.data);
                    if(value.data.flag == true){
                        that.userId = value.data.data;
                        that.getIds(1);
                    }else {
                        console.log(value.data.message);
                    }
                    that.getUserData(that.userId);
                }
            )
        },
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
            axios.get(that.tIP+that.chatIP+"getOthersList?pageNo="+pageNo+"&pageSize="+that.pageSize+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    that.pageNo = pageNo;
                    that.navigatePageNums = value.data.data.navigatepageNums;
                    that.pages = value.data.data.pages;
                    that.dateTotal = value.data.data.total;
                    //ids数组
                    that.IdsList = [];
                    that.IdsList = value.data.data.list;
                    if(that.IdsList.length <= 0){
                        that.tipFlag = true;
                    }else {
                        //获取与各个用户的未读消息条数
                        //获取各个用户的头像名称
                        that.tipFlag = false;
                        that.noViewCountList = [];
                        that.userNamePhoList = [];
                        for(var i=0;i<that.IdsList.length;i++){
                            that.getUserData(that.IdsList[i]);
                        }
                    }
                }
            )
        },
        //获取用户头像、名称
        getUserData:function (userIdcs) {
            var that = this;
            axios.get(that.tIP+"/user/front/private/getUserData?userId="+userIdcs, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log("getUserData:");
                   //console.log(value.data.data[0]);
                    if(userIdcs != that.userId){
                        that.userNamePhoList.push({uname:value.data.data[0].userName,uimage:value.data.data[0].userImage,uid:value.data.data[1]});
                        that.getNoViewCounts(userIdcs);
                    }else {
                        that.nowUserNP.push({uname:value.data.data[0].userName,uimage:value.data.data[0].userImage,uid:value.data.data[1]});
                        that.userName = value.data.data[0].userName;
                    }
                }
            )
        },
        //未读消息条数
        getNoViewCounts:function (otherId) {
            var that = this;
            axios.get(that.tIP+that.chatIP+"noViewCounts?otherId="+otherId+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    //console.log("getNoViewCounts:");
                    console.log(value.data.data);
                    that.noViewCountList.push(value.data.data);
                }
            )
        },
        //获取聊天具体信息
        getChatDetail:function (otherId,index) {

            var that = this;
            that.pickId = otherId;
            that.pickUserImag= that.userNamePhoList[index].uimage;
            that.pickUserName= that.userNamePhoList[index].uname;
            that.chatDetailList = [];
            axios.get(that.tIP+that.chatIP+"getChatDetail?otherId="+otherId+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    //console.log("getChatDetail:");
                    console.log(value.data.data);
                    that.chatDetailList = value.data.data;
                    //定时刷新
                    that.myds =setInterval(function(){
                        that.timeToRefresh(otherId);
                    },2000);
                }
            )
        },
        //发送聊天内容
        storeChat:function () {
            var that = this;
            that.chatMessage.receiverId=that.pickId;
            that.chatMessage.receiverName=that.pickUserName;
            that.chatMessage.senderId=that.userId;
            that.chatMessage.sendName=that.userName;
            that.chatMessage.content=that.chatContent;
            //内容不能为空
            if(that.chatContent.trim().length > 0){
                axios.post(that.tIP+that.chatIP+"storeChat",that.chatMessage, {headers: {'token': that.nowToken}}).then(function (value) {
                    if(value.data.flag == true){
                        console.log("添加成功！");
                        that.chatContent = "";
                        //重新加载内容
                        //that.timeToRefresh(that.pickId);
                    }else {
                        console.log(value.data.message);
                    }
                })
            }
        },
        //将所有未读消息置为已读状态
        setViewed:function (otherId) {
            var that = this;
            axios.get(that.tIP+that.chatIP+"setViewedIds?otherId="+otherId+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    //console.log("getChatDetail:");
                    if(value.data.flag == true){
                        console.log("置为已读条数："+value.data.data);
                        that.getIds(that.pageNo);
                    }else {
                        console.log(value.data.message);
                    }
                }
            )
        },
        //定时刷新聊天内容
        timeToRefresh:function (otherId) {
            var that = this;
            that.chatDetailList = [];
            console.log("timeToRefresh-ds");
            axios.get(that.tIP+that.chatIP+"getChatDetail?otherId="+otherId+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    console.log(value.data.data);
                    that.chatDetailList = value.data.data;
                }
            )
        }
    }
})