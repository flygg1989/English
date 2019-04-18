import axios from 'axios'
import { Notification } from 'element-ui'
import domain from '../domain.js';

const voiceApi = {
    request: params => {
        const {
            formData
        } = params
        return new Promise(async (resolve,reject) => {
            await axios({
                url: domain.myUploadUrl,
                method:'POST',
                headers: { "Content-Type": "multipart/form-data"},
                data: formData
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

export default voiceApi
