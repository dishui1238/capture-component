<template>
  <div>
    <div id="capture">
      工作内容：
      <p>今天做了 blablablalalalalalalla</p>
      <p>明天做 blablablalalalalalalla</p>
      <p>吹牛开始~ blablablalalalalalalla</p>
      <p>宫廷玉液酒 blablablalalalalalalla</p>
      <p>一百八一杯 blablablalalalalalalla</p>
      <p>这酒怎么样 blablablalalalalalalla</p>
      <p>听我给你吹—— blablablalalalalalalla</p>
      <p>啊吹！啊吹！ blablablalalalalalalla</p>
      <p>瞧我这张嘴呀！一杯你开胃 blablablalalalalalalla</p>
      <p>二杯你肾不亏 blablablalalalalalalla</p>
      <p>三杯五杯下了肚 blablablalalalalalalla</p>
      <p>保证你的小脸呀 blablablalalalalalalla</p>
      <p>白里透着红啊，红里透着黑 blalalalalalalla</p>
      <p>啊啊？黑不溜啾，绿了叭叽  blalalalalalalla</p>
      <p>粉嘟噜的透着那么美  blalalalalalalla</p>
    </div>
    <button @click="handleClick">click</button>
    <div v-transfer-dom>
      <popup v-model="canvasShow" :should-rerender-on-show="true">
        <notation-canvas
          :canvasWidth="canvasWidth"
          :canvasHeight="canvasHeight"
          :imagesBase64="dataURL"
          @closeCanvas="closeCanvas"
        ></notation-canvas>
      </popup>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { TransferDom, Popup } from 'vux';
import NotationCanvas from '../components/NotationCanvas';
export default {
  name: 'page',
  directives: {
    TransferDom,
  },
  components: { NotationCanvas, Popup },
  data() {
    return {
      dataURL: '',
      canvasWidth: undefined,
      canvasHeight: undefined,
      canvasShow: false,
    };
  },
  methods: {
    /**
     * html2canvas(element, options);
     * --------------------------
     * html2canvas(document.body).then(function(canvas) {
     *    document.body.appendChild(canvas);
     * });
     */
    handleClick() {
      // 将 dom 及其子元素绘制到 canvas 上
      const capture = document.getElementById('capture');
      html2canvas(capture).then((canvas) => {
        this.dataURL = canvas.toDataURL('image/png');
        this.canvasWidth = capture.offsetWidth;
        this.canvasHeight = capture.offsetHeight;
        this.canvasShow = true;
      });
    },
    closeCanvas() {
      this.canvasShow = false;
    },
  },
};
</script>

<style lang="less">
#capture {
  padding: 10px;
}
</style>
