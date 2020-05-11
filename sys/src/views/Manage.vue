<template>
<div>
    <el-button type="primary" @click="addUser">添加账号</el-button>
    <el-table :data="allUsers" border style="width: 100%;overflow:auto;">
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="roleid" label="用户身份">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.roleid == 1" type="warning">审稿人</el-tag>
                <el-tag v-if="scope.row.roleid == 2">投稿人</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="state" label="用户状态">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.state == 'active'" type="success">正常</el-tag>
                <el-tag v-if="scope.row.state == 'banned'" type="danger">禁用</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                <el-button @click="showInfo(scope.row)" type="primary" size="mini">查看信息</el-button>
                <el-button size="mini" @click="showIDlog(scope.row.id,scope.row.roleid)">修改身份</el-button>
                <el-button type="danger" @click="changeState(scope.row.id,'banned')" size="mini" v-if="scope.row.state == 'active'">禁用账号</el-button>
                <el-button type="success" @click="changeState(scope.row.id,'active')" size="mini" v-else>恢复账号</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加账号的dialog -->
    <el-dialog title="新增账号" :visible.sync="userLog" width="30%">
        <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
            <el-form-item label="账号:" prop="username">
                <el-input type="text" auto-complete="off" v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input type="password" auto-complete="off" v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input type="text" v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码:" prop="phone">
                <el-input type="text" v-model="addForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份" prop="identity">
                <el-select v-model="addForm.identity" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit('addFormRef')">Signup</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 查看信息的dialog -->
    <el-dialog title="账号信息" :visible.sync="infoLog" width="30%">
        <el-form :model="showForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="账号:" prop="username">
                <el-input type="text" auto-complete="off" v-model="showForm.username" readonly></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input type="text" readonly v-model="showForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码:" prop="phone">
                <el-input type="text" readonly v-model="showForm.phone"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="infoLog = false">返回</el-button>
        </span>
    </el-dialog>

    <!-- 修改身份的dialog -->
    <el-dialog title="修改身份" :visible.sync="idLog" width="30%" @close="reset">
        <el-select v-model="identity" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="idLog = false">返 回</el-button>
            <el-button @click="changeIdentity(id,roleid)">确 认</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import code from '../services/encrypt.js'
export default {
    data() {
        var checkIfExist = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9]+$/.test(value)
            if (reg) {
                this.$http.post('/api/users/checkIfExist', value).then(res => {
                    if (res.data.status === 201) { //有必要吗?
                        callback()
                    } else if (res.data.status === 422) {
                        callback(new Error('账号已存在!'))
                    }
                })
            } else {
                callback(new Error('请输入英文字母或数字!'))
            }
        };
        var checkEmail = (rule, value, callback) => {
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址!'))
            }
        };
        var checkPhone = (rule, value, callback) => {
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
        }
        return {
            addForm: {
                username: '',
                password: '',
                email: '',
                phone: '',
                identity: ''
            },
            showForm: {},
            rules: {
                username: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    },
                    {
                        validator: checkIfExist,
                        trigger: 'blur'
                    }
                ],
                email: [{
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                phone: [{
                    validator: checkPhone,
                    trigger: 'blur'
                }]
            },
            options: [{
                value: 1,
                label: '审稿人'
            }, {
                value: 2,
                label: '投稿人'
            }],
            identity: '',
            id: '',
            roleid: '',
            userLog: false,
            infoLog: false,
            idLog: false
        }
    },
    computed: {
        ...mapState(['allUsers'])
    },
    methods: {
        showInfo(info) {
            this.infoLog = true
            this.showForm = info
            // console.log(info)
        },
        showIDlog(id, roleid) {
            this.idLog = true
            this.id = id
            this.roleid = roleid
            this.identity = roleid
        },
        changeIdentity() {
            if (this.identity != '') {
                this.$http.get(`/api/users/changeIdentity/${this.id}/${this.identity}`).then(res => {
                    // console.log(res)
                    if(res.data.status === 200){
                        //身份修改成功
                        this.$store.dispatch('asyncGetUsers', this.$store.state.userInfo.roleid);
                        this.idLog = false;
                    }else{
                        this.$message.error('身份修改失败!请检查网络')
                    }
                })
            }else{
                this.$message.warning('请选择需要修改的身份!')
                return 
            }
            // console.log(this.identity, this.id)
            // this.id = ''
            // this.roleid = ''
        },
        reset() {
            this.identity = ''
        },
        changeState(id,op) {
            this.$http.get(`/api/users/changeState/${id}/${op}`).then(res => {
                if (res.data.status === 200) {
                    this.$store.dispatch('asyncGetUsers', this.$store.state.userInfo.roleid);
                    this.$message.success('操作成功!')
                } else {
                    this.$message.error('操作失败!')
                }
            })
        },
        addUser() {
            this.userLog = true
        },
        submit(ref) {
            // console.log(ref,this.$refs.addFormRef.validate)
            this.$refs.addFormRef.validate((valid) => {
                if (valid) {
                    let encrypted = code.encryptFunc(this.addForm.password)
                    this.$http.post('/api/users/regis', {
                        "username": this.addForm.username,
                        "password": encrypted,
                        "email": this.addForm.email,
                        "phone": this.addForm.phone,
                        "identity": this.addForm.identity
                    }).then(res => {
                        // console.log(res)
                        if (res.data.affectedRows === 1) { //判断依据好吗?
                            this.$store.dispatch('asyncGetUsers', this.$store.state.userInfo.roleid);
                            this.userLog = false
                            //怎么改变isActive?
                        } else {
                            this.$message.error('注册失败')
                        }
                    })
                }
            })
        }
    },
    created() {
        this.$store.dispatch('asyncGetUsers', this.$store.state.userInfo.roleid);
    },
}
</script>

<style scoped>
.el-table {
    height: 100%;
}
</style>
