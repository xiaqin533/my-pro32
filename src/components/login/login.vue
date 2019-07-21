<template>
  <div class="login">
   <div class="box">
    <h2>用户登录</h2>
    <!-- el-form 表单管理容器 :rules="rules"设置验证规则  status-ico 显示图标   label-width:显示文本宽度 -->
      <el-form :model="userObj" :rules="rules" status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="top" >
        <!-- el-input :element中的表单元素 -->
  <el-form-item label="用户名" prop='username'>
    <el-input type="text" v-model="userObj.username"  ></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="password" > 
    <el-input type="password" v-model="userObj.password" @keyup.enter.native="login" ></el-input>
  </el-form-item>
 
  <el-form-item>
    <el-button type="primary"  class="my-btn" @click.prevent="login">登录</el-button>
    
  </el-form-item>
</el-form>
   </div>
   
  </div>
</template>


<script>
  export default {
   data(){
     return {
       userObj:{
         username:"",
         password:""
       },
         rules: {
          username: [
            // required  :当前属性是必须的
            // message:  如果不填会出现的提示信息
            // trigger: 触发这个规则的时间  blur  失去焦点
            { required: true, message: '请输入用户名', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],}
     }
   },
   methods:{
    //  登录
     login(){
      //  表单验证
      // 参数
      // valid :如果存在说明验证通过,不存在说明验证失败
       this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // alert('submit!');
            //  console.log(this.userObj);
      this.$http({
        method:"post",
        url:'login',
        data:this.userObj,

       }).then(res=>{
        //  console.log(res);
        let {data,meta}=res.data
        if(meta.status===200){
          // 需要放在路由之前
          window.localStorage.setItem('token',data.token)
          // 登录成功
          this.$router.push('/')
          // 将  token 保存在本地的localStorage
          
          this.$message({
             showClose: true,
            message:meta.msg,
            type: 'success'
            });

        }else{
          // console.log(meta.msg);
           this.$message({
          showClose: true,
          message: meta.msg,
          type: 'error'
        });
        }
         
       }).catch(err=>{
         console.log(err);
         
       })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
       
     }
   }
  }
</script>
<style >


  .login{
    width: 100%;
    height: 100%;
background-color: #324152;
position: relative;
  }
  .box{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 580px;
    height: 440px;
    background-color: #fff;
    border-radius: 5px;
    padding:40px;
    box-sizing: border-box;
  }
    .my-btn{
      width: 100%;
    }
</style>