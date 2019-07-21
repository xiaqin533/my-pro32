// 创建一个  axios  插件
// 引入  axios
import axios from 'axios'
var myaxios={};

myaxios.install=function (Vue) {
    axios.defaults.baseURL="http://localhost:8888/api/private/v1/";
   

    axios.interceptors.request.use(function (config) {//config 奔驰请求相关信息
        // 拦截器
        // console.log('-------------拦截器-------------');
        // console.log(config.headers.Authorization);
       
        if(!config.url.includes('login')){
            config.headers.Authorization=window.localStorage.getItem("token")
        }
        return config
    })
    // 添加实例方法
    Vue.prototype.$http=axios
}
// 暴露
export default myaxios 