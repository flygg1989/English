// 配置全局接口域名

const domain = 'http://api.wz.cnhubei.com/api/admin/';
const token='?token='+localStorage.getItem('sk')

export default {
  testUrl:domain,
  testToken:token
}