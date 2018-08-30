<template>
    <div class="text">
        <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" @keyup="onKeyup"></textarea>
        <img @click="sendUserMessage" class="sendBtn" src="../../dist/images/send.png" alt="">
    </div>    
</template>

<script>

    import axios from 'axios'
    import { actions } from '../store'

    export default {
        vuex: {
            actions: actions
        },
        data () {
            return {
                content: '',
                receiveContent:'你好啊'
            };
        },
        methods: {
            onKeyup (e) {
                if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                    this.sendMessage(this.content);
                    this.receiveMessge();
                    this.content = '';
                }
            },
            sendUserMessage (e) {
                if (this.content.length) {
                    this.sendMessage(this.content);
                    this.receiveMessge();
                    this.content = '';
                }
            },
            receiveMessge () {
                // 发送json数据
                const now = new Date();
                const parse = {
                    content:this.content,
                    data:now
                }
                // 模拟数据
                let mesg = ['你好啊','这个问题难倒小蜜了,呜呜呜~~~','你的问题作为机器的我不明白','大吉大利，今晚吃鸡',
                            '稳稳的一匹','你这么任性，你家里人知道吗','感谢你的反馈，我会加倍努力学习，以后绝对不会被你的问题难倒',
                            '这只是一条测试的信息哦','快跑，毒来了~~~','二零一七很难缠，保温杯，油腻男。多放枸杞，打call来应援。撸起袖子加油干，捶胸口，小拳拳',
                            '社会你哥不一般，小姐姐，真喜欢。各位戏精，开始你表演。当然选择原谅他，金拱门，吃大餐,天天尬聊实在烦，皮皮虾，我们窜。扎心老铁，搞事真不难。竟然还有这操作？秦始皇，快打钱。',
                            '<a href="http://www.w3school.com.cn">可以在W3School这里面好好学习哦</a>','<a href="http://www.w3school.com.cn">W3School</a>',
                            '<a href="http://www.w3school.com.cn">点我跳转学习！！！</a>','<a href="http://www.w3school.com.cn">认真的我都怀疑人生，想看的话，点进来吧</a>',
                            '<a href="http://www.w3school.com.cn">可以在W3School这里面好好学习哦</a>'
                            ];
                axios.post('/chat_data.json',parse)
                        .then((res) => {
                            console.log(res);
                        });
                // 随机吐一条答案
                this.content == '你好' || this.content == '你好啊' ? this.receiveContent = '亲，你好，需要我做什么？'
                                                                    : this.receiveContent = mesg[Math.floor(Math.random() * mesg.length)];
                this.receiveMessage(this.receiveContent);
            }
        }
    };
</script>

<style lang="less" scoped>
    .sendBtn{
        height: 42px;
        width: 45px;
        top:1px;
        right:10px;
        position: absolute;
        cursor: pointer;
    }
    .text {
        height: 45px;
        border-top: solid 1px #ddd;

        textarea {
            padding: 10px;
            height: 100%;
            padding-right: 45px;
            width: 100%;
            border: none;
            outline: none;
            font-family: "Micrsofot Yahei";
            resize: none;
        }
    }
</style>