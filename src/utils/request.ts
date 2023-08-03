import { isDevelopment, isH5 } from './platform';
import { forward } from './router';
import { getCommonParams } from '@/config/commonParams';
import env from '@/config/env';
import { hideLoading, showLoading } from '@/config/serviceLoading';
import { z, ZodError } from "zod"

function handleFail(err: { errno: number; errmsg: string }) {
  const { errmsg = '稍候片刻！', errno = -1 } = err;
  switch (errno) {
    case 10000:
      // 特殊异常处理
      forward('login');
      break;

    default:
      uni.showToast({
        title: errmsg
      });
      break;
  }
}

// h5环境开启代理
const apiBaseUrl = isH5 && isDevelopment ? '/api' : env.apiBaseUrl;

function baseRequest(
  method:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
    | undefined,
  url: string,
  data: { isLoading: any }
) {
  let errmsg = ''
  return new Promise((resolve, reject) => {
    showLoading(data.isLoading);
    delete data.isLoading;
    let responseData: unknown;
    uni.request({
      url: apiBaseUrl + url,
      method,
      timeout: 3000,
      header: {
        'content-type':
          method === 'GET'
            ? 'application/json; charset=utf-8'
            : 'application/x-www-form-urlencoded'
      },
      data,
      success: (res: any) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          // if (res.data.errno === 0) {
          //   responseData = res.data;
          // } else {
          //   handleFail(res.data);
          // }
          responseData = res.data;
        } else {
          errmsg = '稍候片刻！'
          console.log(`${res.statusCode}错误`, res);
          
          handleFail({
            errno: -1,
            errmsg
          });
        }
      },
      fail: (e) => {
        // console.log(e);

        errmsg = '请求超时~'
        handleFail({
          errno: -1,
          errmsg
        });
      },
      complete: (data) => {
        console.log('request complete', responseData, data);
        if (typeof responseData === 'undefined') {
          reject(errmsg ? { errMsg: errmsg} : data )
        } else {
          resolve(responseData);
        }
        hideLoading();
      }
    });
  });
}

const http = {
  get: <T>(api: string, params: any) =>
    baseRequest('GET', api, {
      ...getCommonParams(),
      ...params
    }) as Http.Response<T>,
  post: <T>(api: string, params: any) =>
    baseRequest('POST', api, {
      ...getCommonParams(),
      ...params
    }) as Http.Response<T>,
  put: <T>(api: string, params: any) =>
    baseRequest('PUT', api, {
      ...getCommonParams(),
      ...params
    }) as Http.Response<T>
};

export default http;
