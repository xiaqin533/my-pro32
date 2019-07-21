<template>
   <el-aside width="200px">
        <!--  el-menu:菜单栏  动态生成菜单栏-->
        <el-menu
          class="el-menu-vertical-demo"
          :unique-opened="true"
          :router="true"
          :collapse-transition="true">
          <!-- el-submenu:选项  index:当前选项的唯一标识(跳转路径) -->
          <el-submenu v-for="item in rightList" :key="item.id" :index="item.path">
            <!-- template :菜单选项内容 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="son in item.children" :key="son.id" :index="son.path">
              <i class="el-icon-menu"></i>{{son.authName}}
            </el-menu-item>
          </el-submenu>
          
        </el-menu>
      </el-aside>
</template>

<script>
    export default {
        data(){
          return{
            rightList:[]
          }
        },
        methods: {
          getRightList(){
            this.$http({
              url:'menus'
            }).then(res=>{
              // console.log(res);
              let{meta,data}=res.data
              if(meta.status==200){
                this.rightList=data
              }else{
                this.$message.error(meta.msg)
              }
              
            })
          }
        },
        mounted() {
          this.getRightList()
        },
    }
</script>

<style >

</style>