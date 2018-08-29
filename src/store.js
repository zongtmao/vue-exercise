import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
    state: {
        user: {
            name: 'candy',
            img: 'dist/images/user.jpg'
        },
        // 会话列表
        sessions: [{
                id: 1,
                user: {
                    name: '第一码农',
                    img: 'dist/images/friend1.jpg'
                },
                messages: [{
                    content: 'Hello,这是属于我的聊天系统',
                    date: now
                }]
            },
            {
                id: 2,
                user: {
                    name: '超屌先生',
                    img: 'dist/images/friend2.jpg'
                },
                messages: [{
                    content: 'Hello,我是超屌先生',
                    date: now
                }]
            },
            {
                id: 3,
                user: {
                    name: '米斯特毛',
                    img: 'dist/images/friend3.jpg'
                },
                messages: [{
                    content: 'Hello,我是米斯特毛',
                    date: now
                }]
            },
            {
                id: 4,
                user: {
                    name: '米斯特吴',
                    img: 'dist/images/friend4.jpg'
                },
                messages: [{
                    content: 'Hello,米斯特吴',
                    date: now
                }]
            }
        ],
        currentSessionId: 1,
        filterKey: ''
    },
    mutations: {
        INIT_DATA(state) {
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        // 发送消息
        SEND_MESSAGE({ sessions, currentSessionId }, content) {
            let session = sessions.find(item => item.id === currentSessionId);
            session.messages.push({
                content: content,
                date: new Date(),
                self: true
            });
        },
        // 选择会话
        SELECT_SESSION(state, id) {
            state.currentSessionId = id;
        },
        // 搜索
        SET_FILTER_KEY(state, value) {
            state.filterKey = value;
        }
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    }, {
        deep: true
    }
);

export default store;
export const actions = {
    initData: ({ dispatch }) => dispatch('INIT_DATA'),
    sendMessage: ({ dispatch }, content) => dispatch('SEND_MESSAGE', content),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value)
};