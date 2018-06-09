<template>
  <div>
    <infiniteScroller
      :list="list"
      :loadmore="loadMore"
      >
      <template slot="item" slot-scope="props">
        <div :class="`chat-item ${props.data.self?'from-me':''}`">
          <img class="avatar" width="48" height="48" :src="require(`@/assets/images/avatar${props.data.avatar}.jpg`)">
          <div class="bubble">
            <p>{{props.data.message}}</p>
            <img v-if="props.data.image"
              :width="props.data.image.width"
              :height="props.data.image.height"
              :src="props.data.image.src">
            <div class="meta">
              <time class="posted-date">{{props.data.time.toString()}}</time>
            </div>
          </div>
        </div>
      </template>
    </infiniteScroller>
  </div>
</template>

<script type="text/javascript">
  import InfiniteScroller from './scripts/infinite-scroller';
  import {
    NUM_AVATARS,
    NUM_IMAGES,
    MESSAGES
  } from './messages'
  //import './stats.min.js'
  //console.log(Stats)
  var INIT_TIME = new Date().getTime();
  export default {
    name: 'infiniteScrollerDemo',
    data(){
      return {
        list: [],
        size: 20,
        id: 0
      }
    },
    components: {
      InfiniteScroller
    },
    methods: {
      loadMore() {
        let items = []
        for (let i = 0; i < this.size; i++) {
          items.push(this.getItem(this.id++))
        }
        Promise.all(items).then((res) => {
          this.list = this.list.concat(res);
        })
      },

      getItem(id){
        function pickRandom(a) {
          return a[Math.floor(Math.random() * a.length)];
        }

        return new Promise(function(resolve) {
          var item = {
            id: id,
            avatar: Math.floor(Math.random()*NUM_AVATARS),
            self: Math.random() < 0.1,
            image: Math.random() < 1.0 / 20 ? Math.floor(Math.random()*NUM_IMAGES) : '',
            time: new Date(Math.floor(INIT_TIME + Number(id)*20*1000 + Math.random()*20*1000)),
            message: pickRandom(MESSAGES)
          }
          console.log(Number(id))

          if(item.image === '') {
            resolve(item);
          }
          var image = new Image();

          image.src = `${require('@/assets/images/image' + item.image + '.jpg')}`;
          image.addEventListener('load', function() {
            item.image = image;
            resolve(item);
          });
          image.addEventListener('error', function() {
            item.image = '';
            resolve(item);
          });
        });
      },
      /*addStatsPanel() {
        if (window.requestIdleCallback) {
          let self = this
          let stats = new Stats()
          let domPanel = new Stats.Panel('D', '#0ff', '#002')
          stats.addPanel(domPanel)
          stats.showPanel(3)
          document.body.appendChild(stats.dom)
          setTimeout(function timeoutFunc() {
            // Only update DOM node graph when we have time to spare to call
            // numDomNodes(), which is a fairly expensive function.
            requestIdleCallback(() => {
              domPanel.update(self.numDomNodes(document.body), 1500)
              setTimeout(timeoutFunc, 100)
            })
          }, 100)
        }
      },
      numDomNodes(node) {
        if(!node.children || node.children.length == 0) return 0
        let childrenCount = Array.from(node.children).map(this.numDomNodes)
        return node.children.length + childrenCount.reduce(function(p, c){ return p + c; }, 0)
      }*/
    },
    mounted(){
      console.log('mounted')
      showPanel();
    }
    /*created() {
      this.addStatsPanel()
    },*/
  }

function showPanel(){
  function  numDomNodes(node) {
    if(!node.children || node.children.length == 0) return 0
    let childrenCount = Array.from(node.children).map(numDomNodes)
    return node.children.length + childrenCount.reduce(function(p, c){ return p + c; }, 0)
  }
  var script=document.createElement('script');
  script.onload = function(){
     if (window.requestIdleCallback) {
        let stats = new Stats()
        let domPanel = new Stats.Panel('D', '#0ff', '#002')
        stats.addPanel(domPanel)
        stats.showPanel(3)
        document.body.appendChild(stats.dom)
        setTimeout(function timeoutFunc() {
          // Only update DOM node graph when we have time to spare to call
          // numDomNodes(), which is a fairly expensive function.
          requestIdleCallback(() => {
            domPanel.update(numDomNodes(document.body), 1500)
            setTimeout(timeoutFunc, 100)
          })
        }, 100)
      }
  }
  script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
  document.head.appendChild(script);}
</script>
<style type="text/css">
.chat-item {
  display: flex;
  padding: 10px 0;
  width: 100%;
  contain: layout;
  will-change: transform;
}

.avatar {
  border-radius: 500px;
  margin-left: 20px;
  margin-right: 6px;
  min-width: 48px;
}

.chat-item p {
  margin: 0;
  word-wrap: break-word;
  font-size: 13px;
}

.chat-item.tombstone p {
  width: 100%;
  height: 0.5em;
  background-color: #ccc;
  margin: 0.5em 0;
}

.chat-item .bubble img {
  max-width: 100%;
  height: auto;
}

.bubble {
  padding: 7px 10px;
  color: #333;
  background: #fff;
  box-shadow: 0 3px 2px rgba(0,0,0,0.1);
  position: relative;
  max-width: 420px;
  min-width: 80px;
  margin: 0 5px;
}

.bubble::before {
  content: '';
  border-style: solid;
  border-width: 0 10px 10px 0;
  border-color: transparent #fff transparent transparent;
  position: absolute;
  top: 0;
  left: -10px;
}

/*.bubble img {
  width: 80%;
}*/

.meta {
  font-size: 0.8rem;
  color: #999;
  margin-top: 3px;
}

.from-me {
  justify-content: flex-end;
}

.from-me .avatar {
  order: 1;
  margin-left: 6px;
  margin-right: 20px;
}

.from-me .bubble {
  background: #F9D7FF;
}

.from-me .bubble::before {
  left: 100%;
  border-width: 10px 10px 0 0;
  border-color: #F9D7FF transparent transparent transparent;
}
.state {
  display: none;
}
.invisible {
  display: none;
}

</style>
