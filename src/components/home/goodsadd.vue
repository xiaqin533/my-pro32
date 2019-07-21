<template>
  <el-card>
    <Breadx one="商品管理" two="商品列表"/>
    <el-alert class="myAlert" title="消息提示的文案" type="info" center show-icon></el-alert>
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs @tab-click="tagclick" v-model="activeName" tab-position="left">
      <el-tab-pane label="基本信息" name="first">
        <el-form
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="商品名称" prop="name" >
            <el-input v-model="goodsList.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price" >
            <el-input v-model="goodsList.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="weight" >
            <el-input v-model="goodsList.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="count" >
            <el-input v-model="goodsList.goods_number"></el-input>
          </el-form-item>

          <el-form-item label="商品类别" prop="cate" >
            {{setvalue}}
            <el-cascader
              clearable
              v-model="setvalue"
              :options="optionData"
              :props="{ expandTrigger: 'hover' ,label:'cat_name',value:'cat_id',checkStrictly : true}"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div v-for="item in cateMang" :key="item.attr_id">
          <div class="box">{{item.attr_name}}</div>
          <div>
            <el-checkbox
              v-for="(val,index) in item.attr_vals.split(',')"
              :key="index"
              v-model="checked1"
              border
            >{{val}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <el-form
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
          v-for="(val1,index) in cateOnly"
          :key="index"
        >
          <el-form-item :label="val1.attr_name">
            <el-input v-model="val1.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handlePreview"
          :on-remove="handleRemove"
          :on-preview="myclick"
          list-type="picture"
          :headers="header"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          {{fileList}}
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="five">
        <el-button type="primary" @click.prevent="addGoods">添加商品</el-button>
        <quill-editor v-model="content" ref="myQuillEditor" class="myquill"></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="图片信息" :visible.sync="imgdialog">
      <img src ref="myimg" alt class="myImg">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="imgdialog = false">确 定</el-button>
      </span>
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
      // 步骤条的激活下标
      active: 0,
      activeName: "first",
      rules: {
        
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        count: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        cate: [{ required: true, message: "请选择商品类别", trigger: "blur" }]
      },
      ruleForm: [],
      setvalue: [],
      optionData: [],
      sel: ["only", "many"],
      cateMang: [],
      cateOnly: [],
      checked1: true,
      fileList: [],
      imgdialog: false,
      content: "",
      header: {
        Authorization: window.localStorage.getItem("token")
      },
      goodsList: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      }
    };
  },
  methods: {
    tagclick(tag) {
      //  console.log(tag);
      // 让步骤条与tag 同步
      this.active = +tag.index; //隐式转换
      if (tag.index == "1") {
        this.getCategories(1);
      }
      if (tag.index == "2") {
        this.getCategories(0);
      }
    },

    // 渲染级联框的数据
    getcatelist() {
      this.$http({
        url: "categories?type=3"
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status == 200) {
          this.optionData = data;
        }
      });
    },
    getCategories(idx) {
      if (this.setvalue.length == 0) {
        this.$message.error("请选择商品分类");
      } else {
        this.$http({
          url: `categories/${
            this.setvalue[this.setvalue.length - 1]
          }/attributes?sel=${this.sel[idx]}`
        }).then(res => {
          // console.log(res);

          let { meta, data } = res.data;
          if (meta.status == 200) {
            if (idx == 1) {
              this.cateMang = data;
            }
            if (idx == 0) {
              this.cateOnly = data;
            }
          } else {
            this.$message.error(meta.msg);
          }
        });
      }
    },
    // 图片上传成功后执行的函数
    handlePreview(response, file, filelist) {
      // console.log(response);
      this.fileList.push(response.data.tmp_path);
    },
    // 图片删除后执行的函数
    handleRemove(file, fileList) {
      // console.log(file);
      let img = file.response.data.tmp_path;
      this.fileList.forEach((item, index) => {
        if (item == img) {
          this.fileList.splice(index, 1);
        }
      });
    },
    myclick(file) {
      // console.log(file);
      // console.log(123);
      var img = file.response.data.url;
      // console.log(img);
      this.imgdialog = true;
      //       setTimeout(()=>{
      // this.$refs.myimg.src=img
      //       },1000)
      this.$nextTick(function() {
        this.$refs.myimg.src = img; // => 'updated'
      });
    },
    addGoods(){
      this.goodsList.goods_cat=this.setvalue.join(',')
      this.$http({
        method:'post',
        url:'goods',
        data:{
          ...this.goodsList,
          goods_introduce:this.content
        }
      }).then (res=>{
        // console.log(res);
        let {data,meta}=res.data
        if(meta.status==201){
          this.$message.success(meta.msg)
          this.$router.push("/goods")
        }else{
          this.$message.error(meta.msg)
        }
        
      })
    }
  },
  mounted() {
    this.getcatelist();
  }
};
</script>

<style scoped>
div.el-step__title {
  font-size: 12px;
}
.myAlert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.box {
  margin-top: 20px;
  margin-bottom: 20px;
}
.myImg {
  width: 100%;
  height: 100%;
}
.myquill {
  height: 500px;
}
</style>