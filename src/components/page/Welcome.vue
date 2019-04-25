<template>
    <div class="welcome">
        <div>
            <p>
                欢迎使用<br/>
                飞行英语后台管理系统
            </p>
            <br/>
            <img src="static/img/index.png" alt="">
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.welcome div{
    position: absolute;
    top:50%;
    left:50%;
    width:100%;
    transform:translate(-50%,-50%);
    text-align: center;
}
.welcome div p{
    line-height: 30px;
}
.welcome div img{
    padding: 0;
    max-height: 500px;;
}
</style>
