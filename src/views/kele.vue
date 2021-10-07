<template>
  <div class="home">
   <el-form ref="form" :model="form" label-width="80px" v-if="!jsid">
    <el-form-item label="JSESSIONID">
          <el-input placeholder="请输入JSESSIONID" v-model="form.password" show-password></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit">立即登录</el-button>
    </el-form-item>
    </el-form>
    <div v-if="jsid">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                
                <el-col :sm="12" :xs="24">

                  <div>包含</div>
                    <el-row  v-for="(item, index) in includeOption" :key="index">
                      <el-col :sm="11" :xs="24">
                          <el-form-item label="类别">
                            <el-select v-model="includeValue[index]" :key="'includeOption'+index" placeholder="请选择">
                              <el-option
                                 v-for="options in item.options" 
                                :key="'includeOption'+options.value+index"
                                :label="options.name"
                                :value="options.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :sm="11" :xs="24">
                          <el-form-item label="条件">
                              <el-input
                            v-model="item.search"
                            placeholder="输入关键字搜索"/>
                          </el-form-item>
                      </el-col>
                       <el-col :sm="2" :xs="{span:2,push:20}" v-if="index>0">
                          <el-form-item label-width="20px" label="">
                             <i class="el-icon-delete"  @click="deleteItem('include', item, index)"></i>
                          </el-form-item>
                        
                      </el-col>
                      
                    </el-row>
                    <div>
                        <el-button type="primary" size="small" style="float: left;" @click="addItem('include')">增加</el-button>
                    </div>
                    
                </el-col>
                <el-col :sm="12" :xs="24">
                  <div>不包含</div>
                    <el-row  v-for="(item, index) in excludeOption" :key="index">
                      <el-col :sm="11" :xs="24">
                          <el-form-item label="类别">
                            <el-select v-model="excludeValue[index]" :key="'excludeOption'+index" placeholder="请选择">
                              <el-option
                                 v-for="options in item.options" 
                                :key="'excludeOption'+options.value+index"
                                :label="options.name"
                                :value="options.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :sm="11" :xs="24">
                          <el-form-item label="条件">
                              <el-input
                            v-model="item.search"
                            placeholder="输入关键字搜索"/>
                          </el-form-item>
                      </el-col>
                         <el-col :sm="2" :xs="{span:2,push:20}"  v-if="index>0" >
                          <el-form-item label-width="20px" label="">
                             <i class="el-icon-delete"  @click="deleteItem('exclude', item, index)"></i>
                          </el-form-item>
                      </el-col>
                    </el-row>
                     <div>
                        <el-button type="primary" size="small" style="float: left;" @click="addItem('exclude')">增加</el-button>
                    </div>
                </el-col>
            </el-row>
             <el-row style="margin-top:20px">
                  <el-col :span="24">
                    <el-button type="success" style="float: left;" @click="getJd">接单</el-button>
                  </el-col>

            </el-row>
          </el-form>

          
          
           
        </div>
        <el-table
          @filter-change="change"
          :data="filterList"
          stripe
          style="width: 100%">
            <el-table-column
            prop="movieName"
            label="影片名称"
            column-key="movieName"
            :filters="filterMovieNameArr"
             :filter-method="filterMovieName"
            >
          </el-table-column>
          <el-table-column
            prop="officialPrice"
            label="市场价"
            >
          </el-table-column>
          <el-table-column
            prop="cinema"
            label="影城名称"
           >
          </el-table-column>

            <el-table-column
            prop="city"
            label="城市"
            width="100">
          </el-table-column>
           <el-table-column
            label="报价区间"
            >
              <template slot-scope="scope">
              <el-tag
                type="danger"
                disable-transitions>{{scope.row.minPrice +'-'+scope.row.maxPrice }}</el-tag>
            </template>
          </el-table-column>
           <el-table-column
            fixed="right"
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button  type="text"  size="small">{{setorderStatus(scope.row.bidStatus)}}</el-button>
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
import { fork } from "child_process";
// @ is an alias to /src
export default {
  data() {
    return {
      jsid: "",
      baseUrl: "http://www.chadan.cn/mv/",
      form: {
        name: "",
        password: ""
      },
      page: 1,
      pageSize: 15,
      list: [],

      options: [
        { value: "movieName", name: "影片名称" },
        { value: "city", name: "城市" },
        { value: "cinema", name: "影院" },
        { value: "officialPrice", name: "原价" }
      ],
      filterMovieNameArr: [],
      search: "",
      includeValue: [],
      includeOption: [],
      excludeValue: [],
      excludeOption: [],
      src: require("../assets/message.mp3"),
      msg: "",
      audio: null,
      animate: false,
      timer: null,
      duration: null
    };
  },

  watch: {
    list: {
      handler: function(val, oldval) {
        for (let j = 0; j < val.length; j++) {
          const el = val[j];
          let flag = false;
          let arr = {};
          if (this.filterMovieNameArr.length == 0) {
            arr.text = val[0].movieName;
            arr.value = val[0].movieName;
          } else {
            for (
              let index = 0;
              index < this.filterMovieNameArr.length;
              index++
            ) {
              const element = this.filterMovieNameArr[index];
              if (element.value === el.movieName) {
                flag = true;
                break;
              }
              arr.text = el.movieName;
              arr.value = el.movieName;
            }
          }
          if (flag) {
            continue;
          }
          if (Object.keys(arr).length === 0) return;
          this.filterMovieNameArr.push(arr);
        }
        //console.log(this.filterMovieNameArr);
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    excludeValue: function(val, old) {
      //console.log(val, old);
    }
  },

  name: "chadan",
  components: {},
  computed: {
    filterList: {
      set: function() {},
      get: function() {
        let arr = [];
        let temp = this.list;
        this.excludeValue.forEach((el, index) => {
          //console.log(el, this.excludeOption[index].search);
          //if (this.excludeOption[index].search) {
          temp = temp.filter((element, i) => {
            if (el === "officialPrice") {
              return element[el] >= this.excludeOption[index].search;
            } else {
              if (!this.excludeOption[index].search.toLowerCase()) {
                return true;
              } else if (this.excludeOption[index].search.toLowerCase()) {
                return !element[el]
                  .toLowerCase()
                  .includes(this.excludeOption[index].search.toLowerCase());
              }
            }
          });
          console.log(temp);
        });
        this.includeValue.forEach((el, index) => {
          //console.log(el, this.excludeOption[index].search);
          //if (this.excludeOption[index].search) {
          temp = temp.filter((element, i) => {
            if (el === "officialPrice") {
              return element[el] >= this.includeOption[index].search;
            } else {
              if (!this.includeOption[index].search.toLowerCase()) {
                return true;
              } else if (this.includeOption[index].search.toLowerCase()) {
                return element[el]
                  .toLowerCase()
                  .includes(this.includeOption[index].search.toLowerCase());
              }
            }
          });
          console.log(temp);
        });
        return temp;
      }
    }
  },
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
      _this.$message({
        message: "恭喜你，登陆成功",
        type: "success"
      });
      _this.jsid = _this.form.password;
      localStorage.setItem("JSESSIONID", _this.form.password);
      //重新查询下订单
      _this.queryJdOrders();
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
      _this.filterData();
      // _this.getJdOtherOrder().then(res => {
      //   if (res.errorCode === 200) {
      //     _this.open(
      //       "接单成功：手机号为：" +
      //         res.data[0].cardNumber +
      //         "，(请以手机京东订单列表为准)。" +
      //         JSON.stringify(res.data[0]),
      //       "success"
      //     );
      //     _this.doCopy(res.data[0].cardNumber);
      //     _this.play();
      //     //重新查询下订单
      //     _this.queryJdOrders();
      //   } else if (res.errorCode === 2000) {
      //     window.localStorage.removeItem("JSESSIONID");
      //     _this.jsid = "";
      //     _this.open(res.errorMsg, "warning");
      //   } else {
      //     _this.open(res.errorMsg, "error");
      //   }
      // });
    },
    filterData() {
      let arr = [];
      this.excludeValue.forEach((el, index) => {
        console.log(el);
        arr = arr.concat(
          this.filterList.filter((element, i) => {
            return !element[el]
              .toLowerCase()
              .includes(this.excludeOption[index].search.toLowerCase());
          })
        );
        this.filterList = arr;
        console.log(this.filterList);
      });
      console.log();
      //filter.push(element[el]);
      //});

      // let filterPro = [];
      // let search = "";

      // this.list.filter(element => {});
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
      if (_this.isend) return;
      _this
        .$axios({
          method: "post",
          url: _this.baseUrl + "/movie/order/query/pool",
          data: qs.stringify({
            JSESSIONID: _this.jsid,
            pageNum: _this.page,
            pageSize: _this.pageSize
          })
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.errorCode === 200) {
              //_this.play();
              //chadanGetJdOrderAPI(response.data);
              _this.list;
              let list = response.data.data.list;
              if (list.length < _this.pageSize || list.length == 0) {
                _this.isend = true;
              }
              _this.list =
                list.length > 0 ? _this.list.concat(list) : _this.list;
              _this.page++;
              _this.queryJdOrders();
            } else if (response.data.errorCode === 2000) {
              _this.$notify({
                title: "提示",
                message: response.data.errorMsg,
                duration: 4000,
                type: "warning"
              });
              window.localStorage.removeItem("JSESSIONID");
              _this.jsid = "";
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
        case "BIDDING":
          return "竞价中";
          break;
        case "NOT_BID":
          return "未竞价";
          break;
        case "CANCEL":
          return "不可竞价";
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
            onClose: function() {}
          });
        }
      );
    },
    addItem(prop) {
      this[prop + "Option"].push({
        options: this.options,
        search: this.search
      });
      this[prop + "Value"].push("movieName");
    },
    deleteItem(prop, item, index) {
      if (this[prop + "Option"].length > 1 && this[prop + "Value"].length > 1)
        this[prop + "Option"].splice(index, 1);
      this[prop + "Value"].splice(index, 1);
    },
    filterMovieName(value, row) {
      return row.movieName === value;
    },
    change(filters) {
      console.log(filters);
    }
  },
  created() {
    this.jsid = localStorage.getItem("JSESSIONID");
  },
  mounted() {
    this.addItem("include");
    this.addItem("exclude");
    this.initplayer();
    this.queryJdOrders();
  }
};
</script>
