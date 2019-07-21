<template>
    <el-card>
 <Breadx one="商品管理" two="分类参数"/>
 <el-alert
    title=""
    type="warning" class="myAlert1">
    <i class="el-icon-warning">
        
    </i>
    注意:只允许为第三级分类设置相关参数
  </el-alert>
  
    </el-card>
</template>

<script>
   import Breadx from "@/components/lagout/breadx";
export default {
  components: {
    Breadx: Breadx
  },
  data(){
      return {
          model:[

          ]
      }
  }
    }
</script>

<style  scoped>
.myAlert1{
    font-size: 20px;
    line-height: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
}
.myAlert1 i{
    font-size: 20px;
}
</style>