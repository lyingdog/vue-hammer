# vue-hammer
使用vue的自定义指令，基于hammerjs完成手势事件的绑定和使用

# 前言
github地址：https://github.com/lyingdog/vue-hammer

十分感谢使用这个插件，因为是第一个版本，功能可能还不是很完善，如果有问题或者功能缺失，可以提issues，会尽快修复，谢谢。

也可以邮箱联系我m18758428901@163.com

# 安装
```
npm install yyh-vue-hammer
```

# 使用
``` javascript
main.js

import Vue from 'vue'
import App from './App.vue'
import VueHammer from "yyh-vue-hammer";

const hammer = new VueHammer()
Vue.use(hammer)
Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
}).$mount('#app')
```
``` html
*.vue

<template>
  <div id="app">
    <div
        class="content"
        @click="handleClick"
        v-hms:[[5]].tap.singleArg.bubbles="handleTap"
        v-hms.swipeleft.singleArg="handleSwipe"
    >
      <div
          @click.stop
          class="square"
          v-hms:[[1,2,3,4]].tap.singleArg="handleTap"
          v-hms:[arr].swipe.singleArg="handleSwipe"
          v-hms.rotate.needEvent="handleRotate"
          v-hms:[txt].doubletap.needEvent="handleHammerDouble"
          v-hms.panleft.needEvent="handlePan"
          v-hms.pinch.needEvent="handlePinch"
      >
        <button @click.stop="changeTxt">
          {{txt}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {
      title: 1111,
      arr: [1, 2, 3],
      txt: 'lalala'
    }
  },
  methods: {
    handleClick() {
      console.log('click')
    },
    handleTap(value) {
      console.log('hammer tap', value);
    },
    handleSwipe(value) {
      console.log('hammer swipe', value);
    },
    handleRotate(e) {
      console.log('hammer rotate', e)
    },
    handleHammerDouble(e, v) {
      console.log('hammer double tap', e, v);
    },
    handlePan(e) {
      console.log('pan', e)
    },
    handlePinch(e) {
      console.log('pinch', e);
    },
    changeTxt() {
      console.log(111111);
      this.txt = Date.now();
    }
  },
  mounted() {

  }
}
</script>

<style>
.square {
  width: 200px;
  height: 200px;
  background: red;
}
</style>

```
# 使用方法

## 注册
```javascript
options = {
  tapWithDouble: true, // 双击事件判定时，是否触发单击事件
  bubbles: false // 是否被冒泡上来的手势事件影响
};

Vue.use(hammer, [options])
```

## 指令使用
```html
 v-hms:[[5]].tap.singleArg.bubbles.needEvent="handleTap"
 v-hms:[txt].tap="handleTap"

// data
data() {
  return {
    txt: '111'
  }
}
```
v-hms:[[5]] => []中为绑定的参数，[5]代表一个参数5, [1,2,3]代表3个参数1,2,3，如果要把数组[1,2,3]作为一个参数,在后面加上.singleArg

.tap.swipe => 绑定的方法，一个directive可以绑定多个方法

.singleArg => 是否只有一个参数(不加的话，传入数组默认解构)

.bubbles => 事件会被冒泡上来的手势动作触发

.needEvent => 会把event事件传递回来，作为第一个参数

## 修改配置
```javascript
// 默认支持的手势事件
const gestures = [
  'tap', 'pan', 'pinch', 'press', 'rotate', 'swipe', 'doubletap',
  'swipeleft', 'swiperight', 'panleft', 'panright'
]
// 默认关闭的事件
const disabled = ['pinch', 'rotate'];
// 默认的default preset配置
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
  // 内置方法
  
  // 获取初始的preset配置
  getDefaultPreset() {
    return preset.slice();
  }

  // 重置preset
  resetPreset(preset) {
    this.preset = preset.slice();
  }

  // 添加新的preset,添加新的事件,如果新增了手势事件，
  // 需要调用addGestures，把手势事件的名字添加进去
  // const hammer = new VueHammer()
  // hammer.addPreset([Hammer.Tap, {event: 'tribletap', taps: 3}, ['tap', 'doubletap']])
  // hammer.addGestures('tribletap');
  addPreset(p) {
    // [RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]]
    this.preset.push(p);
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
}
```



