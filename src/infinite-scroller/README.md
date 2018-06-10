#Infinite Scroller

#配置项
- list 绑定列表对象

- size 每次载入多少条数据

- offset 保留距离屏幕顶端及下面多少条数据进行渲染

- loadmore 数据请求方法，修改绑定列表对象的方法

- spinner 是否需要载入动画

用法如同demo.vue

```javascript

 <template slot="item" slot-scope="props">
  // 插入需要渲染的对象模板，对象中的数据在props.data中
 </template>
```
