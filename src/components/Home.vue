<template>
    <!-- 主页布局 -->
        <el-container class="homecontainer">
            <el-header>
                <div>
                    <img src="../assets/home_logo.jpeg" alt="">
                    <span>后台管理系统</span>
                </div>
                <el-button type="info" @click="ret">退出</el-button>
            </el-header>
            <!-- 侧边栏 -->
            <el-container>
               <el-aside :width="iscollapse ? '64px': '200px' ">
                   <div class="toggle" @click="istoggle">|||</div>
                   <el-menu 
                   :default-active="active"
                   router
                   :collapse-transition="false"
                   :collapse="iscollapse"
                   unique-opened
                   background-color="#333744"
                   text-color="#fff"
                   active-text-color="#409eff">  
                       <el-submenu :index="item.id+''" v-for="item in menu" :key="item.id">
                        <template slot="title">
                           <i :class="iconList[item.id]"></i>
                           <span>{{item.authName}}</span>
                        </template>


                        <el-menu-item :index="'/'+i.path" 
                        v-for="i in item.children" :key="i.id"
                        @click="menuClick('/'+i.path)">
                           <i class="el-icon-menu"></i>
                           <template slot="title">{{i.authName}}</template>
                        </el-menu-item>
                      </el-submenu>
                </el-menu>
               </el-aside>
               <el-main>
                   <router-view></router-view>
               </el-main>
            </el-container>
        </el-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return{
            menu:[],
            iconList:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            iscollapse:false,
            active:''
        }
    },
    created(){
        this.menuList()
        this.active=window.sessionStorage.getItem('active')
    },
    methods:{
        ret(){
            window.sessionStorage.clear()
            this.$router.push('/login');
        },
        async menuList(){
            // 请求菜单数据
            const {data:res}=await this.$http.get('menus')
            // 判断请求成功还是失败
            if(res.meta.status!==200) return this.$message.error(res.meta.msg);
            // 将获取的数据绑定到组件的数据中
            this.menu=res.data
            // console.log(res);
        },
        istoggle(){
            this.iscollapse=!this.iscollapse
        },
        menuClick(active){
            window.sessionStorage.setItem('active',active)
            this.active=active
        }
    },
    
}
</script>

<style lang="less" scoped>
     .toggle{
         background-color: #4A5064;
         font-size: 10px;
         line-height: 24px;
         color: #fff;
         text-align: center;
         letter-spacing: 0.2em;
         cursor: pointer;
     }
     .el-menu{
         border-right: 0;
     }
     .iconfont{
         margin-right: 10px;
     }
     .el-header{
        //  background-color: #373d41;
        background: url('../assets/home_banner.jpeg') no-repeat;
        background-size: 100% ;
        display: flex;
        justify-content: space-between;
        padding-right: 0;
        padding-left: 0;
        >div{
            color: #fff;
            font-size: 20px;
            display: flex;
            align-items: center;
            img{
                width: 60px;
                height: 100%;
            }
        }
     }
     .el-aside{
         background-color: #333744;
     }
     .el-main{
         background-color: #eaedf1;
     }
     .homecontainer{
         height: 100%;
     }
</style>