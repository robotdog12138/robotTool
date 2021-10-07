<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
          <div v-if="user" style="text-align:center"> 
             <el-avatar  :src="user.avatar"></el-avatar>
             <div>{{user.nickname}}</div>
              <div>现有京豆币：{{user.gold}}</div>
          </div>
           
            <el-form-item label="网址">
                <el-input v-model="form.url" placeholder="请输入获取的网址"></el-input>
            </el-form-item>
            <el-form-item label="XXX" style="display:none;">
                <el-input placeholder="" v-model="form.gold"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getGold">开始</el-button>
            </el-form-item>
             <el-collapse-transition>
              <el-form-item label="礼品id" v-show="form.standardId || !form.switchs">
                  <el-input placeholder="" v-model="form.standardId"></el-input>
              </el-form-item>
            </el-collapse-transition>
             <el-form-item label="有货兑换">
                  <el-switch
                    v-model="form.switchs"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
            </el-form-item>
              <el-form-item label="频率(秒)">
                 <el-input placeholder="多久执行一次(最低3s)" v-model="form.timer" type="number"></el-input>
            </el-form-item>
              <el-form-item label="姓名">
                <el-input placeholder="" v-model="form.name"></el-input>
            </el-form-item>
              <el-form-item label="地址">
                <el-input placeholder="" v-model="form.address"></el-input>
            </el-form-item>
              <el-form-item label="邮编">
                <el-input placeholder="" v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input placeholder="" v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="何时停止">
                <el-input placeholder="" v-model="endtime"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即兑换</el-button>
            </el-form-item>
        </el-form>


        <el-row :gutter="20">
           <el-col :span="24" style="margin-top:20px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>奖品列表</span>
              <!-- <el-button type="success" style="float: right;" size="small" @click="getJd">京东接单</el-button> -->
            </div>
            <el-table
              :data="list"
              stripe
              style="width: 100%">
              <el-table-column
                prop="goods_id"
                label="礼品id">
              </el-table-column>
                <el-table-column
                prop="goods_name"
                label="礼品名称">
              </el-table-column>
              <el-table-column
                prop="goods_price"
                label="需要京豆币"
                >
              </el-table-column>
              <el-table-column
                prop="goods_num"
                label="库存"
              >
              </el-table-column>
            </el-table>
          </el-card>

           </el-col>
            <el-col :span="24" style="margin-top:20px">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                      <span>当前第1页</span>
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

    </div>
