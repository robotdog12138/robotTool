<template>
    <div>
        <el-row class="box-card-ft">
            <el-col :md="16" :xs="24">
            <el-card shadow="never">
                <div slot="header" class="clearfix">
                <span>优惠券信息查询</span>
                </div>
            <div>
                <el-form  :rules="rules" :model="form"  label-width="100px" ref="ruleForm" class="demo-form-inline">
                        <el-form-item label="优惠券链接"  prop="couponUrl">
                            <el-input v-model="form.couponUrl"   placeholder="请输入" ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary"  @click="submitRulesForm('ruleForm')">查询</el-button>
                        </el-form-item>
                    </el-form>
            </div>
            </el-card>
            </el-col>
            
        </el-row>
        <el-row class="box-card-bd" v-if="data[0]">
            <el-col :md="16" :xs="24" >
                <el-card shadow="never" >
                    <el-descriptions :column="3" border title="详细信息如下">
                        <el-descriptions-item  label="券领取开始时间">{{moment(data[0].takeBeginTime).format("YYYY-MM-DD HH:mm:ss")}}</el-descriptions-item>
                        <el-descriptions-item  label="券领取结束时间">{{moment(data[0].takeEndTime).format("YYYY-MM-DD HH:mm:ss")}}</el-descriptions-item>
                        <el-descriptions-item  label="券有效使用开始时间">{{moment(data[0].beginTime).format("YYYY-MM-DD HH:mm:ss")}}</el-descriptions-item>
                        <el-descriptions-item  label="券有效使用结束时间">{{moment(data[0].endTime).format("YYYY-MM-DD HH:mm:ss")}}</el-descriptions-item>
                        <el-descriptions-item  label="券剩余张数">{{data[0].remainNum}}</el-descriptions-item>
                        <el-descriptions-item  label="券总张数">{{data[0].num}}</el-descriptions-item>
                        <el-descriptions-item  label="券面额">{{data[0].discount}}</el-descriptions-item>
                        <el-descriptions-item  label="券消费限额">{{data[0].quota}}</el-descriptions-item>
                        <el-descriptions-item  label="券使用平台">{{data[0].platform}}</el-descriptions-item>
                        <el-descriptions-item content-class-name="my-content" label="券有效状态">{{data[0].yn==1?'是':'否'}}</el-descriptions-item>
                    </el-descriptions>
                </el-card>

            
            </el-col>
        </el-row>
    </div>
   
</template>
<style scoped>
.box-card-bd,
.box-card-ft {
  margin-top: 15px;
}
::v-deep .my-content {
  background: #fde2e2;
}
</style>

<script>
import { Jd } from "../model/jd";
let jd = new Jd();
export default {
  data() {
    return {
      moment: require("moment"),
      form: {
        couponUrl: ""
      },
      data: "",
      rules: {
        couponUrl: [{ required: true, message: "优惠券链接不能为空" }]
      }
    };
  },
  created() {},
  methods: {
    //开始
    submitRulesForm(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          jd
            .getCouponInfo(_this.form.couponUrl)
            .then(res => {
              if (res.code === 200) {
                _this.data = res.data;
              }
              this.$message({
                message: res.msg,
                type: "success"
              });
            })
            .catch(err => {
              this.$message.error(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
