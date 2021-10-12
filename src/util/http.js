import axios from "axios";
class Http {
    constructor() {
        this.scfApi =
            "https://service-ci2v2f0n-1252639209.bj.apigw.tencentcs.com/release/";
    }
    request({ url, method = "get", param = {}, headers = {} }) {
        let _this = this;
        //this.showLoading();
        return new Promise((resolve, reject) => {
            axios
                .request({
                    // `url` 是用于请求的服务器 URL
                    url: url,
                    // `method` 是创建请求时使用的方法
                    method: method, // default
                    //params: param,
                    data: param,
                    headers: headers, //有些需要自己设置请求头的接口，需要传入header（json对象）
                })
                .then(function(res) {
                    if (res.status === 200) {
                        if (res.data.result || res.data.code == 0) {
                            //this.hideLoading();
                            resolve(res.data);
                        } else {
                            //this.hideLoading();
                            //this.showToast(res.data.errorMessage, 'none');
                            reject(res.data);
                        }
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        });
    }
}
export { Http };