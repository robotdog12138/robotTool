<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px" v-if="!jsid">
            <el-alert
            title="本页面仅供测试，学习交流使用，仅用于个人学习研究，请勿用于非法用途。若因使用本页面引起各类民事，刑事纠纷，属使用者的个人行为，与作者无关。"
            type="warning" show-icon :closable="false">
          </el-alert>
            <el-form-item label="网址">
                <el-input v-model="form.url" placeholder="请输入获取的网址"></el-input>
            </el-form-item>
            <el-form-item label="想要兑换">
                <el-input placeholder="8599 20e卡;8600 100话费" v-model="form.standardId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即兑换</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import JSEncrypt from "../plugins/jsencrypt.min.js";
// @ is an alias to /src
export default {
  data() {
    return {
      jsid: "",
      baseUrl: "https://hemi.lianhaikeji.com",
      form: {
        url:
          "https://hemi.lianhaikeji.com/plus/ead1a0d9/?code=KEY_JWT_CODE724017910443958272#/assets",
        standardId: "8599"
      },
      src: require("../assets/message.mp3"),
      actId: "589440286", //商户号
      merchantId: "",
      phone: "",
      jwt: ""
    };
  },
  name: "chadan",
  components: {},
  methods: {
    getUrlKey(url, name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
            url
          ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    //获取token(一个网址只有一次机会)
    getTokenByCode(code) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this
          .$axios({
            // `url` 是用于请求的服务器 URL
            url: _this.baseUrl + "/front/api/getTokenByCode?code=" + code,
            // `method` 是创建请求时使用的方法
            method: "GET" // default
          })
          .then(function(res) {
            //console.log(res.status)
            if (res.status === 200) {
              if (res.data.message) {
                resolve(res.data);
              } else {
                reject({ message: "请求出错：" + res.data.error });
              }
            } else {
              reject({ message: "网络链接失败：状态码:" + res.status });
            }
          })
          .catch(function(error) {
            reject({ message: "error", error: error });
          });
      });
    },
    createTimerOrder() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.createOrder(resolve, reject);
      });
    },
    setcodeToStorage() {
      let _this = this;
      _this.merchantId = sessionStorage.getItem("merchantId");
      _this.phone = sessionStorage.getItem("phone");
      _this.jwt = sessionStorage.getItem("jwt");
      return new Promise(function(resolve, reject) {
        if (_this.jwt === null || _this.jwt === undefined || _this.jwt === "") {
          //获取网址token
          let code = _this.getUrlKey(_this.form.url, "code");
          _this
            .getTokenByCode(code)
            .then(res => {
              if (res.message === "success") {
                _this.merchantId = res.payload.cust.merchantId;
                _this.phone = res.payload.cust.tel;
                _this.jwt = res.payload.jwt;
                //设置缓存。
                sessionStorage.setItem("merchantId", _this.merchantId);
                sessionStorage.setItem("phone", _this.phone);
                sessionStorage.setItem("jwt", _this.jwt);
                resolve();
              } else {
                reject();
              }
            })
            .catch(function(res) {
              console.log(res);
              _this.open(res.message, "error");
            });
        } else {
          resolve();
        }
      });
    },
    createOrder(resolve, reject) {
      let _this = this;
      _this
        .$axios({
          // `url` 是用于请求的服务器 URL
          url: _this.baseUrl + "/front/api/createOrder",
          // `method` 是创建请求时使用的方法
          method: "POST", // default
          //params: param,
          headers: {
            merchantId: _this.merchantId,
            Authorization: _this.jwt
          },
          data: {
            actId: _this.actId,
            standardId: _this.form.standardId,
            commodityNum: 1,
            account: _this.phone
          },
          // 如果请求话费了超过 `timeout` 的时间，请求将被中断
          timeout: 10000
        })
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.success) {
              resolve(res.data);
            } else {
              _this.$notify({
                title: "提示",
                message: res.data.error,
                duration: 4000,
                type: "warning"
              });
              _this.fnTime().then(() => {
                _this.createOrder(resolve, reject);
              });
              //_this.msg = res.errorMsg;
              //resolve({ message: "请求出错：" + res.data.error });
            }
          } else {
            //reject({ message: "网络链接失败：状态码:" + res.status });
            _this.$notify({
              title: "提示",
              message: "网络链接失败：状态码:" + res.status,
              duration: 4000,
              type: "error"
            });
            _this.fnTime().then(() => {
              _this.createOrder(resolve, reject);
            });
          }
        })
        .catch(function(error) {
          error => {
            // The first request fails
            error !== undefined;
          };
          _this.$notify({
            title: "提示",
            message: error,
            duration: 4000,
            type: "error"
          });
          _this.fnTime().then(() => {
            _this.createOrder(resolve, reject);
          });
          //reject({ message: "error", error: error });
        });
    },
    //定时器
    fnTime() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 2000);
      });
    },
    onSubmit() {
      let _this = this;
      _this
        .setcodeToStorage()
        .then(res => {
          _this.createTimerOrder().then(res => {
            console.log(res);
            _this.$confirm(res, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "success"
            });
          });
        })
        .catch(res => {});
    },
    open(msg, type) {
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: type
      })
        .then(() => {})
        .catch(() => {});
    }
  },
  created() {
    //读取缓存
  },
  mounted() {}
};
</script>
