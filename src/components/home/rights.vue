<template>
<el-card>
     <Breadx one="权限管理" two ="权限列表"/>
     <el-table
      :data="tableData"
      style="width: 100%" class="myTable">
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
       
        label="层级">
        <!-- 根据返回值 scope.row.level    -->
        <template slot-scope="scope">
            <!-- {{scope.row.level==="0"?'一级':scope.row.level==="1"?'二级':'三级'}} -->
            <!-- 方法二 -->
            <span v-if='scope.row.level==="0"'>一级</span>
            <span v-if='scope.row.level==="1"'>二级</span>
            <span v-if='scope.row.level==="2"'>三级</span>
        </template>
      </el-table-column>
    </el-table>
</el-card>
  
</template>

<script>
import Breadx from "@/components/lagout/breadx";
    export default {
    components: {
    Breadx: Breadx
  },
   data() {
        return {
          tableData: []
        }
      },
      methods:{
          getRightList(){
              this.$http({
                  url:'rights/list',
                  method:'get'
              }).then(res=>{
                //   console.log(res);
                  let {meta,data}=res.data
                  if(meta.status==200){
                      this.tableData=data
                  }
              })
          }
      },
      mounted(){
          this.getRightList()
      }
    }
</script>

<style >
.myTable{
    margin-top: 20px;
}
</style>