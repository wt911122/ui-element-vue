<template>
  <div>
    <ul ref="scroller" class="infinite-scroller" :style="`height:${containerHeight}px`">
      <li
        class="infinite-scroller-item"
        v-for='(item, index) in attachedItems'
        :style="`transform: translateY(${item.offset}px);`">
        <slot name="item" :data="item.data"></slot>
      </li>
    </ul>
    <!-- 只是为了获取高度的看不见的元素，已知高度的节点将会被删除 -->
    <ul class="infinite-scroller">
      <li
        class="infinite-scroller-item infinite-scroller-item-invisible"
        v-for='(item, index) in list' v-if="!itemMetas[index]"
        :ref="getItemId(index)"
      >
        <slot name="item" :data="item"></slot>
      </li>
    </ul>
    <div v-show="spinner && !nomore"
      class="infinite-scroller-loading"
      :style="{visibility: loading ? 'visible' : 'hidden'}">
      <slot name="spinner">
        <div class="infinite-scroller-loading-content">
          <div class="cssloading-circle spinner"></div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  var getScrollTop = function () {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  };
  var getVisibleHeight = function(){
    return document.documentElement.clientHeight;
  }
  export default {
    data() {
      return {
        itemMetas: [],
        attachedStart: 0,
        loading: false,
        containerHeight: 0,
        currentIndex: 0,
        initialTop: 0,
      }
    },
    props: {
      list: {
        type: Array,
        required: true
      },
      size: {
        type: Number,
        default: 20 // 每次载入多少元素
      },
      offset: {
        type: Number,
        default: 200 // 距屏幕外还有多少像素距离时开始载入
      },
      loadmore: {
        type: Function,
        required: true // 数据请求方法
      },
      spinner: {
        type: Boolean,
        default: true // 是否需要载入动画
      },
      nomore: {
        type: Boolean,
        default: false // 是否需要最后的显示‘没有了’
      },
      marker: {
        type: String,
        default: 'infinite',
      },
    },
    watch: {
      list(arr){
        if(arr.length){
          Vue.nextTick(() => {
            let l = this.list.length,
                i = this.itemMetas.length,
                h = this.itemMetas[i-1] ? this.itemMetas[i-1].offset + this.itemMetas[i-1].height : 0;
            if(this.isUpdate()){
              this.itemMetas = [];
              i = 0;
              h = 0;
            }
            Vue.nextTick(() => {
              const metas = [];
              for(; i<l; i++){
                let item_h = this.$refs[this.getItemId(i)][0].offsetHeight;

                metas.push({
                  height: item_h,
                  offset: h,
                  data: this.list[i],
                });
                h += item_h;
              }
              this.itemMetas = this.itemMetas.concat(metas);
              this.containerHeight = h;
              this.loading = false;
            })


          })
        }else{

        }
      }
    },
    computed: {
      attachedItems() {
        return this.itemMetas.slice(Math.max(0, this.attachedStart - this.size),
          Math.min(this.itemMetas.length, this.attachedStart + this.size));
      },
    },
    methods: {
      init(){
        const listmark = Number(sessionStorage.getItem(this.key()));
        const func = () =>{
          if(this.itemMetas.length <= listmark){
            this.loadmore().then(func);
          }else{

            window.scrollTo(0, this.itemMetas[listmark].offset + this.itemMetas[listmark].height + this.initialTop);
            setTimeout(() => {
              window.addEventListener('scroll', this.onScroll)
            }, 500)

          }
        }
        if(listmark && listmark > 0){
          func()

        }else{
          this.load();
          window.addEventListener('scroll', this.onScroll)
        }
      },
      load(){
        if(!this.loading){
          this.loadmore();
          this.loading = true;
        }
      },
      getItemId(id){
        return `item_${id}`;
      },
      isUpdate(){
        return this.itemMetas.some((item, idx) => {
          return this.list[idx] !== item.data
        })
      },
      findNextIndex(index, top){
        if(index < 0){
          return 0;
        }
        const meta = this.itemMetas[index];
        const topinit = this.initialTop;
        if(meta.offset + topinit > top){
          return this.findNextIndex(index-1, top);
        }

        if(meta.offset + topinit + meta.height < top){
          return this.findNextIndex(index+1, top);
        }
        return index
      },
      saveStart(){
        let i = undefined;
        return () => {
          if(i) clearTimeout(i);
          i = setTimeout(() => {
            sessionStorage.setItem(this.key(), this.attachedStart);
          }, 200);

        }
      },
      calculateStart(top) {
        this.attachedStart = this.findNextIndex(this.attachedStart, top);
        this._p();
      },
      onScroll() {
        const top = getScrollTop();
        this.calculateStart(top);
        if(top + getVisibleHeight() > this.containerHeight - this.offset){
          this.load();
        }
      },
      key(){
        return `${this.marker}-infinite-scroller`;
      }
    },

    mounted() {
      this.initialTop = this.$el.getBoundingClientRect().top;
      this.init();
      this._p = this.saveStart()
    },
    beforeDestroy(){

    }
  }

</script>
<style>
  @-webkit-keyframes csl-rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes csl-rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.cssloading-circle{box-sizing:border-box;display:block;position:relative;width:30px;height:30px;font-size:2px;color:#87cefa;background:#fff;border-radius:50%;overflow:hidden;-webkit-animation:csl-rotate 1s infinite linear;animation:csl-rotate 1s infinite linear}.cssloading-circle:after,.cssloading-circle:before{content:"";display:block;position:absolute}.cssloading-circle:before{top:0;right:0;bottom:0;left:0;font-size:100em;border:.01em solid currentColor;border-radius:50%}.cssloading-circle:after{top:0;left:50%;width:50%;height:50%;-webkit-transform:translate3d(0,100%,0) skew(20deg,20deg) rotate(0deg);transform:translate3d(0,100%,0) skew(20deg,20deg) rotate(0deg);-webkit-transform-origin:left top;transform-origin:left top;background-color:inherit}
</style>
<style scoped>
  .infinite-scroller{
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
  }
  .infinite-scroller > .infinite-scroller-item{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }
  .infinite-scroller > .infinite-scroller-item-invisible{
    top: -1000px;
    visibility: hidden;
  }
  .infinite-scroller-loading{
    overflow: hidden;
  }
  .infinite-scroller-loading > .infinite-scroller-loading-content{
    width: 100%;
    text-align: center;
  }
  .infinite-scroller-loading > .infinite-scroller-loading-content > .spinner{
      margin: 10px auto;
      width: 20px;
      height: 20px;
  }
</style>
