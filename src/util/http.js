/*
 * @Author: lyice fcyx666@gmail.com
 * @Date: 2021-10-12 19:26:11
 * @LastEditors: lyice fcyx666@gmail.com
 * @LastEditTime: 2023-03-20 11:30:05
 * @FilePath: \robotTool\src\util\http.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import axios from "axios";
class Http {
    constructor() {
        this.scfApi =
            "https://service-dj27j3l1-1256166403.bj.apigw.tencentcs.com/release/";
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
                        if (res.data.result || res.data.code == 0 || res.data.code == 200) {
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