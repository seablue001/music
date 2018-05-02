<template>
  <div class="">
    <Header></Header>
    <TabNav></TabNav>
    <div class="search-wrap">
      <div class="search-form">
        <input placeholder="搜索歌曲、歌手" v-model="keywords">
        <i class="delete" v-show="keywords" @click="delkeywords"></i>
      </div>

      <div class="hotkey" v-show="!searchResultState">
        <h2>热门搜索</h2>
        <div class="hotkey-list">
          <span v-for="(val,key) in hotKey.hotkey" :key="key" v-text="val.k" v-if="key <= 10" @click="selectHotkey(val.k)"></span>
        </div>
      </div>
  
      <div class="song-wrapper">
        <div class="content">
          <div class="song-list" v-if="searchResultState">
            <ul>
              <!-- S 歌手直达 -->
              <router-link :to="'singer/'+songList.zhida.singermid">
              <li class="singer">{{songList.zhida.singername}}</li>
              </router-link>
              <!-- E 歌手直达 -->

              <router-link :to="'/song/' + val.songmid + '/' + val.albummid" v-for="(val,key) in songList.song.list" :key="key">
              <li @click="selectSong(val.songname,val.singer[0].name)">{{val.songname}}-{{val.singer[0].name}}</li>
              </router-link>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Header from '@/components/Header'
import TabNav from '@/components/TabNav'
import jsonp from 'jsonp';
import api from '@/api/searchApi'
import BScroll from 'better-scroll'
import {mapMutations} from 'vuex'

export default {
  name: '',
  data(){
    return {
      hotKey:'',
      keywords:'',
      songList:'',
      delState:false,
      scroll:'',
      searchResultState:false
    }
  },
  watch:{
    keywords:function(cur,old){
      if(!cur){
        this.searchResultState = false;
        return;
      }
      var url = api.searchApi + encodeURI(cur);
      jsonp(url,{param:'jsonpCallback'},(err,data)=>{
        this.songList = data.data; 
        this.$nextTick(function(){
          this.scroll = new BScroll('.song-wrapper',{
            click:true,
            scrollbar:false
          });
        });

        this.searchResultState = true;
      });
    }
  },
  created(){
    jsonp(api.hotkeyApi,{param:'jsonpCallback'},(err,data)=>{
      this.hotKey = data.data;
    });
  },
  methods:{
    selectHotkey:function(val){
      val = val.substr(0,val.length-1);
      this.keywords = val;
    },
    selectSong:function(song,singer){
      this.setCurSong(song);
      this.setCurSinger(singer);
    },
    delkeywords:function(){
      this.keywords = '';
    },
    ...mapMutations({
      setCurSong:'SET_CUR_SONG',
      setCurSinger:'SET_CUR_SINGER'
    })
  },
  components:{
    Header,
    TabNav
  }
}
</script>

<style lang="scss" scoped>
ul{
  list-style: none;
}
a{
  color: #676767;
}
.search-wrap{
  padding: 0 15px;
  margin: 0 auto;

  .search-form{
    padding: 8px 0;
    text-indent: 15px;
    background-color: #121212;
    margin: 0 5px;
    margin-top: 25px;
    border-radius: 8px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: "";
      display: inline-block;
      width: 22px;
      height: 22px;
      background: url(../assets/icon/search.png) no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: 5px;
    }
    input{
      width: 220px;
      height: 20px;
      font-size: 14px;
      line-height: 20px;
      background-color: transparent;
      border: 0;
      outline: 0;
      color: #676767;
    }
    .delete{
          display: inline-block;
      width: 22px;
      height: 22px;
      background: url(../assets/icon/delete.png) no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      position: absolute;
      right: 10px;
    }
  }

  .hotkey{
    margin-top: 30px;
    h2{
      color: #676767;
      font-size: 15px;
      text-indent: 5px;
    }
    .hotkey-list{
      color: #676767;
      display: flex;
      flex-wrap: wrap;
      span{
        padding: 4px 6px;
        background-color: #121212;
        margin: 5px;
        border-radius: 8px;
        font-size: 14px;
      }
    }
  }
}


.song-wrapper{
  height:calc(100vh - 173px);
  overflow: hidden;
}
li{
  padding: 6px 5px;
  &::before{
    content: "";
    display: inline-block;
    width: 22px;
    height: 22px;
    background: url(../assets/icon/music.png) no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-right: 5px;
  }

  &.singer{
    &::before{
      content: "";
      display: inline-block;
      width: 22px;
      height: 22px;
      background: url(../assets/icon/singer.png) no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
}

</style>