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
