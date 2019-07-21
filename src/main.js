// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/css/index.css'
import myaxios from '@/assets/js/axios.js'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
// 引入时间插件
import moment from 'moment'
import ElTreeGrid from 'element-tree-grid'
// 引用富文本插件
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts 

Vue.use(VueQuillEditor)
Vue.use(ElementUI);
Vue.use(myaxios);



//定义一个全局过滤器实现日期格式化
Vue.filter('datafmt',function (input,fmtstring) {
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment(input).format(fmtstring);
});
Vue.prototype.$http=axios
Vue.config.productionTip = false
Vue.component(ElTreeGrid.name,ElTreeGrid);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
