<template>
  <div>
    <el-row>
      <el-col :md="16" :xs="24">
        <el-row>
          <el-col :span="24">
            <el-card class="box-card" shadow="always">
              <div slot="header" class="clearfix">
                <span>robotTool</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="text item">
                <el-row class="box-card-hd">
                  <el-col>
                    <el-card class="box-card" shadow="never">
                      <div slot="header" class="clearfix">
                        <span>基础设置</span>
                      </div>
                      <div>

                        <el-form :model="ruleForm" :label-position="labelPosition" :rules="rules" label-width="80px" class="demo-ruleForm">
                          <el-form-item label="可选列表">
                            <el-select v-model="optionVal" @change="selectChange" placeholder="请选择">
                              <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="网址" prop="url">
                            <el-input v-model="ruleForm.url" autocomplete="off"></el-input>
                          </el-form-item>

                        </el-form>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>

                <el-row :gutter="20" class="box-card-bd">
                  <el-col :span="16">
                    <el-card class="box-card" shadow="never">
                      <div slot="header" class="clearfix">
                        <span>账号信息</span>
                        <el-button style="float: right" size="small" @click="saveAccountInfo" type="warning">保存信息</el-button>
                      </div>
                      <div>
                        <el-table :data="tableData" stripe border style="width: 100%">
                          <el-table-column type="selection" width="55">
                          </el-table-column>
                          <el-table-column type="index" width="50">
                          </el-table-column>
                          <el-table-column prop="name" label="别名" width="80">
                          </el-table-column>
                          <el-table-column prop="value" :show-overflow-tooltip="true" label="账户">
                          </el-table-column>
                          <el-table-column label="禁用" width="80">
                            <template slot-scope="scope">
                              <el-switch v-model="scope.row.disabled" active-color="#13ce66">
                              </el-switch>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="100">
                            <template slot-scope="scope">

                              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                          </el-table-column>

                        </el-table>
                        <div style="margin-top: 20px">
                          <el-form :inline="true" :model="accountForm" :rules="accountRules" ref="accountForm" class="demo-form-inline">
                            <el-form-item label="别名" prop="name">
                              <el-input v-model="accountForm.name" placeholder="别名"></el-input>
                            </el-form-item>
                            <el-form-item label="账户" prop="value">
                              <el-input v-model="accountForm.value" placeholder="账户"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="success" plain @click="addAccount('accountForm')">添加</el-button>
                            </el-form-item>
                          </el-form>
                        </div>
                      </div>
                    </el-card>

                  </el-col>
                  <el-col :span="8">
                    <el-card class="box-card" shadow="never">
                      <div slot="header" class="clearfix">
                        <span>高级设置</span>
                        <el-button style="float: right" size="small" @click="setting" type="success">保存设置</el-button>
                      </div>
                      <div>
                        <el-form :label-position="labelPosition" :rules="rules" ref="ruleForm" label-width="80px" :model="ruleForm">
                          <el-form-item label="开始时间" prop="startTime">

                            <el-time-picker v-model="ruleForm.startTime" placeholder="任意时间点">
                            </el-time-picker>
                            <!-- <el-time-select v-model="ruleForm.startTime" :picker-options="startPickerOptions" placeholder="选择开始时间">
                            </el-time-select> -->
                          </el-form-item>
                          <el-form-item label="开始延迟" prop="advance">
                            <el-input v-model.number="ruleForm.advance"></el-input>
                          </el-form-item>
                          <el-form-item label="间隔时间" prop="step">
                            <el-input v-model.number="ruleForm.step"></el-input>
                          </el-form-item>
                          <el-form-item label="领取次数" prop="count">
                            <el-input v-model.number="ruleForm.count"></el-input>
                          </el-form-item>
                          <el-form-item v-if="showInfo" label="信息">
                            <el-alert :title="showInfo" type="success" :closable="false">
                            </el-alert>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="primary" @click="submitRulesForm('ruleForm')">{{btnTxt}}</el-button>
                            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                          </el-form-item>

                        </el-form>
                      </div>
                    </el-card>

                  </el-col>

                </el-row>
                <el-row class="box-card-ft">
                  <el-col :span="24">
                    <el-card shadow="never">
                      <div slot="header" class="clearfix">
                        <span>日志</span>
                        <el-button style="float: right" size="small" @click="clearLog" type="danger">清空</el-button>
                      </div>
                      <div v-for="log in logs" :key="log.id" class="text item" style="color:#409EFF;font-size:13px;margin-bottom:5px;">
                        [{{log.account}}]:{{log.count}}:{{log.log}},开始时间:{{log.startReqTime}},返回时间:{{log.endReqTime}},耗时:{{log.diff}}ms
                      </div>
                    </el-card>
                  </el-col>
                </el-row>

              </div>
            </el-card>
          </el-col>

        </el-row>

      </el-col>
    </el-row>

  </div>
