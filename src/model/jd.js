import { Http } from "../util/http";
class Jd extends Http {
  getCoupon(param) {
    let _this = this;
    return _this.request({
      url: "/newjd",
      method: "post",
      param: param,
      headers:{
        "Content-Type":"application/json"
      }
    });
  }
}
export { Jd };