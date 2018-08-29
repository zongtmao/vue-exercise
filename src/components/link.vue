<template>
    <div class="container">
        <a :href="link">这是一条测试连接</a>
    </div>
</template>
""
<script>
    export default{
        data(){
            return{
                link:"http://baidu.com"
            }
        }
    }
</script>