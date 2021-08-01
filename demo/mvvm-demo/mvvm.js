class MVVM {
    constructor(el, data) {
        this.el = document.querySelector(el);
        // 定义临时存储数据的变量_data
        // this._data = data; //Object.defineProperty使用
        this.data = data;
        // dom池，存放符合{{}}模板语法的dom
        this.domPool = {};

        this.init();
    }

    init() {
        // 初始化数据，将数据变为响应式的数据
        this.initData();
        // dom初始化
        this.initDom()
    }

    initDom() {
        this.bindDom(this.el);
        this.bindInput(this.el);
    }


    initData() {
        const _this = this;
        // this.data = {};
        // for (const key in this._data) {
        //     // 数据劫持
        //     Object.defineProperty(this.data, key, {
        //         get() {
        //             return _this._data[key];
        //         },

        //         set(newValue) {
        //             // 有了domPool，就可以根据key值替换成新的数据
        //             _this.domPool[key].innerHTML = newValue;
        //             _this._data[key] = newValue;
        //         }
        //     });
        // }
        
        /**
         * Proxy方式实现
         */
        this.data = new Proxy(this.data, {
            get(target, key) {
                return Reflect.get(target, key);
            },

            set(target, key, value) {
                _this.domPool[key].innerHTML = value;
                return Reflect.set(target, key, value);
            }
        });
        console.log(this.data);
    }

    // 在#el下递归处理带有{{}}标识的dom
    bindDom(el) {
        const _childNodes = el.childNodes;
        _childNodes.forEach(item => {
            // 判断当前节点是不是文本节点
            if(item.nodeType === 3) {
                const _value = item.nodeValue;
                if(_value.trim().length) {
                    // 判断是否符合{{}}语法条件
                    let isValid = /\{\{(.+?)\}\}/.test(_value);
                    if(isValid) {
                        // 拿到{{}}中的key值
                        const _key = _value.match(/\{\{(.+?)\}\}/)[1].trim();
                        // 这样每次就可以根据key替换它的innerText
                        this.domPool[_key] = item.parentNode;
                        // dom节点赋值，没有的话默认undfined
                        item.parentNode.innerText = this.data[_key] || undefined;
                    }
                }
            }
            // 如果item存在子节点，递归处理dom
            item.childNodes && this.bindDom(item);
        });
    }


    // 处理input绑定的事件input/keyup
    bindInput(el) {
        const _allInput = el.querySelectorAll('input');
        _allInput.forEach(input => {
            // 获取v-model属性
            const _vModel = input.getAttribute('v-model');
            if(_vModel) { //这里简单判断，只为了实现v-model，其他的不扩展
                input.addEventListener('keyup', this.handleInput.bind(this, _vModel, input), false)
            }
        });
    }

    handleInput(key, input) {
        const _value = input.value;
        this.data[key] = _value;

        console.log(this.data);
    }

    // 设置dom数据，不操作dom
    setName(key, value) {
        this.data[key] = value;
    }
}