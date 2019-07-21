<template>
  <el-card>
    <Breadx one="商品管理" two="商品分类"/>
    <el-button type="success" plain class="myBtn1" @click.prevent="cateAdd">添加分类</el-button>
    <el-table :data="pagelist" border>
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        prop="cat_name"
        label="分类名称"
        width="220"
      ></el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->

          {{scope.row.cat_level===0?'一级':scope.row.cat_level===1?'二级':"三级"}}
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->

          {{scope.row.cat_deleted ?"无效":"有效"}}
        </template>
      </el-table-column>
       <el-table-column label="操作" >
        <template slot-scope="scope">
         

          <el-row>
               {{scope.row.cat_id}}
            <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>

            <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          </el-row>
         
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="cChange"
      @size-change="sChange"
    ></el-pagination>
    <el-dialog title="添加商品分类" :visible.sync="dialogCate">
  <el-form >
    <el-form-item label="分类名称" :label-width="formLabelWidth">
      <el-input  autocomplete="off" v-model="catName"></el-input>
    </el-form-item>
    <el-form-item label="分类名称" :label-width="formLabelWidth">
     {{setvalue}}
       <el-cascader
       v-model="setvalue"
    :options="optionData"
    :props="{ expandTrigger: 'hover' ,label:'cat_name',value:'cat_id',checkStrictly : true}"
    >
    </el-cascader>
    </el-form-item>
    
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogCate = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </div>
</el-dialog>
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
      menus: [],
      pagelist: [],
      pagenum: 1,
      pagesize: 5,
      pagesizes: [5, 10, 15],
      total: 0,
      formLabelWidth:"100px",
      dialogCate:false,
      optionData:[],
     catName:'',
      setvalue:[]


    };
  },
  methods: {
    getCategories() {
      this.$http({
        url: `categories?type=3`,
        method: "get"
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.menus = data;
          this.total = this.menus.length;
          this.getPagenumlist();
        }
      });
    },
    getPagenumlist() {
      let start = (this.pagenum - 1) * this.pagesize;
      let end = this.pagesize * this.pagenum - 1;
      this.pagelist = this.menus.slice(start, end);
      //    console.log(this.menus);
    },
    cChange(currentPage) {
      this.pagenum = currentPage;
      //   console.log( this.pagenum);
      this.getPagenumlist();
    },
    sChange(pageSize){
        this.pagesize=pageSize
         this.getPagenumlist();
    },
    cateAdd(){
        this.dialogCate=true
        this.$http({
            method:'get',
            url:'categories?type=2'
        }).then(res=>{
            let{meta,data}=res.data
            if(meta.status==200){
                this.optionData=data
            }
            
                    })
    },
    addCate(){
      this.$http({
        method:'post',
        url:'categories',
        data:{
          cat_pid:this.setvalue[this.setvalue.length-1]>0?this.setvalue[this.setvalue.length-1]:0,
          cat_name:this.catName,
          cat_level:this.setvalue.length
        }
      }).then(res=>{
      //  console.log(res);
        let{ meta,data}=res.data
        if(meta.status==201){
           this.getCategories();
           this.dialogCate=false
       this.$message({
         message:meta.msg,
         type:'success'
       })
        }else{
          this.$message.error(meta.msg)
        }
        
      })
    }
  },
  mounted() {
    this.getCategories();
  }
};
</script>

<style  scoped>
.myBtn1 {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>