<template>
  <div class="home">
   <el-form ref="form" :model="form" label-width="80px" v-if="!jsid">
    <el-form-item label="茶蛋账户">
        <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="茶蛋密码">
          <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit">立即登录</el-button>
    </el-form-item>
    </el-form>
    <div v-if="jsid">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>京东订单列表</span>
           <el-button type="success" style="float: right;" size="small" @click="getJd">京东接单</el-button>
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%">
            <el-table-column
            prop="cardNumber"
            label="号码">
          </el-table-column>
          <el-table-column
            prop="cardProduct.faceValue"
            label="面值"
            >
          </el-table-column>
          <el-table-column
            prop="amount"
            label="结算价格"
           >
          </el-table-column>

            <el-table-column
            prop="receiptTime"
            label="接单时间"
            width="180">
          </el-table-column>
           <el-table-column
            prop="orderStatus"
            label="订单状态"
            >
              <template slot-scope="scope">
              <el-tag
                :type="scope.row.orderStatus === 3 ? 'success' : 'warning'"
                disable-transitions>{{setorderStatus(scope.row.orderStatus)}}</el-tag>
            </template>
          </el-table-column>
           <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button  type="text"  v-if="scope.row.orderStatus !==6" size="small">无需操作</el-button>
               <el-button @click="showJdHf(scope.row.id)"  v-if="scope.row.orderStatus ===6" type="info" size="small">查看号码</el-button>
              <el-button @click="reportJdHf(scope.row.id)"  v-if="scope.row.orderStatus ===6" type="primary" size="small">上报</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
     
       <!-- <el-alert
        :title="msg"
        type="success" v-if="msg" :closable="false">
      </el-alert> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>