</template>
<script>
import JSEncrypt from "../plugins/jsencrypt.min.js";
import { setInterval, clearInterval, setTimeout } from "timers";
// @ is an alias to /src
export default {
  data() {
    return {
      moment: require("moment"),
      jsid: "",
      baseUrl: "https://txzjhd6-isv.isvjcloud.com/api/interface",
      endtime: "2020-08-14 11:00:00",
      form: {
        url: "",
        standardId: this.$route.query.goods || "",
        client: 5, //固定参数 不知道是什么用
        source: 1, //固定参数 不知道是什么用
        name: "",
        address: "",
        code: "",
        tel: "",
        gold: 1025,
        switchs: this.$route.query.goods ? false : true,
        timer: 5
      },
      page: 0,
      pagesize: 250,
      token: "",
      list: [],
      eventList: [],
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
          name: "康志强",
          address: "北京市朝阳区北辰新纪元2北苑路甲13号院2号楼2402",
          code: "100020",
          tel: "13716136174"
        },
        {
          name: "马钰佺",
          address: "北京朝阳区望京SOHO T2-A-1108",
          code: "100020",
          tel: "17600297589"
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
          name: "王青",
          address: "浙江省温州市鹿城区双龙路华中商住楼",
          code: "325000",
          tel: "13329264855"
        },
        {
          name: "胡小通",
          address: "浙江省温州市鹿城区南汇街道双龙路献华组团15栋",
          code: "325000",
          tel: "17357760310"
        },
        {
          name: "王二小",
          address: "湖北省咸宁市崇阳县路口镇童玩超市",
          code: "437500",
          tel: "13185821986"
        }
      ],
      user: "",
      timer: 0,
      ordertimer: 0
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
    createTimerOrder() {
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.createOrder(resolve, reject);
      });
    },
    setcodeToStorage() {
      let _this = this;
      _this.token = sessionStorage.getItem("token");
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
                _this.$notify({
                  title: "提示",
                  message: "登录成功",
                  duration: 5000,
                  type: "success"
                });
                _this.user = res;
                sessionStorage.setItem("user", JSON.stringify(res));
                _this.token = res.token;
                //设置缓存。
                sessionStorage.setItem("token", _this.token);
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
    //创建axios请求。根据id发起请求
    createStandardById(id, exchange) {
      let _this = this;
      return _this.$axios({
        // `url` 是用于请求的服务器 URL
        withCredentials: false, // 允许携带cookie
        url:
          _this.baseUrl +
          "/index?act=" +
          exchange +
          "&config_name=game&goods_id=" +
          id +
          (exchange === "exchangegold"
            ? ""
            : "&order_name=" +
              _this.form.name +
              "&order_address=" +
              _this.form.address +
              "&order_postalcode=" +
              _this.form.code +
              "&order_mobile=" +
              _this.form.tel) +
          "&client=5&source=1&access_token=" +
          _this.token,
        // `method` 是创建请求时使用的方法
        method: "POST", // default
        //params: param,
        // 如果请求话费了超过 `timeout` 的时间，请求将被中断
        timeout: 10000
      });
    },
    createOrder(resolve, reject) {
      let _this = this;
      let _exchange = "";
      if (!_this.moment().isBefore(_this.endtime)) {
        reject({ message: "请求出错。已经过了设定的结束时间", ret: 400 });
        return;
      }
      if (!_this.form.standardId && !_this.form.switchs) {
        _this.$notify({
          title: "提示",
          message: "请填写要兑换的id 或者开启有货兑换模式",
          duration: 4000,
          type: "warning"
        });
        return false;
      }
      let standardIdArr = [];
      if (_this.list.length > 0) {
        _this.list.forEach((item, index) => {
          //此模式只兑换实物。虚拟不参与
          if (_this.form.switchs) {
            _exchange = "exchange";
            if (Number(item.goods_num) > 0 && Number(item.goods_type) === 0) {
              standardIdArr.push(item.goods_id);
            }
          } else {
            if (Number(item.goods_id) == Number(_this.form.standardId)) {
              //console.log(item);
              if (Number(item.goods_type) > 0) {
                _exchange = "exchangegold";
              } else {
                _exchange = "exchange";
              }
              return;
            }
          }
        });
      } else {
        _exchange = "exchangegold";
      }
      let axiosArr = [];
      if (standardIdArr.length > 0) {
        for (let index = 0; index < standardIdArr.length; index++) {
          axiosArr.push(
            _this.createStandardById(standardIdArr[index], _exchange)
          );
        }
      } else {
        if (_this.form.standardId) {
          axiosArr.push(
            _this.createStandardById(_this.form.standardId, _exchange)
          );
        } else {
          //reject({ message: "请求出错：暂时没有可以兑换的商品",ret:404  });
          _this.$message({
            message: "请求出错：暂时没有可以兑换的商品, 正在重新提交",
            type: "warning"
          });
          _this.fnTime().then(() => {
            _this.createOrder(resolve, reject);
          });
        }
      }
      console.log("模式：" + _exchange, standardIdArr, axiosArr);
      _this.$axios
        .all(axiosArr)
        .then(function(res) {
          let resArr = res;
          for (let index = 0; index < resArr.length; index++) {
            const element = resArr[index];
            if (element.status === 200) {
              //107 已兑换 0  成功兑换
              if (element.data.ret === 0 || element.data.ret === 107) {
                if (_this.form.switchs) {
                  _this.$notify({
                    title: "提示",
                    message: "好像兑换成功了~",
                    duration: 60000,
                    type: "success"
                  });
                  //既然开启了有货兑换模式，就不停止
                  _this.fnTime().then(() => {
                    _this.createOrder(resolve, reject);
                  });
                } else {
                  resolve(element.data);
                }
              } else {
                _this.$notify({
                  title: "提示",
                  message: element.data.msg,
                  duration: 4000,
                  type: "warning"
                });
                //reject({ message: element.data.msg,ret:element.data.ret });
                _this.fnTime().then(() => {
                  _this.createOrder(resolve, reject);
                });
                //_this.msg = res.errorMsg;
                //resolve({ message: "请求出错：" + res.data.error });
              }
            } else {
              //如果请求失败就重新发起请求
              //reject({ message: "网络链接失败：状态码:" + res.status });
              _this.$notify({
                title: "提示",
                message: "网络链接失败：状态码:" + element.status,
                duration: 4000,
                type: "error"
              });
              _this.fnTime().then(() => {
                _this.createOrder(resolve, reject);
              });
            }
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
            "/index?act=goodslist&config_name=game&client=5&source=1&access_token=" +
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
    //定时器
    fnTime(time) {
      let _this = this;
      _this.form.switchs && _this.ordertimer && clearInterval(_this.ordertimer);
      return new Promise(function(resolve) {
        _this.ordertimer = setTimeout(function() {
          resolve();
        }, time || _this.form.timer >= 3 ? _this.form.timer * 1000 : 3000);
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
          //如果是指定商品兑换模式，就不定时请求列表了
          if (_this.form.switchs) {
            _this.timer = setInterval(function() {
              _this.queryGoodslist();
            }, _this.form.timer >= 3 ? _this.form.timer * 1000 : 3000);
          }
          //稍微延迟一下，防止还没获取到商品库存就提交
          setTimeout(function() {
            _this
              .createTimerOrder()
              .then(res => {
                console.log(res);
                _this.$confirm(res, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "success"
                });
              })
              .catch(res => {
                _this.$message({
                  message: res.message,
                  type: "warning"
                });
              });
          }, 300);
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
    },
    //获取龙之力
    getGold() {
      let _this = this;
      _this
        .setcodeToStorage()
        .then(res => {
          //获取奖品列表，与抽奖明细
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
              gold: _this.form.gold
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
    }
  },
  created() {
    //读取缓存
    let _this = this;
    _this.token = sessionStorage.getItem("token");
    _this.user = JSON.parse(sessionStorage.getItem("user"));
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
