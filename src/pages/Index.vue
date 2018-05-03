<template>
<keep-alive>
  <div class="index">
    <Header></Header>
    <TabNav></TabNav>
    <div class="wrapper index-wrapper">
      <div class="content">
        <!-- S banner -->
        <div class="banner">
          <div class="swiper-container">
              <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item,k) in sliders" :key="k">
                    <img :src="item.picUrl">
                  </div>
              </div>
              <!-- If we need pagination -->
              <div class="swiper-pagination"></div>
          </div>
        </div>
        <!-- E banner -->

        <!-- S 排行榜 -->
        <div class="top-list">
          <h2>歌曲排行榜</h2>
          <div class="songs-container">
            <ul>
            <router-link v-for="(item,k) in topList" :key="k" @click.native="setCurInfo(item.data.songname,item.data.singer[0].name,item.data)" :to="'/song/' + item.data.songmid + '/' + item.data.albummid" tag="div">
              <li>
                <div class="thumb"><img v-lazy="'https://y.gtimg.cn/music/photo_new/T002R90x90M000'+item.data.albummid+'.jpg?max_age=2592000'" alt=""></div>
                <div class="text-info">
                  <span class="song-name">{{item.data.songname}}</span>
                  <span class="singer-name">{{item.data.singer[0].name}}</span>
                </div>
                <!-- <div class="play-time" v-text="getTime(item.data.interval)"></div> -->
               
              </li>
              </router-link>
            </ul>
          </div>
        </div>
        <!-- E 排行榜 -->
      </div>
    </div>

    <!-- S loading组件 -->
    <Loading :state="loadingState" text="歌曲推荐列表加载中"></Loading>
    <!-- E loading组件 -->
  </div>
</keep-alive>
</template>

<script>
import Header from '@/components/Header'
import TabNav from '@/components/TabNav'
import Loading from '@/components/base/loading/Loading'
import jsonp from 'jsonp'
import Swiper from 'swiper';
import BScroll from 'better-scroll'
import "swiper/dist/css/swiper.min.css";

// 导入接口地址
import api from '@/api/indexApi'
import {mapGetters,mapMutations} from 'vuex'
export default {
  name: '',
  data(){
    return {
      scroll:{},
      sliders:{},
      topList:{},
      loadingState:true
    }
  },
  computed:{
    ...mapGetters([
      'getSongList'
    ])
  },
  created:function(){
    let vm = this;
    //banner 轮播接口api地址
    jsonp(api.bannerApi, {param:'jsonpCallback'},function(err,data){
      vm.sliders = data.data.slider;

      //延迟到下一次dom更新
      vm.$nextTick(function () {
        let slider = new Swiper('.swiper-container', { 
          autoplay: {
            delay: 5000,
          },
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            bulletActiveClass:'active'
          },
        });
      });
    });

    //toplist歌曲排行榜数据获取
    jsonp(api.topListApi,{param:'jsonpCallback'},function(err,data){
      vm.topList = data.songlist;
      //数据加载完成隐藏loading
      vm.loadingState = false;
    });

    vm.$nextTick(function(){
      this.scroll = new BScroll('.index-wrapper',{
        click:true,
        scrollbar:false,
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        }
      });

      //上拉加载更多
      this.scroll.on('pullingUp',this.getDataMore);
      
    });
  },
  methods:{
    getTime:function(time){
      let m = time / 60;
      let s = time % 60;
      if(s < 10){
        s = '0' + s; 
      }
      return parseInt(m) + '分' + s;
    },
    getDataMore:function(){
      let vm = this;
      vm.loadingState = true;
      //toplist歌曲排行榜数据获取
      let songBegin = vm.topList.length;
      jsonp(api.topListApi+songBegin,{param:'jsonpCallback'},function(err,data){
        vm.topList = vm.topList.concat(data.songlist);

        //数据加载完成隐藏loading
        vm.loadingState = false;

        //通知better-scroll更新
        vm.scroll.finishPullUp();
        vm.scroll.refresh();
      });

     
    },
    setCurInfo:function(song,singer,songData,index){
      this.setCurSong(song);
      this.setCurSinger(singer);

      //添加歌曲到播放列表
      this.setSongList(songData);
      //设置当前歌曲索引
      this.setCurSongIndex(this.getSongList.length-1);
    },
    ...mapMutations({
      'setCurSong':'SET_CUR_SONG',
      'setCurSinger':'SET_CUR_SINGER',
      'setCurSongIndex':'SET_CUR_SONG_INDEX',
      'setSongList':'SET_SONG_LIST',
    })
  },
  components:{
    Header,
    TabNav,
    Loading
  }
}

</script>

<style lang="scss">
// body{
//   background-color:#060506;
//   overflow: hidden;
//   height: 100vh;
// }
.wrapper{
  height:calc(100vh - 86px);
  overflow: hidden;
}
.banner{
  font-size: 0;
  img{
    width:100%;
  }
  .swiper-pagination-bullet{
    &.active{
      width:15px;
      background:#fff;
      opacity: .3;
      border-radius: 5px;
    }
    
  }
}

.top-list{
  padding:0 5px;
  h2{
    font-size:15px;
    color:#d33a31;
    text-align: center;
    line-height: 64px;
  }
  .songs-container{
    li{
      display:flex;
      margin-bottom:20px;
      padding:0 10px;
      img{
        width:60px;
        height:60px;
      }
      div{
        &.text-info{
          flex-grow:5;
          color:#fff;
          display:flex;
          flex-direction:column;
          padding-top: 15px;
          margin-left:20px;
          overflow:hidden;
          .song-name{
            font-size: 15px;
            margin-bottom:5px;
          }
          .singer-name{
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        &.play-time{
          color:#666;
          padding-top: 15px;
          width:50px;
          font-size: 14px;
          margin-right: -10px;
        }
      }
    }
  }
}


</style>