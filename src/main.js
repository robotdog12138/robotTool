import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import axios from 'axios'
import axiosRetry from 'axios-retry';
axiosRetry(axios, {
    retries: 3, //设置自动发送请求次数
    retryDelay: (retryCount) => {
        return retryCount * 1000; //控制重试请求之间的延迟。默认情况下，重试之间没有延迟。
    }
});
axios.defaults.withCredentials = true; //让ajax携带cookie
//axios.defaults.headers.post["Content-Type"] =
//"application/x-www-form-urlencoded;charset=UTF-8";
Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios
Vue.config.productionTip = false
    //复制到粘贴板插件
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')