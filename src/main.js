import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import { Message } from "element-ui";
import router from "./router";
import axios from "axios";
import axiosRetry from "axios-retry";
axiosRetry(axios, {
    retries: 0, //设置自动发送请求次数
    retryDelay: (retryCount) => {
        return retryCount * 1000; //控制重试请求之间的延迟。默认情况下，重试之间没有延迟。
    },
});

//axios.defaults.withCredentials = true; //让ajax携带cookie
axios.defaults.baseURL = "https://service-jrik2ub3-1252639209.bj.apigw.tencentcs.com/release/";
// axios.defaults.baseURL = "http://localhost:9000/";
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";
const codeMessage = {
    200: "服务器成功返回请求的数据。",
    201: "新建或修改数据成功。",
    202: "一个请求已经进入后台排队（异步任务）。",
    204: "删除数据成功。",
    400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
    401: "用户没有权限（令牌、用户名、密码错误）。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器。",
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
};
// http request 拦截器
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
// http response 拦截器
axios.interceptors.response.use(
    (response) => {
        // if (response.status == 200 && response.data.result) {
        // } else {
        //   Message.error(response.data.desc || "失败，请检查");
        // }
        //拦截响应，做统一处理
        return response;
    },
    //接口错误状态处理，也就是说无响应时的处理
    (error) => {
        if (error === undefined || error.code === "ECONNABORTED") {
            Message.warning("服务请求超时");
            return Promise.reject(error);
        }
        const {
            response: {
                status,
                statusText,
                data: { msg = "服务器发生错误" },
            },
        } = error;
        //const { response } = error
        const text = codeMessage[status] || statusText || msg;
        Message.error(`${status}:${text}`);
        //Message({ message: error, type: "error" });
        return Promise.reject(error); // 返回接口返回的错误信息
    }
);
Vue.prototype.$axios = axios; //全局注册，使用方法为:this.$axios
Vue.config.productionTip = false;
//复制到粘贴板插件
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");