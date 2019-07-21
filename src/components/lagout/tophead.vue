<template>
   <el-row>
        <el-col :span="6">
          
        </el-col>
        <el-col :span="12">
          <h2 class="my-h2">电商管理系统</h2>
        </el-col>
        <el-col :span="6">
          <a href="#" class="mylink" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
</template>

<script>
    export default {
        methods: {
          logout(){
            this.$confirm('此操作将退出当前登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //  以 name 为跳转路径
            this.$router.push({name:"login"})
            // 清楚登录时保存的  token
            window.localStorage.removeItem("token")
          this.$message({
            type: 'success',
            message: '退出成功!',
           
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
           
          }
        },
    }
</script>

<style>

</style>