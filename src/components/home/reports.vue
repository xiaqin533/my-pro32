<template>
  <el-card>
    <Breadx one="商品管理" two="商品分类" />
    <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
  </el-card>
</template>

<script>
import Breadx from "@/components/lagout/breadx";
export default {
    components: {
    Breadx: Breadx
  },
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
  

    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
        var  myChart = this.$echarts.init(document.getElementById("myChart"));
      // 基于准备好的dom，初始化echarts实例
      this.$http({
          url:'reports/type/1'
      }).then(res=>{
       
       res.data.data.xAxis[0].boundaryGap= false
       res.data.data.grid={
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
       var options=res.data.data
        myChart.setOption(options)
        
          
      })
      
      // 绘制图表

    }
}
}
</script>

<style  scoped>
#myChart {
  margin-top: 20px;
}
</style>