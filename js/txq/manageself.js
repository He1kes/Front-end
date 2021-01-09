const updateSelf = new Vue({
    el: '#updateSelf',
    data: {
        photo: null,
        userName: null,
        phone: null,
        imgSrc: 'images/4.png',
        updateFlag: false,
        updateMessage: '',
        userNameFlag: true,
        phoneFlag: true
    },
    methods: {
        changePhoto() {
            document.getElementById('photo').click();
        },
        changeFile(event) {
            //图片回显
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let that = this;
            reader.onload = function (e) {
                let src = this.result.substring(this.result.indexOf(',') + 1);
                that.imgSrc = 'data:image/png;base64,' + src;
            }
        },
        getFile(event) {
            this.photo = event.target.files[0];
        },
        file(event) {
            this.getFile(event);
            this.changeFile(event);
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
                    that.phone = result.data.data.phone;
                });
        },
        checkUserName() {
            this.userName = this.userName == null ? this.userName :this.userName.trim();
            let userName = this.userName;
            if (userName != null && userName != '') {
                if (userName.length >= 6 && userName.length <= 12) {
                    this.updateFlag = false;
                    this.userNameFlag = true;
                    this.updateMessage = '';
                } else {
                    this.updateFlag = true;
                    this.userNameFlag = false;
                    this.updateMessage = '用户名过短或过长';
                }
            } else {
                this.updateFlag = true;
                this.userNameFlag = false;
                this.updateMessage = '用户名不为空';
            }
        },
        checkPhone() {
            this.phone = this.phone == null ? this.phone :this.phone.trim();
            let phone = this.phone;
            if (phone != null && phone != '') {
                let regExp = /^1[3|4|5|7|8|9][0-9]{9}$/;
                if (regExp.test(phone)) {
                    this.updateFlag = false;
                    this.phoneFlag = true;
                    this.updateMessage = '';
                } else {
                    this.updateFlag = true;
                    this.phoneFlag = false;
                    this.updateMessage = '手机号不符合要求';
                }
            } else {
                this.updateFlag = true;
                this.phoneFlag = false;
                this.updateMessage = '手机号不为空';
            }
        },
        updateUser() {
           let userNameFlag = this.userNameFlag;
           let phoneFlag = this.phoneFlag;
           let that = this;
           if (userNameFlag && phoneFlag) {
               let formData = new FormData();
               formData.append('photo', this.photo);
               formData.append('userName', this.userName);
               formData.append('phone', this.phone);

               axios({
                   method: 'post',
                   url: txqIP + '/user/front/private/updateUser',
                   data: formData,
                   headers: {
                       'Content-Type': 'multipart/form-data',
                       'token': localStorage.getItem('token'),
                       'userId': localStorage.getItem('userId')
                   }
               })
                   .then(
                       result => {
                           if (result.data.data == true) {
                                window.location.reload();
                           } else {
                               alert('修改失败');
                               that.getUserMessage();
                           }
                       }
                   );
           }
        }
    },
    created: function () {
        this.getUserMessage();
    }
});