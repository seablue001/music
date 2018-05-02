<template>
<keep-alive>
  <div class="">
  	<Header></Header>
  	<TabNav></TabNav>
    <div class="wrapper singer-wrapper">
      <div class="content">
        
        <div class="singer-item" :ref="'item'+sK" v-for="(singer,sK) in singerList" :key="sK">
          <h3 v-text="singer.index" :id="'index'+sK"></h3>
          <ul>
            <router-link :to="'singer/'+s.Fsinger_mid" tag="div" v-for="(s,k) in singer.singerData" :key="k"> 
              <li>
                  <img  v-lazy="'https://y.gtimg.cn/music/photo_new/T001R150x150M000'+ s.Fsinger_mid +'.jpg?max_age=2592000'" alt="">
                  <span v-text="s.Fsinger_name"></span>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
      
      <!-- S 当前歌手索引 -->
      <div class="singer-index-title" v-text="indexArr[indexToolCurI]"></div>
      <!-- E 当前歌手索引 -->

      <!-- S 歌手索引工具 -->
      <transition name="indextool">
      <div class="index-tool" @mousemove.stop  @touchstart.stop v-if="indexToolState">
        <ul>
          <li v-for="(index,k) in indexArr" :key="k" v-text="index" :class="{active:k==indexToolCurI}" @click="scrollTo(k)" @touchstart="scrollTo(k)"></li>
        </ul>
      </div>
      </transition>
      <!-- E 歌手索引工具 -->
    </div>

    <!-- S loading组件 -->
    <Loading :state="loadingState" text="歌手列表加载中"></Loading>
    <!-- E loading组件 -->
  </div>
</keep-alive>
</template>

<script>
import Header from '@/components/Header'
import TabNav from '@/components/TabNav'
import Loading from '@/components/base/loading/Loading'
import jsonp from 'jsonp'
import BScroll from 'better-scroll'

// 导入接口地址
import api02 from '@/api/singerApi'

let scroll;
export default {
  name: '',
  data(){
    return {
      singerList:{},
      indexArr:[],
      indexToolCurI:0,
      indexToolState:false,
      itemOffsetHArr:[],
      loadingState:true,
    }
  },
  methods:{
    scrollTo:function(i){
      this.indexToolCurI = i;
      scroll.scrollToElement('#index'+i,500);
    },

    selectIndexTool:function(evt){
      let posY = Math.abs(evt.y);
      let indexMax = this.itemOffsetHArr.length-1;
      for(let i=0;i<=indexMax;i++){
        if(posY < this.itemOffsetHArr[i]){
          this.indexToolCurI = i;

          break;
        }
      }
    }
  },
  created:function(){
    let vm = this;
    jsonp(api02.singerListApi,{param:'jsonpCallback'},function(err,data){
      let singerData = data.data.list;

      //生成歌手索引数组
      let indexArr = ['热'];
      for(let code=65;code<=90;code++){
        indexArr.push(String.fromCharCode(code));
      }
      
     

      //最终数据数组
      let singerArr = [];
      let hotSinger = {'index':'热','singerData':[]};

      //添加前十条为热门歌曲
      for(let i=0;i<10;i++){
        hotSinger.singerData.push(singerData[i]);
      } 
      singerArr.push(hotSinger);

      let indexMax = indexArr.length-1;
      let tempIndexArr = ['热'];
      for(let i=1;i<=indexMax;i++){
        let singer = {'index':indexArr[i],'singerData':[]};
        for(let j=0;j<=singerData.length-1;j++){
          if(singerData[j].Findex == indexArr[i]){
            singer.singerData.push(singerData[j]);
          }
        }


        if(singer.singerData.length > 0){
          singerArr.push(singer);

          //压入需要的索引
          tempIndexArr.push(indexArr[i]);
        }
      }



      vm.singerList = singerArr;
      vm.indexArr = tempIndexArr;
      vm.loadingState = false;
      vm.indexToolState = true;

      //计算每个索引对应歌曲列表的高度(为后续滚动歌曲列表选定对应索引)
      vm.$nextTick(function(){
        let itemsDomArr = document.querySelectorAll('.singer-item');
        let tempH = 0;
        let tempArr = [];
        itemsDomArr.forEach(function(item,i){
          let h = itemsDomArr[i].offsetHeight;
          tempH += h;

          tempArr.push(tempH);
        });
        
        vm.itemOffsetHArr = tempArr;
      });
    });
    vm.$nextTick(function(){
      scroll = new BScroll('.singer-wrapper',{
        click:true,
        scrollbar:false,
        probeType:3
      });
      
      scroll.on('scroll',function(evt){
        vm.selectIndexTool(evt);
      });
    });
  },
  mounted:function(){
      
  },
  components:{
    Header,
    TabNav,
    Loading
  }
}
</script>

<style lang="scss" scoped>
ul{
  list-style: none;
}
body{
  background-color:#060506;
}
.wrapper{
  height:calc(100vh - 93px);
  overflow: hidden;
}

.singer-index-title{
  position: fixed;
  top:83px;
  width:100%;
  font-size: 15px;
  line-height: 30px;
  background: #131313;
  font-weight: 400;
  text-indent: 1em;
  color: #fff;
}

.singer-item{
  h3{
    font-size: 15px;
    line-height: 30px;
    background: #131313;
    font-weight: 400;
    text-indent: 1em;
    color:#fff;
  }
  ul{
    padding-left: 25px;
    padding-bottom: 20px;
    li{
      display:flex;
      line-height: 50px;
      margin-top:20px;
      span{
        color:#fff;
        flex-grow:1;
        margin-left:20px;
        white-space: nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        padding-right:8px;
      }
      img{
        width:50px;
        height:50px;
        border-radius: 50%;
      }
    }
  }
}

.index-tool{
  width:16px;
  position: fixed;
  top:50%;
  right:10px;
  margin-top:-165px;
  background-color:rgba(235,235,235,.1);
  font-size:12px;
  border-radius: 10px;
  padding:5px 0;
  color:rgb(200,200,200);
  ul{
    li{
      text-align: center;
      &.active{
        color:#d3442c;
      }
    }
  }
}
.indextool-enter-active{
  animation: slideInRight .3s ease-in-out;
}


</style>