<template>
  <div class="notation-canvas-wrapper" ref="notationCanvasContent">
    <!-- 阴影部分 -->
    <div v-show="visible" class="shadow">
      <div class="shadow-top"></div>
      <div class="shadow-bottom"></div>
    </div>
    <!-- 头部按钮 -->
    <div class="notation-header">
      <span class="go-back" v-show="visibleBtn">
        <svg class="icon" @click="closeCanvas">
          <use xlink:href="#icon-back" />
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
        <div v-if="drawImageHistory.length" @click="withdrawGraffiti">
          <svg class="withdraw-btn-his">
            <use xlink:href="#icon-withdraw" />
          </svg>
        </div>
        <!-- 撤销图标 灰色 -->
        <div v-else class="withdraw-btn">
          <svg class="withdraw-btn-his">
            <use xlink:href="#icon-withdraw-gray" />
          </svg>
        </div>
      </div>
      <!-- 涂鸦 & 文字 图标 -->
      <div class="left select-num">
        <!-- 涂鸦 选中 -->
        <span v-if="isGraffiti" @click="graffitiClick">
          <svg class="icon">
            <use xlink:href="#icon-graffiti" />
          </svg>
        </span>
        <!-- 涂鸦 未选中 -->
        <span v-else @click="graffitiClick">
          <svg class="icon">
            <use xlink:href="#icon-graffiti-unselect" />
          </svg>
        </span>
        <!-- 笔 粗细 -->
        <!-- <span class="pen-linewidth-box">
          <span class="pen-linewidth-span pen-linewidth-1"></span>
          <span class="pen-linewidth-span pen-linewidth-2"></span>
          <span class="pen-linewidth-span pen-linewidth-3"></span>
        </span> -->
        <!-- 添加文字 -->
        <span @click="addText">
          <svg class="icon">
            <use xlink:href="#icon-text" />
          </svg>
        </span>
      </div>

      <div class="right">
        <button type="primary" :mini="true" @click="confirm">确定</button>
      </div>
    </div>
    <!-- 文字容器 -->
    <div class="text-container">
      <template v-for="(item, index) in addTexts">
        <div
          v-bind:key="index"
          class="text-item"
          ref="textContents"
          @click="textClick(index)"
          @touchstart="textItemDown($event, index)"
          @touchmove="textItemMove($event, index)"
          @touchend="textItemUp($event, index)"
        >
          {{item.textContent}}
          <span class="text-item-content">{{item.textContent}}</span>
        </div>
      </template>
      <div
        v-show="showRemoveText"
        class="remove-text"
        :class="{'remove-text-active': removeTextActive}"
        ref="removeText"
      >
        <div class="remove-icon">
          <svg class="icon">
            <use xlink:href="#icon-delete" />
          </svg>
        </div>
        <div v-if="removeTextActive" class="remove-tip">松手即可删除</div>
        <div v-else class="remove-tip">拖动到此处删除</div>
      </div>
    </div>
    <!-- 添加文字 mask -->
    <div v-if="textMask" class="add-text-container" ref="addTextContainer">
      <div class="shadow-full"></div>
      <span class="cancel-add" @click="cancelAddText">取消</span>
      <span class="confirm-add" @click="confirmAddText">完成</span>
      <textarea
        v-model="addTextValue"
        :style="{color: currentTextColor}"
        class="text-area"
        wrap="hard"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
      ></textarea>

      <div class="graffiti-colors">
        <template v-for="color in graffitiColors">
          <div class="select-color" v-bind:key="color" @click="() => selectTextColor(color)">
            <div
              :class="{'color-item-active': currentTextColor === color}"
              class="color-item"
              :style="{background: color}"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import './index.less';
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
      addTexts: [], // 添加的文字
      textActiveIndex: -1,
      textMask: false,
      addTextValue: '',
      currentTextColor: '#e75d5a',
      showRemoveText: false,
      removeTextActive: false,
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
      const notationCanvas = this.$refs.notationCanvas;
      notationCanvas.style.width = this.canvasWidth + 'px';
      notationCanvas.style.height = this.canvasHeight + 'px';
      // 浏览器是否支持 canvas 标签
      if (notationCanvas.getContext) {
        // const canvasWidth = this.canvasWidth;
        // getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性。
        const ctx = notationCanvas.getContext('2d'); // 获取上下文
        this.context = ctx;
        const ratio = this.getPixelRatio(ctx); // 解决canvas绘制模糊的问题

        const canvasWidth = this.canvasWidth * ratio;
        this.canvasWidthFull = this.canvasWidth * ratio;
        this.canvasHeightFull = this.canvasHeight * ratio;

        const img = new Image();
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

    // 解决canvas绘制模糊的问题, 按实际渲染倍率来缩放canvas
    //  获取像素比，将 Canvas 宽高进行放大
    getPixelRatio(context) {
      // 浏览器在渲染canvas之前会用几个像素来来存储画布信息
      // FIXME: backingStorePixelRatio 属性已被废弃
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      // 设备像素比: 用几个像素点宽度来渲染1个像素
      return (window.devicePixelRatio || 1) / backingStore;
    },

    selectGraffitiColor(graffitiColor) {
      this.currentGraffitiColor = graffitiColor;
      this.setCanvasStyle();
    },

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
    canvasStart(e) {
      // 开启时才画，而且画的时候把其他的隐藏
      if (this.isGraffiti) {
        this.visibleBtn = false;
        // 让move方法可用
        this.painting = true;
        // client是基于整个页面的坐标 offset是cavas距离顶部以及左边的距离
        // 计算 start 开始点的坐标
        const canvasX =
          e.changedTouches[0].clientX - e.target.parentNode.offsetLeft;
        const canvasY =
          e.changedTouches[0].clientY -
          e.target.parentNode.offsetTop +
          (this.$refs.notationCanvasContent.scrollTop || 0);
        const ratio = this.getPixelRatio(this.context);
        this.setCanvasStyle(); // 设置canvas的配置
        this.context.beginPath(); // 清除子路径
        this.context.moveTo(canvasX * ratio, canvasY * ratio); // 移动的起点
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
        const t = e.target;
        let canvasX = null;
        let canvasY = null;
        canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft;
        canvasY =
          e.changedTouches[0].clientY -
          t.parentNode.offsetTop +
          (this.$refs.notationCanvasContent.scrollTop || 0);
        const ratio = this.getPixelRatio(this.context);
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
        const canvasX = e.changedTouches[0].clientX - t.parentNode.offsetLeft;
        const canvasY =
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
        this.drawImageDown.push(this.drawImageHistory.length);
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
      const last = this.drawImageDown.pop() || 0;
      const rest = this.drawImageDown.length
        ? this.drawImageDown[this.drawImageDown.length - 1]
        : 0;
      // 撤销绘画
      this.drawImageHistory.splice(rest, last - rest);
      this.redrawAll();
    },

    redrawAll() {
      const length = this.drawImageHistory.length;
      const ratio = this.getPixelRatio(this.context);

      const ctx = this.context;
      const width = this.canvasWidth * ratio;
      const drawImageHistory = this.drawImageHistory;
      const config = this.config;

      // 新建一个 canvas 作为缓存 canvas
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      const img = new Image();
      img.src = this.imagesBase64;
      img.onload = function () {
        const height = (width / img.width) * img.height;
        tempCanvas.width = width;
        tempCanvas.height = height; // 设置宽高
        tempCtx.drawImage(this, 0, 0, width, height);

        // 在给定的矩形内清除指定的像素
        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(tempCanvas, 0, 0);

        for (let i = 0; i < length; i++) {
          const draw = drawImageHistory[i];

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

    // 添加文字
    addText() {
      this.addTexts.push({
        textItemMoveFlag: false,
        moveStartX: 0,
        moveStartY: 0,
        moveEndX: 0,
        moveEndY: 0,
        distance: 0,
        angle: 0,
        point1: {},
        point2: {},
        textContent: '',
        textColor: '#e75d5a',
      });
      this.textMask = true;
      this.visibleBtn = false;
      this.textActiveIndex = this.addTexts.length - 1;
    },

    // 选择字体颜色
    selectTextColor(color) {
      this.currentTextColor = color;
      this.addTexts[this.textActiveIndex].textColor = color;
    },

    // 取消添加字体
    cancelAddText() {
      this.textMask = false;
      this.visibleBtn = true;
    },

    // 确定添加字体
    confirmAddText() {
      this.textMask = false;
      this.visibleBtn = true;
      this.addTexts[this.textActiveIndex].textContent = this.addTextValue;
      this.addTextValue = '';

      const _this = this;
      this.$nextTick(function () {
        // 位置
        const textContents = _this.$refs.textContents;
        const t = textContents[_this.textActiveIndex];
        const content = t.children[0];
        const contentOffsetWidth = content.offsetWidth + 1; // 可能会出现差不到1换行
        const offsetWidth = t.parentNode.offsetWidth - 10;
        const offsetHeight = t.parentNode.offsetHeight;
        const width =
          (contentOffsetWidth > offsetWidth
            ? offsetWidth
            : contentOffsetWidth) + 1;
        // 添加会存在因为有滚动的情况，所以要进行处理，添加滚动的距离
        if (!t.style.left) {
          t.style.left = '50%';
          t.style.top =
            offsetHeight / 2 +
            (this.$refs.notationCanvasContent.scrollTop || 0) +
            'px';
          t.style.marginTop = '-50px';
          t.style.marginLeft = '-' + width / 2 + 'px';

          // 记录初始的点
        }
        t.style.width = width + 'px';
        t.style.color = _this.addTexts[_this.textActiveIndex].textColor;
      });
    },

    textClick(index) {
      this.textActiveIndex = index;
      // 点击回去
      this.addTextValue = this.addTexts[this.textActiveIndex].textContent;
      this.textMask = true;
      this.visibleBtn = false;
    },

    textItemDown(e, index) {
      this.addTexts[index].textItemMoveFlag = true;
      this.$refs.notationCanvasContent.style.overflow = 'hidden';
      // 用来修正移动时造成的问题
      // 判断是两条手指还是一条手指，两根手指放大缩小，一根手指或者其他都是移动
      if (e.touches.length === 2) {
        // 计算两个点位移的距离，根据距离来转化成字体的大小
        // this.addTexts[index].point1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        // this.addTexts[index].point2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
        // this.addTexts[index].angle = this.getAngle(this.addTexts[index].point1, this.addTexts[index].point2);
        // this.addTexts[index].distance = this.getDistance(this.addTexts[index].point1, this.addTexts[index].point2);
        // 暂时不考虑放大缩小了
      } else {
        this.addTexts[index].moveStartX =
          e.changedTouches[0].clientX - e.target.offsetLeft;
        this.addTexts[index].moveStartY =
          e.changedTouches[0].clientY -
          e.target.offsetTop +
          (this.$refs.notationCanvasContent.scrollTop || 0);
      }
    },
    textItemMove(e, index) {
      if (this.addTexts[index].textItemMoveFlag) {
        this.visibleBtn = false;
        this.showRemoveText = true;
        const t = e.target;
        const content = t.children[0];
        const contentOffsetWidth = content.offsetWidth + 1; // 可能会出现差不到1换行
        // 判断是两条手指还是一条手指，两根手指放大缩小，一根手指或者其他都是移动
        if (e.touches.length === 2 && e.changedTouches.length) {
          // 判断一下是否存在有没有移动手指的情况，得到两次移动的情况
          // let point1, point2;
          // // 为2取这个，不为2，说明中间有个点没有移动
          // if (e.changedTouches.length === 2) {
          //   point1 = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
          //   point2 = {x: e.changedTouches[1].clientX, y: e.changedTouches[1].clientY};
          // } else {
          //   if (e.touches[0].clientX === this.addTexts[index].point1.x) {
          //     point1 = {x: e.touches[0].clientX, y: e.touches[0].clientY};
          //     point2 = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
          //   } else {
          //     point1 = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
          //     point2 = {x: e.touches[1].clientX, y: e.touches[1].clientY};
          //   }
          // }
          // // let newAngle = this.getAngle(point1, point2);
          // let newDistance = this.getDistance(point1, point2);
          // let fontSize = 20 * newDistance / this.addTexts[index].distance;
          // if (fontSize < 8) {
          //   fontSize = 8;
          // }
          // t.style.fontSize = fontSize + 'px';
          // // 宽度也要变
          // let width = contentOffsetWidth * fontSize / 20;
          // t.style.width = width + 'px';
          // 暂时不考虑放大缩小了
        } else {
          const offsetWidth = t.parentNode.offsetWidth - 10;
          const width =
            contentOffsetWidth > offsetWidth ? offsetWidth : contentOffsetWidth;
          // text-item-content
          // 由于手机端和pc端获取页面坐标方式不同，所以需要做出判断
          var mwidth =
            e.changedTouches[0].clientX -
            this.addTexts[index].moveStartX -
            t.parentNode.offsetLeft;
          var mheight =
            e.changedTouches[0].clientY -
            this.addTexts[index].moveStartY -
            t.parentNode.offsetTop +
            (this.$refs.notationCanvasContent.scrollTop || 0);
          this.addTexts[index].moveEndX = mwidth;
          this.addTexts[index].moveEndY = mheight;
          if (
            (mwidth < 0 && -mwidth >= width - 30) ||
            (mwidth >= 0 && mwidth >= offsetWidth - 30)
          ) {
            t.style.left = '50%';
            t.style.top = '50%';
            t.style.marginTop = '-50px';
            t.style.marginLeft = '-' + width / 2 + 'px';
          } else {
            t.style.left = mwidth + 'px';
            t.style.top = mheight + 'px';
            t.style.marginTop = 'auto';
            t.style.marginLeft = 'auto';
          }

          // 判断是否要进行删除动作
          const removeTextEl = this.$refs.removeText;
          const x = removeTextEl.offsetLeft;
          const y = removeTextEl.offsetTop;
          const x1 = removeTextEl.offsetLeft + removeTextEl.offsetWidth;
          const y1 = removeTextEl.offsetTop + removeTextEl.offsetHeight;

          if (
            e.changedTouches[0].clientX >= x &&
            e.changedTouches[0].clientX <= x1 &&
            e.changedTouches[0].clientY >= y &&
            e.changedTouches[0].clientY <= y1
          ) {
            this.removeTextActive = true;
          } else {
            this.removeTextActive = false;
          }
        }
      }
    },
    textItemUp(e, index) {
      this.addTexts[index].textItemMoveFlag = false;
      this.$refs.notationCanvasContent.style.overflow = 'auto';
      if (this.removeTextActive) {
        this.addTexts.splice(index, 1);
        this.removeTextActive = false;
      }
      this.showRemoveText = false;
      this.visibleBtn = true;
      // 记录最后的点
    },
    getAngle(point1, point2) {
      // 得到两个点之间的距离å
      const radian = Math.atan2(point1.y - point2.y, point2.x - point1.x);
      return radian * (180 / Math.PI);
    },
    getDistance(point1, point2) {
      // 得到两个点之间的角度
      return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      );
    },

    drawText(contentWidth, addText, x, y) {
      const ratio = this.getPixelRatio(this.context);
      // 画上文字
      this.context.font =
        "31px 'Helvetica Neue', -apple-system-font, sans-serif";

      // 设置颜色
      this.context.fillStyle = addText.textColor;
      // 设置水平对齐方式
      this.context.textAlign = 'start';
      // 设置垂直对齐方式
      this.context.textBaseline = 'middle';
      // 先判断一次总长度，如果长度比contentWidth小，就不处理，如果大就处理
      if (this.context.measureText(addText.textContent).width >= contentWidth) {
        // 分割文本为单个的字符
        const textChar = addText.textContent.split('');
        // 用于拼接
        let tmpText = '';
        const textRows = [];

        for (let i = 0, length = textChar.length; i < length; i++) {
          // 如果在结束之前，或者已经是最后了，那么会存在一种情况，还是会小于contentWidth，导致另一部分丢失
          if (
            this.context.measureText(tmpText).width / 2 >=
            contentWidth - 15
          ) {
            textRows.push(tmpText);
            tmpText = '';
          } else if (
            i === length - 1 &&
            this.context.measureText(tmpText).width / 2 < contentWidth - 15
          ) {
            tmpText += textChar[i];
            textRows.push(tmpText);
            tmpText = '';
          }
          tmpText += textChar[i];
        }

        for (let i = 0, length = textRows.length; i < length; i++) {
          // 绘制文字（参数：要写的字，x坐标，y坐标）
          this.context.fillText(textRows[i], x * ratio, (y + i * 24) * ratio);
        }
      } else {
        this.context.fillText(addText.textContent, x * ratio, y * ratio);
      }
    },
    confirm() {
      const notationCanvas = this.$refs.notationCanvas;
      this.context.shadowColor = 'rgba(238, 238, 238)';
      // 将阴影向右移动15px，向上移动10px
      this.context.shadowOffsetX = 0;
      this.context.shadowOffsetY = 1;
      // 轻微模糊阴影
      this.context.shadowBlur = 1;
      for (let i = 0, length = this.addTexts.length; i < length; i++) {
        const addText = this.addTexts[i];
        const addTextEl = this.$refs.textContents[i];
        const x = addTextEl.offsetLeft;
        const y = addTextEl.offsetTop + 13;

        const offsetWidth = addTextEl.parentNode.offsetWidth - 10;

        this.drawText(offsetWidth, addText, x, y);
      }

      // 得到图片
      var base64Img = notationCanvas.toDataURL('image/jpg');
      const link = document.createElement('a');
      link.href = base64Img;
      link.download = '拒绝原因.png';
      link.click();
      this.$emit('closeCanvas');
    },
  },
};
</script>