</template>
<style lang="scss" scoped>
.box-card-bd,
.box-card-ft {
  margin-top: 15px;
}
</style>

<script>
import { now } from "moment";
// @ is an alias to /src
import { Common } from "../model/common";
import { Jd } from "../model/jd";
import { setTimeout } from "timers";
let common = new Common();
let jd = new Jd();
export default {
  name: "Home",
  data() {
    return {
      options: [
        {
          value: 'https://api.m.jd.com/client.action?functionId=newBabelAwardCollection&body={%22activityId%22:%222QwmJao59JSGzjWtEWsT5zgxk291%22,%22scene%22:1,%22args%22:%22key=g1ucidd8ed2209264c92d31d5d7e8e8a,roleId=60257509,strengthenKey=C225838DC1351F9ACA8548E3171FF8A4A79652C3B40AA10EA6208B56F12A9AF708B8A2FA5F5B50B95A49BC155D64D3A4_babel%22}&client=wh5',
          label: '99-5',
          key:'g1ucidd8ed2209264c92d31d5d7e8e8a',
          roleId:'60257509'
        },
         {
          value: 'https://api.m.jd.com/client.action?functionId=newBabelAwardCollection&body={%22activityId%22:%222QwmJao59JSGzjWtEWsT5zgxk291%22,%22scene%22:1,%22args%22:%22key=gcu1i1d2ef24012f42bc7549e9a99be2,roleId=60257525,strengthenKey=C225838DC1351F9ACA8548E3171FF8A4A79652C3B40AA10EA6208B56F12A9AF708B8A2FA5F5B50B95A49BC155D64D3A4_babel%22}&client=wh5',
          label: '100-7',
          key:'gcu1i1d2ef24012f42bc7549e9a99be2',
          roleId:'60257525'
        },
      ],
      optionVal: '',
      currentTime: "",
      preStartUp: false, //预先启动，降低冷启动、并发实例及业务代码初始化引起的耗时
      clock: 0, //开始倒计时
      count: [],
      timer: [],
      isStart: false, //是否开始
      showInfo: "",
      jdCouponInterval: 0, //京东定时器
      startPickerOptions: {
        start: "00:00",
        step: "01:00",
        end: "23:59:59"
      },
      tableData: [],
      labelPosition: "right",
      ruleForm: {
        url:
          "https://api.m.jd.com/client.action?functionId=newBabelAwardCollection&body={%22activityId%22:%222QwmJao59JSGzjWtEWsT5zgxk291%22,%22scene%22:1,%22args%22:%22key=gcu1i1d2ef24012f42bc7549e9a99be2,roleId=60257525,strengthenKey=C225838DC1351F9ACA8548E3171FF8A4A79652C3B40AA10EA6208B56F12A9AF708B8A2FA5F5B50B95A49BC155D64D3A4_babel%22}&client=wh5",
        startTime: "",
        count: 1,
        step: 300,
        advance: -200
      },
      rules: {
        url: [{ required: true, message: "地址不能为空" }],
        startTime: [{ required: true, message: "开始时间不能为空" }],
        advance: [
          { required: true, message: "提前时间不能为空" },
          { type: "number", message: "提前时间必须为数字值" }
        ],
        step: [
          { required: true, message: "间隔时间不能为空" },
          { type: "number", message: "间隔时间必须为数字值" }
        ],
        count: [
          { required: true, message: "领取次数不能为空" },
          { type: "number", message: "领取次数必须为数字值" }
        ]
      },
      accountForm: {
        name: "",
        value: ""
      },
      accountRules: {
        value: [{ required: true, message: "账户不能为空" }]
      },
      logs: []
    };
  },
  computed: {
    btnTxt: function () {
      return this.isStart ? "停止" : "开始";
    }
  },
  components: {},
  created() {
    if (window.localStorage.getItem("account")) {
      this.tableData = JSON.parse(localStorage.getItem("account"));
    }
    if (window.localStorage.getItem("setting")) {
      this.ruleForm = JSON.parse(localStorage.getItem("setting"));
      if (this.ruleForm.startTime) {
        this.ruleForm.startTime = new Date(this.ruleForm.startTime);
      }
    }
    //this.init()
  },
  methods: {
    //开始
    submitRulesForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          this.preStartUp = false;
          this.count = [];
          this.timer = [];
          if (this.isStart) {
            this.isStart = false;
            this.clock && window.clearTimeout(this.clock);
            console.log(this.clock);
          } else {
            this.init();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.tableData.splice(index, 1);
    },
    //添加账号
    addAccount(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          let info = _this[formName];
          _this.tableData.push({
            name: info.name,
            value: info.value,
            disabled: false
          });
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //保存消息
    saveAccountInfo() {
      if (this.tableData.length == 0) {
        window.localStorage.removeItem("account");
      } else {
        window.localStorage.setItem("account", JSON.stringify(this.tableData));
      }
    },
    //保存设置
    setting() {
      window.localStorage.setItem("setting", JSON.stringify(this.ruleForm));
    },
    async init() {
      try {
        let _this = this;
        if (_this.tableData.length == 0) {
          _this.$message.error({
            message: "请检查账户信息",
            type: "error"
          });
          return;
        }
        _this.isStart = true;
        let res = await common.getJdTime();
        let now = new Date().getTime();
        this.currentTime = now - parseInt(res.currentTime2);
        let time = this.ruleForm.startTime;
        let h = time.getHours();
        let m = time.getMinutes();
        let s = time.getSeconds();
        var starttime = new Date(parseInt(res.currentTime2)); //服务器时间
        var hours = starttime.setHours(h);
        var min = starttime.setMinutes(m);
        var sec = starttime.setSeconds(s);
        var sec = starttime.setMilliseconds(0);
        var count = 0;
        var interval = 50;

        //var misec = starttime.setMilliseconds(ms || 0);
        starttime = new Date(
          new Date(starttime).getTime() + this.ruleForm.advance
        );
        console.log(starttime);
        var localNowtime = new Date();
        var difference = localNowtime.getTime() - parseInt(res.currentTime2); //时间差
        var starttimes = starttime.getTime();
        let _interval = function () {
          let _self = this;
          count++;
          _this.clock && window.clearTimeout(_this.clock);
          let nowtime1 = new Date(); //获取当前时间
          let offset = nowtime1.getTime() - (now + count * interval);
          let nowtimes = nowtime1.getTime() - difference; //校对当前时间
          //'开始(毫秒):'+parseInt(starttimes) ,'当前(毫秒):'+parseInt(nowtimes),
          console.log(
            "%c" +
            parseInt(starttimes - parseInt(nowtimes)) / 1000 +
            "秒后开始,时间差:" +
            difference +
            "ms",
            "color: #7ED0A7;"
          );
          _this.showInfo =
            parseInt(starttimes - parseInt(nowtimes)) / 1000 +
            "秒后开始,时间差:" +
            difference +
            "ms";
          //$('#dingshiEd').removeAttr('disabled').removeClass('layui-btn-disabled');
          if (parseInt(starttimes) - parseInt(nowtimes) <= 0) {
            _this.showInfo = "已开始自动抢券";
            console.log("已开始自动抢券");
            //_this.jdCouponInterval = setInterval(_this.getJdCoupon, _this.ruleForm.step); //n毫秒查询一次库存,单位毫秒 自己根据情况修改
            _this.clock && window.clearTimeout(_this.clock);
            _this.startGetCouponInterval();
            //console.log(_this.clock)
            return;
          } else if (parseInt(starttimes) - parseInt(nowtimes) <= 10000) {
            _this.preStartUpInterval();
          }

          _this.clock = window.setTimeout(() => {
            _interval();
          }, interval - offset);
          //console.log(_this.clock)
        };
        _interval();
      } catch (error) {
        this.$message.error({ message: error, type: "error" });
      }
    },
    //预先请求，解决并发问题。
    preStartUpInterval() {
      let _this = this;
      if (!_this.preStartUp) {
        _this.preStartUp = true;
        console.log("preStartUpInterval");
        let canUseData = 1;
        _this.tableData.forEach(el => {
          if (!el.disabled) {
            canUseData++;
          }
        });
        let preMax = _this.ruleForm.count * canUseData;
        console.log(preMax);
        let preCount = 0;
        let _preInterval = function () {
          preCount++;
          if (preCount > preMax) {
            preTimer && window.clearTimeout(preTimer);
            return;
          }
          _this.getJdCoupon({ value: "pre-start-up" }, 0, 0);
          let preTimer = window.setTimeout(function () {
            _preInterval();
          }, _this.ruleForm.step / canUseData);
        };
        _preInterval();
      }
    },
    startGetCouponInterval() {
      // if (this.count > this.ruleForm.count) {
      //   _this.jdCouponInterval && clearInterval(_this.jdCouponInterval)
      //   return
      // }
      let _this = this;
      let max = this.ruleForm.count;
      let _interval = function (el, index) {
        let count = _this.count[index] || 0;
        count++;
        _this.$set(_this.count, index, count);
        //console.log('%ccoupon:' + el + ' ' + count[index] + '/' + max + ' ' + 'jd time:' + new Date(new Date().getTime() - currentTime).Format("MM-dd HH:mm:ss.xx") + ' ' + rdata.subCodeMsg, 'color:#B086D5;')
        if (count > max) {
          _this.timer[index] && window.clearTimeout(_this.timer[index]);
          return false;
        }
        _this.getJdCoupon(el, index, count);
        let timer = window.setTimeout(() => {
          _interval(el, index);
        }, _this.ruleForm.step);
        _this.$set(_this.timer, index, timer);
      };
      this.tableData.forEach((el, index) => {
        // _this.count.push(0)
        // _this.timer.push(0)
        _interval(el, index);
      });
    },
    getJdCoupon(el, index, count) {
      let _this = this;
      let moment = require("moment");
      if (!el.disabled) {
        let startReqTime = new Date().getTime() - parseInt(_this.currentTime);
        jd
          .getCoupon({
            url: _this.ruleForm.url,
            ck: el.value
          })
          .then(res => {
            let endReqTime = new Date().getTime() - parseInt(_this.currentTime);
            _this.logs.push({
              account: "No." + (index + 1),
              count: "第" + count + "次",
              log: JSON.stringify(res),
              id: index + "" + count + "" + new Date().getTime(),
              startReqTime: moment(startReqTime).format("HH:mm:ss:SSS"),
              endReqTime: moment(endReqTime).format("HH:mm:ss:SSS"),
              diff: endReqTime - startReqTime
            });
          })
          .catch(error => {
            let endReqTime = new Date().getTime() - parseInt(_this.currentTime);
            _this.logs.push({
              account: "No." + (index + 1),
              count: "第" + count + "次",
              log: JSON.stringify(error),
              id: index + "" + count + "" + new Date().getTime(),
              startReqTime: moment(startReqTime).format("HH:mm:ss:SSS"),
              endReqTime: moment(endReqTime).format("HH:mm:ss:SSS"),
              diff: endReqTime - startReqTime
            });
          });
      }
    },

    clearLog() {
      this.logs = [];
    },
    selectChange(val){
      this.ruleForm.url = val
    }
  }
};
</script>
