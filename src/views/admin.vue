<template>
  <div>
    <el-row>
      <el-col :md="16" :xs="24">
        <el-row>
          <el-col :span="24">
            <el-card class="box-card" shadow="always">
              <div slot="header" class="clearfix">
                <span>admin</span>
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

                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">

                          <el-form-item label="名字" prop="label">
                            <el-input v-model="ruleForm.label" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="网址" prop="url">
                            <el-input v-model="ruleForm.url" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="类型" prop="type">
                            <el-input v-model="ruleForm.type" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="warning" @click="submitRulesForm('ruleForm')">提交</el-button>
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
                        <span>列表</span>
                      </div>
                      <div>
                        <el-table :data="options" stripe border style="width: 100%">
                          <el-table-column prop="name" label="名称" width="120">
                          </el-table-column>
                          <el-table-column prop="type" label="类型" width="80">
                          </el-table-column>
                          <el-table-column prop="url" :show-overflow-tooltip="true" label="网址">
                          </el-table-column>

                          <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                          </el-table-column>

                        </el-table>
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
import { Common } from "../model/common";
import { sleep } from "../util/utils"
import { Jd } from "../model/jd";
let common = new Common();
let jd = new Jd();
export default {
  name: "admin",
  data() {
    return {
      options: [],
      ruleForm: {
        label: "",
        url: "https://api.m.jd.com/client.action?functionId=newBabelAwardCollection&body={%22activityId%22:%222QwmJao59JSGzjWtEWsT5zgxk291%22,%22scene%22:1,%22args%22:%22key=gcu1i1d2ef24012f42bc7549e9a99be2,roleId=60257525,strengthenKey=C225838DC1351F9ACA8548E3171FF8A4A79652C3B40AA10EA6208B56F12A9AF708B8A2FA5F5B50B95A49BC155D64D3A4_babel%22}&client=wh5",
        type: "api"
      },
      rules: {
        url: [{ required: true, message: "地址不能为空" }],
        label: [{ required: true, message: "名称不能为空" }],
        type: [{ required: true, message: "类型不能为空" }],
      }
    };
  },
  computed: {

  },
  components: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      jd.getCouponList().then(res => {
        this.options = res.data;
      })
    },
    handleDelete(index, row) {
      console.log(index, row);
      const id = row.id;
      jd.removeCoupon({
        id: id,
      }).then((res) => {
        this.$message({
          message: '成功',
          type: 'success'
        });
        this.options.splice(index, 1);
      })
    },
    addCoupon() {
      let _this = this;
      console.log(jd)
      jd.addCoupon({
        value: _this.ruleForm.url,
        label: _this.ruleForm.label,
        type:_this.ruleForm.type
      }).then((res) => {
        this.$message({
          message: '成功',
          type: 'success'
        });
        this.init()
      })
    },
    //开始
    submitRulesForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          this.addCoupon()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

  }
};
</script>
