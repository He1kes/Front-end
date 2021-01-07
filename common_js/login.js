const loginOut = new Vue({
    el: '#loginOut',
    data: {
        imgSrc: 'images/4.png',
        userName: 9527
    },
    methods: {
        loginOut() {
            axios({
                methods: 'get',
                url: txqIP + '/user/front/private/loginOut',
                headers: {
                    'token': localStorage.getItem('token')
                }
            })
                .then(function (result) {
                    if (result.data.flag == true) {
                        window.location.href = 'index.html';
                    } else {
                        alert(result.data.message);
                    }
                });
        },
        getUserMessage() {
            let that = this;
            axios({
                method: 'get',
                url: txqIP + '/user/front/private/getUserMessage',
                headers: {
                    'token': localStorage.getItem('token')
                }
            })
                .then(function (result) {
                    that.imgSrc = result.data.data.userImage;
                    that.userName = result.data.data.userName;
                });
        }
    },
    created: function () {
        this.getUserMessage();
    }
});
