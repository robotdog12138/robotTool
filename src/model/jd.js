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
  getKmdToken(param) {
    let _this = this;
    return _this.request({
      url: "/yushouToken",
      method: "post",
      param: param,
      headers:{
        "Content-Type":"application/json"
      }
    });
  }
  getKmdCoupon(param) {
    let _this = this;
    return _this.request({
      url: "/yushou",
      method: "post",
      param: param,
      headers:{
        "Content-Type":"application/json"
      }
    });
  }
}
export { Jd };