var app = new Vue({
    el:"#ordinaryContent",
    data:{
        option:"测试",
        detailFlag:false,
        //--------
        //网关地址
        tIP:txqIP,
        chatIP:"/chat/front/private/",
        //当前用户token
        nowToken:localStorage.getItem("token"),
        //当前用户id
        userId:"",
        userName:"",
        userImage:"",
        //测试pickId--------------
        pickId:"1346615236513304576",
        pickUserName:"",
        pickUserImag:"",
        //数组
        chatDetailList:[],
        //对象
        chatContent:"",
        chatMessage:{},
        //定时
        myds:"",
        //传过来的房东id
        id:"",
    },
    mounted:function(){
        //拿传过来的fdID
        var url = window.location.href; //获取url中"?"符后的字串
        var cs = url.split('?')[1];                //获取?之后的参数字符串
        var nid = "";
        //alert(url+'地址');//orderCode=20200721093517378188743943022
        if (cs.length > 0) {
            nid = cs.replace('id=', '');
            this.id = decodeURIComponent(nid);
        }
        ;
        this.getUidByToken();
        this.getUserData(this.id);
        this.getChatDetail(this.id);
    },
    methods:{
        //关闭聊天详情窗口
        detailClose:function () {
            window.location.href = "manageChat01.html";
        },
        //-------------------
        //通过token拿userId(---改)
        getUidByToken: function(){
            var that = this;
            axios.get(that.tIP+that.chatIP+"getUserIdByToken", {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    console.log(that.nowToken);
                    console.log("getUidByToken:"+value.data.data);
                    if(value.data.flag == true){
                        that.userId = value.data.data;
                    }else {
                        console.log(value.data.message);
                    }
                    that.getUserData(that.userId);
                }
            )
        },
        //获取用户头像、名称(---改)
        getUserData:function (userIdcs) {
            var that = this;
            axios.get(that.tIP+"/user/front/private/getUserData?userId="+userIdcs, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log("getUserData:");
                    //console.log(value.data.data[0]);
                    if(userIdcs != that.userId){
                        that.pickUserName = value.data.data[0].userName;
                        that.pickUserImag = value.data.data[0].userImage;
                    }else {
                        //that.nowUserNP.push({uname:value.data.data[0].userName,uimage:value.data.data[0].userImage,uid:value.data.data[1]});
                        that.userName = value.data.data[0].userName;
                        that.userImage = value.data.data[0].userImage;
                    }
                }
            )
        },
        //获取聊天具体信息(---改)
        getChatDetail:function (otherId) {
            var that = this;
            that.chatDetailList = [];
            axios.get(that.tIP+that.chatIP+"getChatDetail?otherId="+otherId+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    //console.log(value.data.flag);
                    console.log("getChatDetail:");
                    console.log(value.data.data);
                    that.chatDetailList = value.data.data;
                    //定时刷新
                    that.myds =setInterval(function(){
                        that.timeToRefresh(otherId);
                    },3000);
                }
            )
        },
        //发送聊天内容
        storeChat:function () {
            var that = this;
            that.chatMessage.receiverId=that.id;
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
                        that.timeToRefresh(that.id);
                    }else {
                        console.log(value.data.message);
                    }
                })
            }
        },
        //定时刷新聊天内容
        timeToRefresh:function (otherId) {
            var that = this;
            that.chatDetailList = [];
            console.log("timeToRefresh");
            axios.get(that.tIP+that.chatIP+"getChatDetail?otherId="+otherId+"&selfId="+that.userId, {headers: {'token': that.nowToken}}).then(
                function (value) {
                    console.log(value.data.data);
                    that.chatDetailList = value.data.data;
                }
            )
        }
    }
})