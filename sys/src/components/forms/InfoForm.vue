<template>
<el-form ref="infoFormRef" :model="infoForm" label-width="100px" :inline="true" style="margin-top:15px;" :rules="rules">
    <el-form-item label="作者姓名:" prop="name">
        <el-input type="text" v-model="infoForm.name" placeholder="请输入您的姓名"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="infoForm.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
        </el-radio-group>
    </el-form-item><br>
    <el-form-item label="电子邮箱:" prop="email">
        <el-input v-model="infoForm.email" placeholder="请输入您的电子邮箱"></el-input>
    </el-form-item>
    <el-form-item label="联系电话:" prop="phone">
        <el-input v-model="infoForm.phone" maxlength="11" placeholder="请输入您的联系电话"></el-input>
    </el-form-item><br>
    <el-form-item label="联系地址:" prop="address">
        <el-input type="textarea" v-model="infoForm.address" autosize style="width:100%;" placeholder="请输入您的联系地址"></el-input>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    name: "InfoForm",
    data() {
        var nameCheck = (rule, value, callback) => {
            let nameReg = /^[\u4e00-\u9fa5]{2,6}$/
            if (nameReg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的姓名!'))
            }
        };
        var phoneCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号码'))
            } else {
                const regPhone = /^1[3456789]\d{9}$/
                if (regPhone.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号码!'))
                }
            }
        };
        var mailCheck = (rule, value, callback) => {
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址!'))
            }
        };
        return {
            infoForm: {
                name: '',
                gender: '',
                email: '',
                phone: '',
                address: ''
            },
            rules: {
                name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    },
                    {
                        validator: nameCheck,
                        trigger: 'blur'
                    }
                ],
                gender: [{
                    required: true,
                    message: '请选择性别',
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    message: '请输入电子邮箱',
                    trigger: 'blur'
                }, {
                    validator: mailCheck,
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入联系电话',
                    trigger: 'blur'
                }, {
                    validator: phoneCheck,
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请输入联系地址',
                    trigger: 'blur'
                }]
            }
        }
    }
}
</script>
