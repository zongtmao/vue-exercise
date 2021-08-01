class VShow {
    constructor(options) {
        // 解构options
        const { el, data, methods } = options;
        this.el = document.querySelector(el);
        this.data = data;
        this.methods = methods;

        this.showPool = new Map();
        this.eventPool = new Map();

        this.init();
    }

    init() {
        this.initData();
        this.initDom(this.el);

        this.initViews(this.showPool);
        this.initEvent(this.eventPool);
    }

    initData() {
        for (let key in this.data) {
            // 改变this指向，使得methods里this调用时能够调用到构造函数上
            Object.defineProperty(this, key, {
                get() {
                    return this.data[key];
                },

                set(newValue) {
                    this.data[key] = newValue;
                    console.log('设置数据', newValue);
                    this.domChange(this.showPool, key);
                }
            });
        }

        console.log(this);
    }

    initDom(el) {
        const _ChildNodes = el.childNodes;
        if(!_ChildNodes.length) {
            return;
        }

        _ChildNodes.forEach(element => {
            if(element.nodeType === 1) {
                const VIf = element.getAttribute('v-if');
                const VShow = element.getAttribute('v-show');
                const VEvent = element.getAttribute('@click');

                if(VIf) {
                    this.showPool.set(element, {
                        type: 'if',
                        show: this.data[VIf],
                        data: VIf
                    });
                } else if(VShow) {
                    this.showPool.set(element, {
                        type: 'show',
                        show: this.data[VShow],
                        data: VShow
                    });
                }

                if(VEvent) {
                    this.eventPool.set(element, this.methods[VEvent]);
                }
            }

            // 递归处理子节点
            this.initDom(element);
        });
    }

    // 初始化视图，根据data里的默认值初始化显示隐藏
    initViews(showPool) {
        this.domChange(showPool);
    }

    domChange(showPool, data) {
        if(!data) {
            // data不存在是初始化dom 循环map数据
            for(let [k, v] of showPool) {
                switch (v.type) {
                    case 'if':
                        // if就比较复杂，要移除dom，但是显示的时候又要在指定位置插入dom,所以移除时要添加标识符
                        v.comment = document.createComment('v-if');
                        // v.show为false时，将dom替换成v.comment
                        !v.show && k.parentNode.replaceChild(v.comment, k)
                        break;
                    case 'show':
                        // show 使用display：none/block控制显示隐藏
                        !v.show && (k.style.display = 'none');
                        break;
                    default:
                        break;
                }
            }

            return;
        }

        // 这里本来是两种逻辑
        for(let [k, v] of showPool) {
            if(v.data === data) {
                switch (v.type) {
                    case 'if':
                        v.show ? k.parentNode.replaceChild(v.comment, k)
                            : v.comment.parentNode.replaceChild(k, v.comment);
                        v.show = !v.show;
                        break;
                    case 'show':
                        v.show ? (k.style.display = 'none') : k.style.display = 'block';
                        v.show = !v.show;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // 绑定的事件处理
    initEvent(eventPool) {
        for(let [k, v] of eventPool) {
            // 按钮点击时需要在劫持的地方修改dom
            k.addEventListener('click', v.bind(this)); //此时html里的methods里的方法就可以调用
        }
    }

}


/**
 * 实现步骤：
 * 1. 代理数据以及数据劫持
 * 2. 初始化dom
 * 3. 初始化视图
 * 4. 根据eventPool 事件处理函数的绑定
 * 5. 改变数据的同时，改变Dom
 * 
 */

/***
 * showPool [
 *   [
 *      dom,
 *      {
 *         show: true/false,
 *         type: if/show,
 *         data: 绑定的变量数据
 *      }
 *   ]
 * ]
 * 
 * eventPool [
 *    [
 *      dom,
 *      methods
 *    ]
 * ]
 */