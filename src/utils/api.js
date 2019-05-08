import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import domain from '../domain.js';

const api = {
    request: params => {
        const {
            url,
            method,
            data
        } = params
        return new Promise(async (resolve,reject) => {
            await axios({
                url: domain.testUrl + url + '?token='+localStorage.getItem('sk')+ getBody(method,data),
                method,
                headers: { "Content-Type": "application/json;charset=UTF-8"},
                data: method == 'POST' || method == 'post' ? data : undefined
            })
            .then( res => {
                //console.log(res)
                if(res.status == 200){
                    if(!res.data.state){
                        Notification.error({
                            title: '错误',
                            message: res.data.message
                        })
                    }
                    resolve(res)
                }else{
                    reject(err)
                }
                if(res.data.message =='Token过期' || res.data.message =='Token has expired'){
                    api.request({
                        url: "refreshToken",
                        method: "POST",
                    }).then(res=>{
                        console.log(res)
                        if(res.data.state ==true){
                           var token =res.data.data;
                            localStorage.setItem('sk',token);
                            var n = token.split(".");
                            var m =window.atob(n[1])
                            var b =eval('(' + m + ')');;
                            localStorage.setItem('user_id',b.sub.id);
                            localStorage.setItem('uname',b.sub.name);
                            localStorage.setItem('headimg',b.sub.headimg);
                            localStorage.setItem('expTime',b.exp);
                        }
                    },res => {
                        this.$notify.error({
                        title: "错误",
                        message: "数据请求失败"
                        });
                    })
                }
            })
            .catch(err => {
                reject(err)
                Notification.error({
                    title: '请求失败',
                    message: err.message
                })
            });
        })
    }
}

function getBody(method,obj) {
   if (obj && (method == 'get' || method == 'GET')){
        let arr = []
        for (let key in obj) {
            let value = obj[key]
            arr.push( key + '=' + value)
        }
       return "&" + arr.join('&')
    }
    return ''
}

export default api
