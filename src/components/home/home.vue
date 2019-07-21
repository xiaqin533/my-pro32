<template>
  <el-container>
    <el-header>
      <TopHead></TopHead>
    </el-header>
    <el-container>
      <SideBar/>
      <el-main>
       <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TopHead from "@/components/lagout/tophead"
import SideBar from "@/components/lagout/sidebar"
export default {
  components:{
    TopHead:TopHead,
    SideBar:SideBar 
  },
  mounted(){
    let token=window.localStorage.getItem("token")
    // console.log(token);
    
    if(!token){
      this.$message({
         type: 'warning',
         message: '您还没有登录'
      })
      this.$router.push({name:'login'})
    }
  }
};
</script>

<style >
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
  height: 100%;
}
.el-container {
  height: 100%;
}
h2.my-h2 {
  margin: 0;
  color: #fff;
}
.el-header .mylink {
  text-decoration: none;
  color: green;
  float: right;
}
</style>