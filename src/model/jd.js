import { Http } from "../util/http";
class Jd extends Http {
    getCouponInfo(param) {
        let _this = this;
        return _this.request({
            url: "https://www.fengchenyixuan.cn/youhui/coupon.php?couponUrl=" +
                encodeURIComponent(param),
            method: "get"
        });
    }
    addCoupon(param) {
        let _this = this;
        return _this.request({
            url: "/addCoupon",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    removeCoupon(param) {
        let _this = this;
        return _this.request({
            url: "/removeCoupon",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    getCouponList(param) {
        let _this = this;
        return _this.request({
            url: "/getCoupon",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    getCoupon(param) {
        let _this = this;
        return _this.request({
            url: "/newjd",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    getMeituan(param) {
        let _this = this;
        return _this.request({
            url: "/meituan",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    getKmdToken(param) {
        let _this = this;
        return _this.request({
            url: "/yushouToken",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    getKmdCoupon(param) {
        let _this = this;
        return _this.request({
            url: "/yushou",
            method: "post",
            param: param,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
export { Jd };