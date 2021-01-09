const updatePassword = new Vue({
    el: '#updatePassword',
    data: {
        password: null,
        newPassword: null,
        surePassword: null,
        updateFlag: false,
        updateMessage: '',
        readonly: true,
        pwFlag1: false,
        pwFlag2: false
    },
    methods: {
        checkPassword() {
            let password = this.password;
            let that = this;

            if (password != null && password != '') {
                let formData = new FormData();
                formData.append('password', password);
                axios.post(txqIP + '/user/front/private/checkPassword', formData,
                    {headers: {'userId': localStorage.getItem('userId'), 'token': localStorage.getItem('token')}})
                    .then(function (result) {
                        if (result.data.data == true) {
                            that.pwFlag1 = true;
                            that.pwFlag2 = false;
                            that.readonly = false;
                        } else {
                            that.pwFlag1 = false;
                            that.pwFlag2 = true;
                            that.readonly = true;
                        }
                    });
            } else {
                that.readonly = true;
            }
        },
        updatePassword() {
            let that = this;
            that.newPassword = that.newPassword == null ? that.newPassword :that.newPassword.trim();
            let newPassword = that.newPassword;
            let surePassword = that.surePassword;

            if (newPassword != null && newPassword != '' && surePassword != null && surePassword != '') {
                if (newPassword.length >= 6 && newPassword.length <= 12) {
                    if (newPassword == surePassword) {
                        that.updateFlag = false;
                        that.updateMessage = '';
                        let formData = new FormData();
                        formData.append('password', newPassword);
                        axios.post(txqIP + '/user/front/private/updatePassword', formData,
                            {headers: {'userId': localStorage.getItem('userId'), 'token': localStorage.getItem('token')}})
                            .then(function (result) {
                                if (result.data.data == true) {
                                    alert('修改成功！');
                                    that.clearForm();
                                } else {
                                    alert('修改失败')
                                }
                            });
                    } else {
                        that.updateFlag = true;
                        that.updateMessage = '两次输入密码不一致';
                    }
                } else {
                    that.updateFlag = true;
                    that.updateMessage = '密码长度需在6-12之间';
                }
            } else {
                that.updateFlag = true;
                that.updateMessage = '请将信息填写完整';
            }
        },
        clearForm() {
            this.password=null;
            this. newPassword=null;
            this.surePassword=null;
            this.updateFlag=false;
            this.updateMessage= '';
            this.readonly= true;
            this.pwFlag1= false;
            this.pwFlag2=false;
        }
    },
    watch: {
        password: function (newValue) {
            this.checkPassword();
        }
    }
});