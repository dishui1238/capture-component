<!--
 * @Author: your name
 * @Date: 2021-04-21 13:41:20
 * @LastEditTime: 2021-04-23 16:10:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-capture/capture-component/src/components/NotationCanvas.vue
-->

<template>
  <div class="notation-canvas-wrapper" ref="notationCanvasContent">
    <!-- 阴影部分 -->
    <div v-show="visible" class="shadow-container">
      <div class="shadow-top"></div>
      <div class="shadow-bottom"></div>
    </div>
    <!-- 头部按钮 -->
    <div class="notation-header">
      <span class="go-back" v-show="visibleBtn">
        <svg
          @click="closeCanvas"
          t="1600650367784"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="12200"
          width="200"
          height="200"
        >
          <path
            d="M511.706311 64.021106C264.433578 64.021106 63.981197 264.473487 63.981197 511.745197s200.452381 447.725114 447.725114 447.725114 447.725114-200.452381 447.725114-447.725114S758.979044 64.021106 511.706311 64.021106zM529.803481 710.385303c52.024887-10.645454 91.159186-56.678884 91.159186-111.852484 0-105.366769-102.46672-106.256022-142.713352-106.256022l0 77.441766L345.361749 441.902502l132.887566-128.796388 0 65.924455c27.724435 0 199.799512 1.353834 199.799512 162.41609C678.048827 628.149347 613.390201 699.045023 529.803481 710.385303z"
            fill="#ffffff"
            p-id="12201"
          />
        </svg>
      </span>
    </div>
    <!-- canvas 内容 -->
    <div class="content">
      <canvas
        id="notation-canvas"
        ref="notationCanvas"
        :width="canvasWidthFull"
        :height="canvasHeightFull"
        @touchstart="canvasStart($event)"
        @touchend="canvasEnd($event)"
        @touchmove="canvasMove($event)"
      >
        <p>您的浏览器暂不支持！</p>
      </canvas>
    </div>
    <!-- 底部 -->
    <div class="footer" v-show="visibleBtn">
      <!-- 颜色盘 -->
      <div class="graffiti-colors">
        <template v-for="colors in graffitiColors">
          <div class="select-color" v-bind:key="colors" @click="() => selectGraffitiColor(colors)">
            <div
              :class="{'color-item-active': currentGraffitiColor === colors}"
              class="color-item"
              :style="{background: colors}"
            ></div>
          </div>
        </template>
        <!-- 撤销图标 白色-->
        <div v-if="drawImageHistory.length" class="withdraw-btn-his" @click="withdrawGraffiti">
          <svg
            t="1600741342265"
            class="icon"
            viewBox="0 0 1218 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="668"
            width="200"
            height="200"
          >
            <path
              d="M0 440.016437L484.87467 0v236.764309c77.844438 10.519519 150.879953 13.900792 220.534194 31.107719 144.643381 35.616085 253.144702 126.083945 341.132962 243.677135 100.987379 135.250954 179.583211 361.796302 171.167596 512.450837-68.452011-147.648958-164.780746-255.474024-301.23393-324.376871-133.823305-67.24978-276.888758-89.040211-428.820664-86.184914v268.848841z"
              p-id="669"
              fill="#ffffff"
            />
          </svg>
        </div>
        <!-- 撤销图标 灰色 -->
        <div v-else class="withdraw-btn">
          <svg
            t="1600691506307"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="666"
            width="200"
            height="200"
          >
            <path
              d="M1024.064 640q0 94.848-72.576 257.728l-6.016 13.728q-4.288 9.728-7.712 17.152t-7.424 12.576q-6.848 9.728-16 9.728-8.576 0-13.44-5.728t-4.864-14.272q0-5.152 1.44-15.136t1.44-13.44q2.848-38.848 2.848-70.272 0-57.728-10.016-103.424t-27.712-79.136-45.728-57.728-60.288-39.712-76-24.288-88-12.288-100.288-3.424h-128v146.272q0 14.848-10.848 25.728t-25.728 10.848-25.728-10.848L10.848 391.488Q0 380.64 0 365.76t10.848-25.728L303.424 47.456q10.848-10.848 25.728-10.848t25.728 10.848 10.848 25.728v146.272h128q407.424 0 500 230.272 30.272 76.576 30.272 190.272z"
              p-id="667"
              fill="#000000"
            />
          </svg>
        </div>
      </div>
      <!-- 涂鸦 图标 -->
      <div class="left select-num">
        <!-- 涂鸦 选中 -->
        <span v-if="isGraffiti" @click="graffitiClick">
          <svg
            t="1600674152427"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1760"
            width="200"
            height="200"
          >
            <path
              d="M907.264 948.224l-49.152-36.864c96.256-122.88 96.256-167.936 92.16-182.272h-2.048c-30.72 0-124.928 38.912-190.464 65.536-167.936 69.632-272.384 110.592-319.488 63.488-49.152-51.2 22.528-147.456 149.504-313.344 40.96-51.2 96.256-124.928 120.832-167.936-61.44 43.008-180.224 159.744-272.384 249.856C157.696 901.12 75.776 968.704 28.672 925.696c-30.72-28.672-79.872-75.776 366.592-847.872l53.248 30.72C120.832 673.792 73.728 829.44 71.68 870.4c57.344-26.624 217.088-182.272 325.632-288.768 258.048-251.904 327.68-311.296 370.688-272.384 47.104 40.96-8.192 116.736-129.024 274.432-57.344 75.776-153.6 198.656-151.552 235.52 30.72 12.288 172.032-47.104 247.808-77.824 153.6-63.488 229.376-94.208 262.144-51.2 38.912 49.152 10.24 129.024-90.112 258.048zM71.68 882.688z"
              fill="#4cc06d"
              p-id="1761"
            />
          </svg>
        </span>
        <!-- 涂鸦 未选中 -->
        <span v-else @click="graffitiClick">
          <svg
            t="1600674152427"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1760"
            width="200"
            height="200"
          >
            <path
              d="M907.264 948.224l-49.152-36.864c96.256-122.88 96.256-167.936 92.16-182.272h-2.048c-30.72 0-124.928 38.912-190.464 65.536-167.936 69.632-272.384 110.592-319.488 63.488-49.152-51.2 22.528-147.456 149.504-313.344 40.96-51.2 96.256-124.928 120.832-167.936-61.44 43.008-180.224 159.744-272.384 249.856C157.696 901.12 75.776 968.704 28.672 925.696c-30.72-28.672-79.872-75.776 366.592-847.872l53.248 30.72C120.832 673.792 73.728 829.44 71.68 870.4c57.344-26.624 217.088-182.272 325.632-288.768 258.048-251.904 327.68-311.296 370.688-272.384 47.104 40.96-8.192 116.736-129.024 274.432-57.344 75.776-153.6 198.656-151.552 235.52 30.72 12.288 172.032-47.104 247.808-77.824 153.6-63.488 229.376-94.208 262.144-51.2 38.912 49.152 10.24 129.024-90.112 258.048zM71.68 882.688z"
              fill="#ffffff"
              p-id="1761"
            />
          </svg>
        </span>
        <!-- 添加文字 -->
        <span>
          <svg
            t="1600674827471"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="589"
            width="200"
            height="200"
          >
            <path
              d="M955.733333 0H68.266667a68.266667 68.266667 0 0 0-68.266667 68.266667v887.466666a68.266667 68.266667 0 0 0 68.266667 68.266667h887.466666a68.266667 68.266667 0 0 0 68.266667-68.266667V68.266667a68.266667 68.266667 0 0 0-68.266667-68.266667z m-204.8 358.4h-187.733333v409.6h-102.4v-409.6H273.066667v-102.4h477.866666z"
              p-id="590"
              fill="#ffffff"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notationCanvas',
  components: {},
  props: {
    imagesBase64: String,
    canvasWidth: Number,
    canvasHeight: Number,
  },
  data() {
    return {
      visible: true,
      visibleBtn: true,
      canvasWidthFull: 0,
      canvasHeightFull: 0,
      context: '',
      currentGraffitiColor: '#e75d5a',
      graffitiColors: [
        '#f9f9f9',
        '#2b2b2b',
        '#e75d5a',
        '#f6c545',
        '#58be6b',
        '#4fabf8',
        '#6168ed',
      ],
      config: {
        lineWidth: 1,
        lineColor: '#f2849e',
        shadowBlur: 1,
      },
      drawImageHistory: [],
      isGraffiti: false,
      drawImageDown: [],
      painting: false,
    };
  },
  mounted() {
    this.drawImages();
  },
  methods: {
    // 关闭遮罩层
    closeCanvas() {
      this.$emit('closeCanvas');
    },

    drawImages() {
      let notationCanvas = this.$refs.notationCanvas;
      notationCanvas.style.width = this.canvasWidth + 'px';
      notationCanvas.style.height = this.canvasHeight + 'px';
      // 浏览器是否支持 canvas 标签
      if (notationCanvas.getContext) {
        // const canvasWidth = this.canvasWidth;
        // getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性。
        let ctx = notationCanvas.getContext('2d'); // 获取上下文
        this.context = ctx;
        let ratio = this.getPixelRatio(ctx);

        const canvasWidth = this.canvasWidth * ratio;
        this.canvasWidthFull = this.canvasWidth * ratio;
        this.canvasHeightFull = this.canvasHeight * ratio;

        let img = new Image();
        img.src = this.imagesBase64;
        img.onload = function () {
          ctx.drawImage(
            this,
            0,
            0,
            canvasWidth,
            (canvasWidth / img.width) * img.height
          );
        };
      }
    },

    // 解决canvas绘制模糊的问题
    getPixelRatio(context) {
      let backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    },

    selectGraffitiColor(graffitiColor) {
      this.currentGraffitiColor = graffitiColor;
      this.setCanvasStyle();
    },

    canvasStart(e) {
      // 开启时才画，而且画的时候把其他的隐藏
      console.log('start', e);
      if (this.isGraffiti) {
        this.visibleBtn = false;
        // 让move方法可用
        this.painting = true;
        // client是基于整个页面的坐标
        // offset是cavas距离顶部以及左边的距离

        /**
         * 1. TouchEvent.changedTouches
         * 对于 touchstart 事件, 这个 TouchList 对象列出在此次事件中 **新增加** 的触点。
         * 对于 touchmove 事件，列出和上次事件相比较，发生了变化的触点。
         * 对于 touchend 事件，changedTouches 是已经从触摸面的离开的触点的集合（也就是说，手指已经离开了屏幕/触摸面。
         *
         * 2. TouchEvent.touches
         * 一个 TouchList，其会列出所有 当前 在与触摸表面接触的 Touch 对象，不管触摸点是否已经改变或其目标元素是在处于 touchstart 阶段。
         *
         */

        // 计算 start 开始点的坐标
        const canvasX =
          e.changedTouches[0].clientX - e.target.parentNode.offsetLeft;
        const canvasY =
          e.changedTouches[0].clientY -
          e.target.parentNode.offsetTop +
          (this.$refs.notationCanvasContent.scrollTop || 0);
        let ratio = this.getPixelRatio(this.context);
        // 设置canvas的配置
        this.setCanvasStyle();
        // 清除子路径
        this.context.beginPath();
        // 移动的起点
        this.context.moveTo(canvasX * ratio, canvasY * ratio);

        this.drawImageHistory.push({
          x: canvasX,
          y: canvasY,
          color: this.currentGraffitiColor,
          mode: 'down',
        });
      }
    },
    canvasMove(e) {
      if (this.painting) {
        // 只有允许移动时调用
        console.log('move:', e);
        const t = e.target;
        let canvasX;
        let canvasY;
        // 由于手机端和pc端获取页面坐标方式不同，所以需要做出判断
        canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft;
        canvasY =
          e.changedTouches[0].clientY -
          t.parentNode.offsetTop +
          (this.$refs.notationCanvasContent.scrollTop || 0);

        let ratio = this.getPixelRatio(this.context);
        // 连接到移动的位置并上色
        this.context.lineTo(canvasX * ratio, canvasY * ratio);
        this.context.stroke(); // 绘制已定义的路径

        this.drawImageHistory.push({
          x: canvasX,
          y: canvasY,
          color: this.currentGraffitiColor,
          mode: 'move',
        });
      }
    },
    canvasEnd(e) {
      if (this.isGraffiti) {
        this.visibleBtn = true;
        // 设置move时不可绘制
        this.painting = false;

        // 只有允许移动时调用
        const t = e.target;
        let canvasX;
        let canvasY;
        // 由于手机端和pc端获取页面坐标方式不同，所以需要做出判断
        canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft;
        canvasY =
          e.changedTouches[0].clientY -
          t.parentNode.offsetTop +
          (this.$refs.notationCanvasContent.scrollTop || 0);

        this.drawImageHistory.push({
          x: canvasX,
          y: canvasY,
          color: this.currentGraffitiColor,
          mode: 'up',
        });
        // 存储
        this.drawImageDown.push(this.drawImageHistory.length - 1);
        console.log('drawImageDown', this.drawImageDown);
      }
    },

    setCanvasStyle() {
      this.context.lineWidth = this.config.lineWidth;
      this.context.shadowBlur = this.config.shadowBlur;
      this.context.shadowColor = this.currentGraffitiColor;
      this.context.strokeStyle = this.currentGraffitiColor;
    },

    // 点击开启或者关闭涂鸦
    graffitiClick() {
      this.isGraffiti = !this.isGraffiti;
    },

    // 撤销涂鸦
    withdrawGraffiti() {
      let last = this.drawImageDown.pop() || 0;
      // 撤销绘画
      this.drawImageHistory.splice(last, this.drawImageHistory.length - last);
      // 光删一个还不完美，要把相应的删了，两个数组，一个记录所有的点，一个记录down点时的数组长度
      this.redrawAll();
    },

    redrawAll() {
      let length = this.drawImageHistory.length;
      if (length === 0) {
        return;
      }

      let ratio = this.getPixelRatio(this.context);

      let ctx = this.context;
      let width = this.canvasWidth * ratio;
      let drawImageHistory = this.drawImageHistory;
      let config = this.config;

      const tempCanvas = document.createElement('canvas'); // 新建一个 canvas 作为缓存 canvas
      const tempCtx = tempCanvas.getContext('2d');

      let img = new Image();
      img.src = this.imagesBase64;
      img.onload = function () {
        let height = (width / img.width) * img.height;
        tempCanvas.width = width;
        tempCanvas.height = height; // 设置宽高
        tempCtx.drawImage(this, 0, 0, width, height);

        // 在给定的矩形内清除指定的像素
        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(tempCanvas, 0, 0);

        for (let i = 0; i < length; i++) {
          var draw = drawImageHistory[i];

          if (draw.mode === 'down') {
            ctx.lineWidth = config.lineWidth + 1;
            ctx.shadowBlur = config.shadowBlur;
            ctx.shadowColor = draw.color;
            ctx.strokeStyle = draw.color;
            ctx.beginPath();
            ctx.moveTo(draw.x * ratio, draw.y * ratio);
          }
          if (draw.mode === 'move') {
            ctx.lineTo(draw.x * ratio, draw.y * ratio);
          }
          if (draw.mode === 'up') {
            ctx.stroke();
          }
        }
      };
    },
  },
};
</script>

