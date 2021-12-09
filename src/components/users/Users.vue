<template>
    <div>
        <!-- 导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
           <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
           <el-breadcrumb-item>用户管理</el-breadcrumb-item>
           <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
              <el-col :span="8">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getUserList">
                      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                 <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
              </el-col>
            </el-row>

            <!-- 表格展示区域 -->
            <el-table :data="userList" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scop">
                        <el-switch v-model="scop.row.mg_state" @change="stateChange(scop.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" 
                        icon="el-icon-edit" 
                        size="mini"
                        @click="changUser(scope.row.id)">
                        </el-button>
                        <el-button type="danger" 
                        icon="el-icon-delete" 
                        size="mini"
                        @click="deleteUser(scope.row.id)">
                        </el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>       
                    </template>
                </el-table-column>
            </el-table> 
            <!-- 分页 -->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
        </el-card>

         <!-- 添加用户对话框 -->
        <el-dialog
        @close="closeDialog"
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
               <el-form-item label="用户名" prop="username">
                 <el-input v-model="ruleForm.username"></el-input>
               </el-form-item>

               <el-form-item label="密码" prop="password">
                 <el-input v-model="ruleForm.password"></el-input>
               </el-form-item>

               <el-form-item label="邮箱" prop="email">
                 <el-input v-model="ruleForm.email"></el-input>
               </el-form-item>

               <el-form-item label="手机号" prop="mobile">
                 <el-input v-model="ruleForm.mobile"></el-input>
               </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
               <el-button @click="dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑用户对话框 -->
        <el-dialog
        @close="closeEditDialog"
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
               <el-form-item label="用户名" prop="username">
                 <el-input v-model="editForm.username" disabled></el-input>
               </el-form-item>

               <el-form-item label="邮箱" prop="email">
                 <el-input v-model="editForm.email"></el-input>
               </el-form-item>

               <el-form-item label="手机号" prop="mobile">
                 <el-input v-model="editForm.mobile"></el-input>
               </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
               <el-button @click="editDialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name:'Users',
    data(){
        var checkEmail=(rule,value,cb)=>{
            // 验证邮箱的正则表达式
            const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        var checkPhone=(rule,value,cb)=>{
            // 验证手机的正则表达式
            const regPhone=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regPhone.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:1
            },
            userList:[],
            total:0,
            dialogVisible:false,
            editDialogVisible:false,
            ruleForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            rules:{
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { validator:checkEmail,trigger:'blur' }
                ],
                mobile: [
                  { required: true, message: '请输入手机号', trigger: 'blur' },
                  { validator:checkPhone,trigger:'blur' }
                ],
            },
            editFormRules:{
                email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { validator:checkEmail,trigger:'blur' }
                ],
                mobile: [
                  { required: true, message: '请输入手机号', trigger: 'blur' },
                  { validator:checkPhone,trigger:'blur' }
                ],
            },
            editForm:{}
        }
    },
    created(){
        this.getUserList() 
    },
    methods:{
        async getUserList(){
            const {data:res}=await this.$http.get('users',{params:this.queryInfo})
            // console.log(res);
            if(res.meta.status!==200) return this.$message.error('获取用户列表失败！')
            this.userList=res.data.users
            this.total=res.data.total
        },
        handleSizeChange(newSize){
            // console.log(newSize);
            this.queryInfo.pagesize=newSize
            this.getUserList()
        },
        handleCurrentChange(newPage){
            // console.log(newPage);
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        async stateChange(userInfo){
            // console.log(userInfo);
            const {data:res}=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if(res.meta.status!==200) {
                userInfo.mg_state=!userInfo.mg_state
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('更新用户状态成功！')
        },
        closeDialog(){
            // console.log(this);
            this.$refs.ruleForm.resetFields()
        },
        closeEditDialog(){
            this.$refs.editFormRef.resetFields()
        },
        addUser(){
            this.$refs.ruleForm.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.post('users',this.ruleForm)
                if(res.meta.status!==201) return this.$message.error('添加用户失败！')
                this.$message.success('添加用户成功！')
                this.dialogVisible=false
                this.getUserList()
            }) 
        },
        async changUser(id){
            const {data:res}=await this.$http.get('users/'+id)
            if(res.meta.status!==200) return this.$message.error('查询用户信息失败！')
            this.editForm=res.data
            this.editDialogVisible=true
        },
        editUser(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                })
                if(res.meta.status!==200) return this.$message.error('修改用户信息失败！')
                this.$message.success('修改用户信息成功！')
                this.getUserList()
            })
            this.editDialogVisible=false
        },
        async deleteUser(id){
            const res=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
            }).catch(err=>err) 
            if(res!=='confirm'){
                return this.$message.info('已经取消删除！')
            }
            const {data:res1}=await this.$http.delete('users/'+id)
            if(res1.meta.status!==200) return this.$message.error('删除用户失败！')
            this.$message.success('删除用户成功！')
            this.getUserList()
        },
    } 
}
</script>