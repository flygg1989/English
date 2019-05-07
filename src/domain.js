// 配置全局接口域名
const domain ='http://airapp.prosuntech.com:9000/api/admin/'; //测试环境
const uploadUrl ='http://airapp.prosuntech.com:9000/api/admin/upload?token='+localStorage.getItem('sk');  //语音上传接口
const myUploadUrl ='http://airapp.prosuntech.com:9000/api/admin/upload?token='+localStorage.getItem('sk')+'&upload_type=audio';  //自定义语音上传
const voiceUrl ='http://airapp.prosuntech.com:9000/storage';
const token='?token='+localStorage.getItem('sk')

export default {
  testUrl:domain,
  testToken:token,
  uploadUrl:uploadUrl,
  myUploadUrl:myUploadUrl,
  voiceUrl:voiceUrl,
}