const Hammer = require('hammerjs')

const gestures = [
  'tap', 'pan', 'pinch', 'press', 'rotate', 'swipe', 'doubletap',
  'swipeleft', 'swiperight', 'panleft', 'panright'
]
const disabled = ['pinch', 'rotate'];
const directions = ['up', 'down', 'left', 'right', 'horizontal', 'vertical', 'all'];
const preset = [
  // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
  [Hammer.Rotate, {enable: false}],
  [Hammer.Pinch, {enable: false}, ['rotate']],
  [Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL}],
  [Hammer.Pan, {direction: Hammer.DIRECTION_HORIZONTAL}, ['swipe']],
  [Hammer.Tap],
  [Hammer.Tap, {event: 'doubletap', taps: 2}, ['tap']],
  [Hammer.Press]
];
class VueHammer {
  constructor() {
    this.preset = preset.slice();
    this.disabled = disabled.slice();
    this.gestures = gestures.slice();
    Hammer.defaults.preset = this.preset;
    this.options = {
      tapWithDouble: true, // 双击事件判定时，是否触发单击事件
      bubbles: false // 是否被冒泡上来的手势事件影响
    };
  }
  install(Vue, options) {
    console.log('vue options', options);
    const opt = {
      ...this.options,
      ...options
    };
    this.registerDirective(Vue, opt);
  }
  // 获取默认支持的手势动作
  getGestures() {
    return gestures.slice()
  }
  // 新增手势动作
  addGestures(g) {
    this.gestures.push(g);
  }
  // 重置支持的手势动作
  resetGestures(gestures) {
    this.gestures = gestures.slice();
  }
  // 获取初始的disabled
  getDisabled() {
    return disabled.slice();
  }
  // 重置disabled
  // 官方文档rotate和pinch会使元素阻塞，默认关闭
  resetDisabled(list) {
    this.disabled = list.slice();
  }
  // 获取初始的preset配置
  getDefaultPreset() {
    return preset.slice();
  }
  // 重置preset
  resetPreset(preset) {
    this.preset = preset.slice();
  }
  // 添加新的preset
  addPreset(p) {
    // [RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]]
    this.preset.push(p);
  }
  // 创建hammer事件
  createHammer(options, el, binding, vNode) {
    // 判断是不是单个参数，防止有些数组作为单个参数传入被判定为多个参数
    const singleArg = binding.modifiers.singleArg || false;
    // 判断是否需要hammer的event事件
    const needEvent = binding.modifiers.needEvent || false;
    // 判断冒泡的事件是否触发函数
    const bubbles = binding.modifiers.bubbles || false;
    // 读取所有绑定的事件
    const events = Object.keys(binding.modifiers).filter(v => {
      const arr = ['singleArg', 'needEvent', 'bubbles'];
      return !arr.includes(v);
    });
    if (!events.length) {
      return;
    }
    // 获取参数传递
    let arg = binding.arg || [];
    if ((!Array.isArray(arg)) || singleArg) {
      arg = [arg];
    }
    const mc = el.hammer || new Hammer(el);

    // 如果有单击事件和双击事件，并且tapWithDouble为false
    if (!options.tapWithDouble) {
      const mcEvents = Object.keys(mc.handlers || {});
      // 一个指令中有点击和双击事件
      const bool1 = events.includes('tap') && events.includes('doubletap');
      // 已经绑定了单击或者双击事件，指令中出现了另一个
      const bool2 = events.includes('tap') && mcEvents.includes('doubletap');
      const bool3 = events.includes('doubletap') && mcEvents.includes('tap');

      const bool = bool1 || bool2 || bool3;
      if (bool) {
        const sTap = new Hammer.Tap({event: 'tap', taps: 1 });
        mc.add(sTap);
        sTap.requireFailure(['doubletap']);
      }
    }
    // 绑定事件
    for (let event of events) {
      const res = this.gestures.includes(event);
      if (res) {
        // 如果添加了旋转和缩放事件，把旋转和缩放事件打开
        const dis = this.disabled.includes(event);
        if (dis) {
          mc.get(event).set({
            enable: true
          })
        }
        mc.on(event, (e) => {
          // 不被冒泡的手势影响
          if ((!bubbles) && (!options.bubbles) && (e.target !== el)) {
            return;
          }
          // 把事件event放在最前方传递
          if (needEvent) {
            return binding.value(e, ...arg);
          }
          binding.value(...arg);
        })
      }
    }
    // el绑定mc
    el.hammer = mc;
  }
  // 注册指令
  registerDirective(Vue, options) {
    const me = this;
    Vue.directive('hms', {
      bind(el, binding, vNode) {
        me.createHammer(options, el, binding, vNode);
      },
      inserted(el, binding, vNode) {

      },
      update(el, binding, vNode, oldVNode) {
        if (el.hammer) {
          el.hammer.destroy();
          el.hammer = null;
        }
      },
      componentUpdated(el, binding, vNode, oldVNode) {
        me.createHammer(options, el, binding, vNode);
      },
      unbind(el, binding, vNode) {
        if (el.hammer) {
          el.hammer.destroy();
          el.hammer = null;
        }
      }
    })
  }
}

module.exports = VueHammer;