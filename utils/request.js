import { $getStorage, $setStorage } from '../utils/auth.js';

import Vue from 'vue';

import { BASE_URL } from '../config/index.js';

// platformType  1为wechat    2为ali   3为byte_dance
// clientType   1为miniapp    2为app   3为h5
let platformType = '';
let platformSubType = uni.getSystemInfoSync().appName || '';
let clientType = '';
let osType = uni.getSystemInfoSync().platform || '';

// #ifdef MP-WEIXIN
platformType = 'wechat';
clientType = 'miniapp';
// #endif

// console.log('systeminfo====>', uni.getSystemInfoSync())

// #ifdef MP-ALIPAY
platformType = 'alipay';
clientType = 'miniapp';
// #endif

// #ifdef MP-TOUTIAO
platformType = 'byte_dance';
clientType = 'miniapp';
// #endif

// #ifdef APP-PLUS
platformType = 'app';
clientType = 'app';
// #endif

// #ifdef MP-KUAISHOU
platformType = 'kuaishou';
clientType = 'miniapp';
// #endif

// deviceMark是用户端设备标记位
// 格式  platformType_platformSubType_clientType_osType
const deviceMark = platformType + '-' + platformSubType + '-' + clientType + '-' + osType;

var lastUrl = null;
var lastUrlTime = Date.now();
var lastMethod = null;

module.exports = function request(url, method, data, header = {}) {
    // 兼容处理
    if (typeof url == 'object') {
        method = url.method;
        data = url.data;
        header = url.header;
        url = url.url;
    }

    // 限制0.8秒内不能发送重复的POST请求
    if (method === 'POST' && lastUrl === url && lastMethod === method && Date.now() - lastUrlTime < 800) {
        uni.showToast({
            title: '慢点操作哦~',
            icon: 'none'
        });
        uni.hideLoading();
        console.log('已拒绝重复发送POST请求');
        return false;
    }

    // 记录最后一次请求
    lastUrl = url;
    lastUrlTime = Date.now();
    lastMethod = method;

    method = (method || 'GET').toUpperCase();
    header = {
        ...header,
        Authorization: $getStorage('token') || '',
        'Client-Type': deviceMark,
        'Client-Name': 'default'
        // 'Content-Type': 'application/x-www-form-urlencoded',
    };
    // #ifndef MP-WEIXIN
    // 头条系get发送数组参数时需要转换
    if (method === 'GET') {
        let temp = {};
        if (data) {
            for (let key in data) {
                if (Array.isArray(data[key])) {
                    temp[key] = JSON.stringify(data[key]);
                } else {
                    temp[key] = data[key];
                }
            }
        }
        data = temp;
    }
    // #endif

    url = BASE_URL + url;

    let handleFun = (res, resolve, reject) => {
        switch (res.statusCode) {
            case 200:
                resolve(res.data);
                break;
            case 401:
                reject(res);
                uni.hideLoading();
                $setStorage('token', '');

                if ($getStorage('stop_login_time')) {
                    let time = new Date().getTime() - $getStorage('stop_login_time');
                    if (time < 1000) {
                        break;
                    }
                }

                // reject(res);
                // #ifdef APP-PLUS
                uni.navigateTo({
                    url: '/pages/login/app'
                });
                // #endif
                // #ifndef APP-PLUS
                uni.navigateTo({
                    url: '/pages/login/index'
                });
                // #endif
                break;
            case 409:
                reject(res);
                uni.hideLoading();
                if (res.data.code == 40012) {
                    // 需要先绑定手机号
                    uni.showModal({
                        // title: '提示',
                        title: '此操作需要先绑定手机号',
                        confirmText: '去绑定',
                        success: (res) => {
                            if (res.confirm) {
                                uni.navigateTo({
                                    url: '/pages/myProfile/index'
                                });
                            }
                        }
                    });
                } else {
                    uni.showModal({
                        // title: '提示',
                        title: res.data.message || '系统繁忙',
                        showCancel: false
                    });
                }
                break;
            case 500:
                reject(res);
                uni.showModal({
                    title: '提示',
                    content: '服务器开小差了哦~',
                    showCancel: false
                });
                uni.hideLoading();
                break;
            default:
                uni.hideLoading();
                reject(res);
                break;
        }
    };

    return new Promise((resolve, reject) => {
        uni.request({
            url: url,
            method: method || 'GET',
            data: data,
            header: header,
            success: (res) => {},
            error: (err) => {
                uni.hideLoading();
                reject(err);
                uni.showModal({
                    title: '提示',
                    content: '网络错误！',
                    showCancel: false
                });
            },
            complete: (res) => {
                // 所有处理过程转移到此处
                handleFun(res, resolve, reject);
            }
        });
    });
};
