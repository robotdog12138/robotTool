import { Http } from "../util/http";
class Common extends Http {
  getJdTime(param) {
    let _this = this;
    return _this.request({
      url: "/jdtime",
      method: "get",
      param: param,
      // headers:{
      //   "Content-Type":"application/json;charset=utf-8"
      // }
    });
  }
}
export { Common };
