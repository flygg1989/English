// 配置全局接口域名
const domain ='http://airapp.prosuntech.com:9000/api/admin/'; //测试环境
const uploadUrl ='http://airapp.prosuntech.com:9000/api/upload?token='+localStorage.getItem('sk');  //上传接口
//const domain = 'http://api.politics.com/api/admin/';  //正式环境
const token='?token='+localStorage.getItem('sk')

export default {
  testUrl:domain,
  testToken:token,
  uploadUrl:uploadUrl,
}