<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
         
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="1">
             <div v-if="user"> 
             <el-avatar  :src="user.avatar"></el-avatar>
             <div>{{user.nickname}}</div>
              <div>现有龙之力：{{user.gold}}</div>
            </div>
            <el-form-item label="网址">
                <el-input v-model="form.url" placeholder="请输入获取的网址"></el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="start">抽奖</el-button>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="设置" name="2">
            <el-form-item label="分数">
                <el-input placeholder="" v-model="form.gold"></el-input>
            </el-form-item>
            <el-form-item label="关卡">
                <el-input placeholder="" v-model="form.score"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getGold">开始</el-button>
            </el-form-item>
          </el-collapse-item>
            <el-collapse-item title="其他信息" name="3">
            <!-- <el-form-item label="礼品id">
                <el-input placeholder="" v-model="form.standardId"></el-input>
            </el-form-item> -->
            <el-form-item label="order_id">
                <el-input placeholder="" readonly v-model="form.order_id"></el-input>
            </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="" v-model="form.name"></el-input>
            </el-form-item>
              <el-form-item label="地址">
                <el-input placeholder="" v-model="form.address"></el-input>
            </el-form-item>
              <!-- <el-form-item label="邮编">
                <el-input placeholder="" v-model="form.code"></el-input>
            </el-form-item> -->
            <el-form-item label="电话">
                <el-input placeholder="" v-model="form.tel"></el-input>
            </el-form-item>
              <el-form-item>
                 <el-button type="info" @click="updreceiverinfo" :disabled="form.order_id===''?true:false">提交邮寄地址</el-button>
            </el-form-item>
            </el-collapse-item>
           <el-collapse-item title="奖品列表" name="4">
             <el-row :gutter="20" style="margin-top:20px">
              <el-col :span="24">
                <el-card class="box-card">
                  <el-table
                    :data="list"
                    :default-sort="{prop:'goods_id'}"
                    stripe
                    style="width:100%">
                    <el-table-column
                      prop="goods_id"
                      label="奖品等级">
                    </el-table-column>
                      <el-table-column
                      prop="goods_name"
                      label="礼品名称">
                    </el-table-column>
                    <el-table-column
                      prop="exchange_daily_num"
                      label="日兑换数量"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="exchange_probability"
                      label="中奖概率"
                    >
                      <template slot-scope="scope">
                      {{scope.row.exchange_probability/100000000}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="last_exchangetime"
                      label="当天首次兑换时间"
                    >
                    <template slot-scope="scope">
                    {{moment.unix(scope.row.last_exchangetime).format("YYYY-MM-DD HH:mm:ss")}}
                    </template>
                    </el-table-column>
                  </el-table>
                </el-card>
                
              </el-col>
              <el-col :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                      <span>当前第{{page+1}}页</span>
                      <div style="float: right;">
                         <el-button size="small" type="primary" @click="sub" :disabled="page===0?true:false">上一页</el-button>
                         <el-button size="small" type="success" @click="add" :disabled="eventList.length===0?true:false">下一页</el-button>
                      </div>
                     
                  </div>
                  <el-table
                    :data="eventList"
                    
                    stripe
                    style="width:100%">
                    <el-table-column
                      prop="event_content"
                      label="名称">
                    </el-table-column>
                    <el-table-column
                      prop="event_time"
                      label="中奖时间"
                    >
                    <template slot-scope="scope">
                    {{moment.unix(scope.row.event_time).format("YYYY-MM-DD HH:mm:ss")}}
                    </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        </el-form>
    </div>
</template>
<script>
import JSEncrypt from "../plugins/jsencrypt.min.js";
import { setInterval, clearInterval } from "timers";
// @ is an alias to /src
export default {
  data() {
    return {
      moment: require("moment"),
      token_prefix: "xiaolong", //token前缀，代表不同项目
      jsid: "",
      baseUrl: "https://lyhz-isv.isvjcloud.com/api/interface",
      form: {
        url:
          "https://lyhz-isv.isvjcloud.com/index.html?token=B7D40DB968E584019221305A19368901994EFED3EFD2309AFA2CA38743ED73C4&",
        //standardId: this.$route.query.goods || "7",
        client: 6, //固定参数 不知道是什么用
        source: "02", //固定参数 不知道是什么用
        score: 24, //第几关
        gold: 10150, //分数
        name: "",
        address: "",
        code: "",
        tel: "",
        order_id: "" //中奖后返回的order_id,然后提交到服务器
      },
      token: "",
      list: [],
      eventList: [], //中奖列表
      id: this.$route.query.id || 0,
      addlist: [
        {
          name: "李师",
          address: "北京市昌平区霍营街道霍营小区6号楼6单元301",
          code: "102200",
          tel: "17600100793"
        },

        {
          name: "李红伟",
          address: "河南省新乡市长垣县芦岗乡郭占村105号",
          code: "453400",
          tel: "15311213029"
        },
        {
          name: "",
          address: "",
          code: "",
          tel: ""
        },
        {
          name: "",
          address: "",
          code: "",
          tel: ""
        },
        {
          name: "",
          address: "",
          code: "",
          tel: ""
        },
        {
          name: "王博",
          address: "浙江省温州市鹿城区南汇街道下吕浦华中巷5号",
          code: "325000",
          tel: "17078932722"
        },
        {
          name: "李朵",
          address: "浙江省温州市乐清市北白象镇中垟田西路13号",
          code: "325000",
          tel: "15057376343"
        },
        {
          name: "杨静",
          address: "浙江省温州市乐清市虹桥镇南村电子信息科技加速器",
          code: "325000",
          tel: "15267779207"
        },
        {
          name: "胡小通",
          address: "浙江省温州市鹿城区南汇街道双龙路献华组团15栋",
          code: "325000",
          tel: "17357760310"
        }
      ],
      user: "",
      timer: 0,
      page: 0,
      pagesize: 100,
      activeNames: ["1", "4"] //当前激活的面板
    };
  },
  name: "xiaolong",
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
    getTokenByCode(token) {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this
          .$axios({
            withCredentials: false, // 允许携带cookie
            // `url` 是用于请求的服务器 URL
            url: _this.baseUrl + "/reglogin?token=" + token,
            // `method` 是创建请求时使用的方法
            method: "POST" // default
          })
          .then(function(res) {
            //console.log(res.status)
            if (res.status === 200) {
              if (res.data.data) {
                resolve(res.data.data);
              } else {
                reject({ message: "请求出错：" + res.data.msg });
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
    //获取用户信息（已知access_token）
    getuserinfo() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this
          .$axios({
            withCredentials: false, // 允许携带cookie
            // `url` 是用于请求的服务器 URL
            url:
              _this.baseUrl +
              "/index?act=getuserinfo&config_name=user&client=" +
              _this.form.client +
              "&source=" +
              _this.form.source +
              "&access_token=" +
              _this.token,
            // `method` 是创建请求时使用的方法
            method: "POST" // default
          })
          .then(function(res) {
            //console.log(res.status)
            if (res.status === 200) {
              if (res.data.data) {
                    //更新用户信息
                    let user = JSON.parse(
                      sessionStorage.getItem(_this.token_prefix + "_user")
                    );
                    user.gold = res.data.data.gold;
                    user.avatar = res.data.data.avatar;
                     _this.user = user;
                    sessionStorage.setItem(_this.token_prefix + "_user",JSON.stringify(user));
                resolve(res.data.data);
              } else {
                reject({ message: "请求出错：" + res.data.msg });
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
      _this.token = sessionStorage.getItem(_this.token_prefix + "_token");
      return new Promise(function(resolve, reject) {
        if (
          _this.token === null ||
          _this.token === undefined ||
          _this.token === ""
        ) {
          //获取网址token
          let token = _this.getUrlKey(_this.form.url, "token");
          _this
            .getTokenByCode(token)
            .then(res => {
              if (res.token) {
                _this.user = res;
                sessionStorage.setItem(
                  _this.token_prefix + "_user",
                  JSON.stringify(res)
                );
                _this.token = res.token;
                //设置缓存。
                sessionStorage.setItem(
                  _this.token_prefix + "_token",
                  _this.token
                );
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
      let _exchange = "";
      if (_this.list.length > 0) {
        _this.list.forEach((item, index) => {
          if (Number(item.goods_id) == Number(_this.form.standardId)) {
            console.log(item);
            if (Number(item.goods_type) > 0) {
              _exchange = "exchangegold";
            } else {
              _exchange = "exchange";
            }
            return;
          }
        });
      } else {
        _exchange = "exchangegold";
      }
      console.log(_exchange);
      _this
        .$axios({
          // `url` 是用于请求的服务器 URL
          withCredentials: false, // 允许携带cookie
          url:
            _this.baseUrl +
            "/index?act=" +
            _exchange +
            "&config_name=game&goods_id=" +
            _this.form.standardId +
            (_exchange === "exchangegold"
              ? ""
              : "&order_name=" +
                _this.form.name +
                "&order_address=" +
                _this.form.address +
                "&order_postalcode=" +
                _this.form.code +
                "&order_mobile=" +
                _this.form.tel) +
            "&client=" +
            _this.form.client +
            "&source=" +
            _this.form.source +
            "&access_token=" +
            _this.token,
          // `method` 是创建请求时使用的方法
          method: "POST", // default
          //params: param,
          // 如果请求话费了超过 `timeout` 的时间，请求将被中断
          timeout: 10000
        })
        .then(function(res) {
          if (res.status === 200) {
            if (res.data.data) {
              resolve(res.data);
            } else {
              _this.$notify({
                title: "提示",
                message: res.data.msg,
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
    queryGoodslist() {
      let _this = this;
      _this
        .$axios({
          withCredentials: false, // 允许携带cookie
          method: "post",
          url:
            _this.baseUrl +
            "/index?act=goodslist&config_name=game&client=" +
            _this.form.client +
            "&source=" +
            _this.form.source +
            "&access_token=" +
            _this.token
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.ret === 0) {
              //_this.play();
              //chadanGetJdOrderAPI(response.data);
              _this.list = response.data.data;
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.msg,
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
    queryEventlist() {
      let _this = this;
      _this
        .$axios({
          withCredentials: false, // 允许携带cookie
          method: "post",
          url:
            _this.baseUrl +
            "/index?act=eventlist&config_name=game&page=" +
            _this.page +
            "&pagesize=" +
            _this.pagesize +
            "&client=" +
            _this.form.client +
            "&source=" +
            _this.form.source +
            "&access_token=" +
            _this.token
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.ret === 0) {
              //_this.play();
              //chadanGetJdOrderAPI(response.data);
              _this.eventList = response.data.data;
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.msg,
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
    add() {
      if (this.eventList.length === 0) return;
      this.page++;
      this.queryEventlist();
    },
    sub() {
      if (this.page == 0) return;
      this.page--;
      this.queryEventlist();
    },
    //定时器
    fnTime() {
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 5000);
      });
    },
    onSubmit() {
      let _this = this;
      _this
        .setcodeToStorage()
        .then(res => {
          //获取商品库存
          _this.queryGoodslist();
          //定时获取商品库存
          _this.timer && clearInterval(_this.timer);
          _this.timer = setInterval(function() {
            _this.queryGoodslist();
          }, 5000);
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
    //抽奖
    start() {
      let _this = this;
      _this
        .setcodeToStorage()
        .then(res => {
          //获取奖品列表，与抽奖明细
            _this.queryGoodslist();
            _this.queryEventlist();
          _this.lottery().then(res => {
            console.log(res);
            if (res.ret === 0) {
              _this.getuserinfo();
              if (res.data.order_id) {
                _this.form.order_id = res.data.order_id;
                _this.confirmUserInfo();
              } else {
                _this.$confirm(res.data.exchange_desc, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "success"
                });
              }
            } else {
              _this.$notify({
                title: "提示",
                message: res.msg,
                duration: 4000,
                type: "warning"
              });
            }
          });
        })
        .catch(res => {});
    },
    //弹窗显示用户收货信息
    confirmUserInfo() {
      let _this = this;
      _this
        .$confirm(
          res.data.exchange_desc +
            ",即将将以下地址发送给服务器。请确认：" +
            "姓名：" +
            _this.form.name +
            ",电话：" +
            _this.form.tel +
            ",邮寄地址：" +
            _this.form.address,
          "提示",
          {
            confirmButtonText: "现在提交",
            cancelButtonText: "现在去修改",
            type: "success"
          }
        )
        .then(() => {
          _this.updreceiverinfo();
        })
        .catch(() => {
          _this.$notify({
            title: "提示",
            message: "请打开【其他信息】折叠面板，修改信息，请不要修改order_id",
            duration: 10000,
            type: "warning"
          });
        });
    },
    updreceiverinfo() {
      let _this = this;
      _this
        .$axios({
          withCredentials: false, // 允许携带cookie
          method: "post",
          url:
            _this.baseUrl +
            "/index?act=updreceiverinfo&config_name=game&order_id=" +
            _this.form.order_id +
            "&order_address=" +
            _this.form.address +
            "&order_postalcode=undefined" +
            "&order_mobile=" +
            _this.form.tel +
            "&order_company=undefined&order_job=undefined&client=" +
            _this.form.client +
            "&source=" +
            _this.form.source +
            "&access_token=" +
            _this.token
        })
        .then(response => {
          //这里使用了ES6的语法
          if (response.status === 200) {
            if (response.data.ret === 0) {
              _this.$confirm(
                "您的信息已提交！我们将在10个工作日内按照填写信息寄送礼品，感谢您的参与。",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "success"
                }
              );
            } else {
              _this.$notify({
                title: "提示",
                message: response.data.msg,
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
    //获取龙之力
    getGold() {
      let _this = this;
      _this
        .setcodeToStorage()
        .then(res => {
          //获取奖品列表，与抽奖明细
          _this.queryGoodslist();
          _this.queryEventlist();
          _this.gold().then(res => {
            if (res.ret === 0) {
              _this.$notify({
                title: "提示",
                message: "去看看吧！",
                duration: 4000,
                type: "success"
              });
            } else {
              _this.$notify({
                title: "提示",
                message: res.msg,
                duration: 4000,
                type: "warning"
              });
            }
          });
        })
        .catch(res => {});
    },
    lottery() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this
          .$axios({
            withCredentials: false, // 允许携带cookie
            method: "post",
            url:
              _this.baseUrl +
              "/index?act=lottery&config_name=game&client=" +
              _this.form.client +
              "&source=" +
              _this.form.source +
              "&access_token=" +
              _this.token
          })
          .then(response => {
            //这里使用了ES6的语法
            if (response.status === 200) {
              resolve(response.data);
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
      });
    },
    gold() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this
          .$axios({
            withCredentials: false, // 允许携带cookie
            method: "post",
            url:
              _this.baseUrl +
              "/index?client=" +
              _this.form.client +
              "&source=" +
              _this.form.source +
              "&access_token=" +
              _this.token,
            data: {
              act: "getgold",
              config_name: "game",
              gold: _this.form.gold,
              score: _this.form.score
            }
          })
          .then(response => {
            //这里使用了ES6的语法
            if (response.status === 200) {
              resolve(response.data);
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
      });
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
    let _this = this;
    _this.token = sessionStorage.getItem(_this.token_prefix + "_token");
    _this.user = JSON.parse(
      sessionStorage.getItem(_this.token_prefix + "_user")
    );
    _this.form.name = _this.addlist[_this.id].name;
    _this.form.address = _this.addlist[_this.id].address;
    _this.form.code = _this.addlist[_this.id].code;
    _this.form.tel = _this.addlist[_this.id].tel;
  },
  mounted() {
    if (this.token) {
      this.queryGoodslist();
      this.queryEventlist();
    }
  }
};
</script>
