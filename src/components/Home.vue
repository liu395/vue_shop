<template>
    <div>
        <el-button type="info" @click="ret">退出</el-button>
    </div>
</template>

<script>
export default {
    name:'Home',
    methods:{
        ret(){
            window.sessionStorage.clear()
            this.$router.push('/login');
        }
    }
}
</script>