<style lang="less">
.notation-canvas-wrapper {
  box-sizing: border-box;
  height: calc(100vh);
  width: calc(100vw);
  // background-color: #010101;
  position: relative;
  overflow: auto;

  .shadow-container {
    overflow: hidden;
    z-index: 20;
    pointer-events: none;
    .shadow-top {
      position: fixed;
      top: -60px;
      right: -60px;
      left: -60px;
      height: 120px;
      background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.1)
      );
      background: -o-linear-gradient(
        top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.1)
      );
      background: -moz-linear-gradient(
        top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.1)
      );
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.1)
      );
      -webkit-filter: blur(10px);
      -moz-filter: blur(10px);
      -ms-filter: blur(10px);
      filter: blur(10px);
      pointer-events: none;
    }
    .shadow-bottom {
      position: fixed;
      right: -60px;
      bottom: -60px;
      left: -60px;
      height: 140px;
      background: -webkit-linear-gradient(
        top,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.2)
      );
      background: -o-linear-gradient(
        top,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.2)
      );
      background: -moz-linear-gradient(
        top,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.2)
      );
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.2)
      );
      -webkit-filter: blur(10px);
      -moz-filter: blur(10px);
      -ms-filter: blur(10px);
      filter: blur(10px);
      pointer-events: auto;
    }
  }
  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .notation-header {
    position: fixed;
    top: 5px;
    right: 15px;
    left: 15px;
    font-size: 30px;
    z-index: 200;
    pointer-events: none;
    .go-back {
      pointer-events: auto;
    }
  }
  .footer {
    position: fixed;
    right: 15px;
    bottom: 15px;
    left: 20px;
    z-index: 200;
    pointer-events: none;
    .left {
      float: left;
      font-size: 18px;
      span {
        margin-right: 20px;
        pointer-events: auto;
      }
    }
    .right {
      float: right;
      pointer-events: auto;
    }
    .graffiti-colors {
      position: fixed;
      right: 0px;
      bottom: 40px;
      left: 0px;
      display: flex;
      margin: 0 auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      pointer-events: auto;
      .select-color {
        width: 20px;
        height: 20px;
        padding: 3px;
        .color-item {
          width: 15px;
          height: 15px;
          box-shadow: 0 0 0 3px #ffffff;
          border-radius: 15px;
          pointer-events: auto;
        }
        .color-item-active {
          box-shadow: 0 0 0 5px #ffffff;
        }
      }
      .withdraw-btn-his {
        position: relative;
        width: 20px;
        height: 20px;
        margin-top: -2px;
        pointer-events: auto;
        div {
          position: absolute;
          top: -2px;
          font-size: 20px;
        }
      }
      .withdraw-btn {
        position: relative;
        width: 20px;
        height: 20px;
        margin-top: -2px;
        opacity: 0.2;
        pointer-events: auto;
        div {
          position: absolute;
          top: -2px;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