<script>
import JSEncrypt from "../plugins/jsencrypt.min.js";
import { constants } from "zlib";
// @ is an alias to /src
export default {
  data() {
    return {
      jsid: "",
      baseUrl: "http://api.chadan.cn",
      form: {
        name: "",
        password: ""
      },
      list: [],
      src: require("../assets/message.mp3"),
      msg: "",
      audio: null,
      animate: false,
      timer: null,
      duration: null
    };
  },
  name: "chadan",
  components: {},
  methods: {
    //  加密
    encryptedData(publicKey, data) {
      // 新建JSEncrypt对象
      let encryptor = new JSEncrypt();
      // 设置公钥
      encryptor.setPublicKey(publicKey);
      // 加密数据
      return encodeURIComponent(encryptor.encrypt(data));
    },
    // 解密
    // decryptData(privateKey, data) {
    //   // 新建JSEncrypt对象
    //   let decrypt = new JSEncrypt();
    //   // 设置私钥
    //   decrypt.setPrivateKey(privateKey);
    //   // 解密数据
    //   return decrypt.decrypt(secretWord);
    // },
    getPublicKey() {
      let _this = this;
      let qs = require("qs");
      return new Promise(function(resolve, reject) {
        _this
          .$axios({
            method: "post",
            url: _this.baseUrl + "/user/getPublicKey",
            data: qs.stringify({ userNo: _this.form.name })
          })
          .then(response => {
            //这里使用了ES6的语法
            if (response.status === 200) {
              resolve(response.data);
            } else {
              reject({ error: "网络错误", errorCode: response.status });
            }
            console.log(response); //请求成功返回的数据
          })
          .catch(error => {
            console.log(error); //请求失败返回的数据
          });
      });
    },
    getResloginPwd() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.getPublicKey().then(res => {
          console.log(res);
          if (res.errorCode == 200) {
            let resloginPwd = _this.encryptedData(
              res.data.public_key,
              _this.form.password + res.data.random_str
            );
            console.log(resloginPwd);
            resolve({ data: resloginPwd });
          } else {
            reject({ data: res, error: "接口失败" });
          }
        });
      });
    },
    login() {
      let _this = this;
      let qs = require("qs");
      return new Promise(function(resolve, reject) {
        _this.getResloginPwd().then(res => {
          let data = res.data; //加密后的pwd
          console.log(data);
          _this
            .$axios({
              method: "post",
              url: _this.baseUrl + "/user/login",
              data: qs.stringify({
                userNo: _this.form.name,
                loginPwd: data,
                shareCode: "",
                openId: "null"
              })
            })
            .then(response => {
              //这里使用了ES6的语法
              if (response.status === 200) {
                resolve(response.data);
              } else {
                reject({ error: "网络错误", errorCode: response.status });
              }
              console.log(response); //请求成功返回的数据
            })
            .catch(error => {
              console.log(error); //请求失败返回的数据
            });
        });
      });
    },
    onSubmit() {
      let _this = this;
      this.login().then(res => {
        if (res.errorCode == 200) {
          _this.$message({
            message: "恭喜你，登陆成功",
            type: "success"
          });
          _this.jsid = res.data.remark;
          localStorage.setItem("JSESSIONID", res.data.remark);
          //重新查询下订单
          _this.queryJdOrders();
        } else {
          _this.$message({
            message: res.errorMsg,
            type: "warning"
          });
        }
      });
    },
    open(res, type) {
      this.$confirm(res, "重要提示", {
        confirmButtonText: "我知道了",
        type: type
      })
        .then(() => {})
        .catch(() => {});
    },
    getJd() {
      let _this = this;
      _this.getJdOtherOrder().then(res => {
        if (res.errorCode === 200) {
          _this.open(
            "接单成功：手机号为：" +
              res.data[0].cardNumber +
              "，(请以手机京东订单列表为准)。" +
              JSON.stringify(res.data[0]),
            "success"
          );
          _this.doCopy(res.data[0].cardNumber);
          _this.play();
          //重新查询下订单
          _this.queryJdOrders();
        } else if (res.errorCode === 2000) {
          window.localStorage.removeItem("JSESSIONID");
          _this.jsid = "";
          _this.open(res.errorMsg, "warning");
        } else {
          _this.open(res.errorMsg, "error");
        }
      });
    },
    chadanGetJdOrderAPI(resolve, reject) {
      let _this = this;
      let qs = require("qs");
      _this
        .$axios({
          method: "post",
          url: _this.baseUrl + "/order/other/getJdOtherOrder",
          data: qs.stringify({
            JSESSIONID: _this.jsid,
            productId: 8,
            shopId: 72,
            shopName: "京东话费",
            amount: 1,
            cardType: 1
          })
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (
              response.data.errorCode === 200 ||
              response.data.errorCode === 4002 ||
              response.data.errorCode === 2000
            ) {
              //_this.play();
              //chadanGetJdOrderAPI(response.data);
              resolve(response.data);
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.errorMsg,
                duration: 4000,
                type: "warning"
              });
              _this.fnTime().then(() => {
                //_this.msg = res.errorMsg;
                _this.chadanGetJdOrderAPI(resolve, reject);
              });
            }
          } else {
            _this.$message({
              message: "网络连接失败",
              type: "warning"
            });
            reject();
            console.log(response); //请求成功返回的数据
          }
        })
        .catch(error => {
          console.log(error); //请求失败返回的数据
        });
    },
    getJdOtherOrder() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.chadanGetJdOrderAPI(resolve, reject);
      });
    },
    fnTime() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 4000);
      });
    },

    play() {
      window.audioList.forEach(audio => {
        //开始前先关闭所有可能正在运行的实例
        audio.pause();
      });
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    format(s) {
      var t = "";
      if (s > -1) {
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (min < 10) {
          t += "0";
        }
        t += min + "'";
        if (sec < 10) {
          t += "0";
        }
        t += sec.toFixed(2);
      }
      t = t.replace(".", '"');
      return t;
    },
    initplayer() {
      window.audioList = [];
      this.audio = new Audio();
      this.audio.src = this.src;
      this.audio.addEventListener("canplaythrough", () => {
        this.duration = this.format(this.audio.duration);
      });
      this.audio.onplay = () => {
        this.animate = true;
        this.timer = setInterval(() => {
          this.animate = false;
          setTimeout(() => {
            this.animate = true;
          }, 50);
        }, 1250);
      };
      this.audio.onpause = () => {
        this.animate = false;
        this.timer && clearInterval(this.timer);
      };
      this.audio.onended = () => {
        this.animate = false;
        this.timer && clearInterval(this.timer);
      };
      window.audioList.push(this.audio); //所有实例加入全局变量
    },
    queryJdOrders() {
      let _this = this;
      let qs = require("qs");
      let moment = require("moment");
      let startTime = moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      let endTime = moment().format("YYYY-MM-DD");
      _this
        .$axios({
          method: "post",
          url: _this.baseUrl + "/order/other/queryOtherOrders",
          data: qs.stringify({
            startTime: startTime + " " + "00:00:00",
            endTime: endTime + " " + "23:59:59",
            JSESSIONID: _this.jsid,
            orderStatus: "",
            cardType: 1,
            operator: "MOBILE_BILL"
          })
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.errorCode === 200) {
              //_this.play();
              //chadanGetJdOrderAPI(response.data);
              _this.list = response.data.data.list;
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.errorMsg,
                duration: 4000,
                type: "warning"
              });
            }
          } else {
            _this.$message({
              message: "网络连接失败",
              type: "warning"
            });
            console.log(response); //请求成功返回的数据
          }
        })
        .catch(error => {
          console.log(error); //请求失败返回的数据
        });
    },
    setorderStatus(value) {
      console.log(value);
      switch (value) {
        case 1:
          return "处理中";
          break;
        case 3:
          return "成功";
          break;
        case 4:
          return "失败";
          break;
        case 6:
          return "待充值";
          break;
        default:
          return "处理中";
          break;
      }
    },
    reportJdHf(id) {
      let _this = this;
      let qs = require("qs");
      _this
        .$axios({
          method: "post",
          url: _this.baseUrl + "/order/other/reportJdHf",
          data: qs.stringify({
            JSESSIONID: _this.jsid,
            orderStatus: 3,
            cardType: 1,
            id: id
          })
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.errorCode === 200) {
              //_this.play();
              //chadanGetJdOrderAPI(response.data);
              _this.queryJdOrders();
              _this.$notify({
                title: "提示",
                message: "上报成功，即将开始自动接单",
                duration: 4000,
                type: "success",
                onClose: function() {
                  _this.getJd(); //开始自动接单
                }
              });
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.errorMsg,
                duration: 4000,
                type: "warning"
              });
            }
          } else {
            _this.$message({
              message: "网络连接失败",
              type: "warning"
            });
            console.log(response); //请求成功返回的数据
          }
        })
        .catch(error => {
          console.log(error); //请求失败返回的数据
        });
    },
    //查看号码
    showJdHf(id) {
      let _this = this;
      let qs = require("qs");
      _this
        .$axios({
          method: "post",
          url: _this.baseUrl + "/order/other/getOtherOrder",
          data: qs.stringify({
            JSESSIONID: _this.jsid,
            id: id
          })
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.errorCode === 200) {
              _this.open(
                "手机号为：" +
                  response.data.data.cardNumber +
                  "，(请以手机京东订单列表为准)。订单状态为：" +
                  _this.setorderStatus(response.data.data.orderStatus),
                "success"
              );
              _this.doCopy(response.data.data.cardNumber);
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.errorMsg,
                duration: 4000,
                type: "warning"
              });
            }
          } else {
            _this.$message({
              message: "网络连接失败",
              type: "warning"
            });
            console.log(response); //请求成功返回的数据
          }
        })
        .catch(error => {
          console.log(error); //请求失败返回的数据
        });
    },
    doCopy(val) {
      let _this = this;
      _this.$copyText(val).then(
        function(e) {
          _this.$notify({
            title: "提示",
            message: val + "" + "已复制到剪切板",
            duration: 4000,
            type: "success"
          });
        },
        function(e) {
          _this.$notify({
            title: "出错了",
            message: "复制失败，请手动复制（可能是浏览器不支持自动复制）",
            duration: 1000,
            type: "error",
            onClose: function() {
            }
          });
        }
      );
    }
  },
  created() {
    this.jsid = localStorage.getItem("JSESSIONID")
  },
  mounted() {
    this.initplayer();
    this.queryJdOrders();
  }
};
</script>
