<!--
 * @Author: your name
 * @Date: 2021-04-22 14:21:42
 * @LastEditTime: 2021-04-22 16:29:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-capture/capture-component/src/views/page.vue
-->

<template>
  <div>
    <div id="capture">
      工作内容：
      <p>今天 blablablalalalalalalla</p>
      <p>明天 blablablalalalalalalla</p>客户拜访
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
      <p>提交审批 blablablalalalalalalla</p>
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
    handleClick() {
      const capture = document.getElementById('capture');
      /**
       * html2canvas(element, options);
       * --------------------------
       * html2canvas(document.body).then(function(canvas) {
       *    document.body.appendChild(canvas);
       * });
       */
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
