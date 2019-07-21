<template>
  <!-- 页面操作未做 -->
  <el-card>
    <Breadx one="商品管理" two="商品列表"/>
    <el-row class="myRow1">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="query"
          @keyup.enter.native="searchQuery"
        >
          <el-button slot="append" icon="el-icon-search" @click.prevent="searchQuery"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4" class="myCol1">
        <el-button type="success" plain @click="$router.push('/goodsadd')">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量(kg)"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">{{scope.row.upd_time|datafmt('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column prop="date" label="操作">
        <template slot-scope="scope">
          {{scope.row.goods_id}}
          <el-row>
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
  </el-card>
</template>

<script>
// 导入面包屑导航组件
import moment from "moment";
import Breadx from "@/components/lagout/breadx";
export default {
  components: {
    Breadx: Breadx
  },
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 10,
      pagesizes: [10, 20, 30],
      total: 0
    };
  },
  methods: {
    getCateList() {
      this.$http({
        method: "get",
        url: `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      }).then(res => {
        // console.log(res);
        let { data, meta } = res.data;
        if (meta.status == 200) {
          this.tableData = data.goods;
          this.total = data.total;
        }
      });
    },
    cChange(currentPage) {
      this.pagenum = currentPage;
      this.getCateList();
    },
    sChange(pageSize) {
      this.pagesize = pageSize;
      this.getCateList();
    },
    searchQuery() {
      this.getCateList();
    },
    
  },
  mounted() {
    this.getCateList();
  }
}
</script>

<style  scoped>
/* 设置  scoped   让样式只在当前组件起作用 */
.myRow1 {
  margin-top: 10px;
}
.myCol1 {
  margin-left: 5px;
}
</style>