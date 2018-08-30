import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'https://wd3304268149qkrfbn.wilddogio.com/'

Vue.config.devtools = true

new Vue({
    el: 'body',
    components: { App },
    store: store
});