<template>
  <div class="mini-player" @click.self="showPlayView()">
  	<!-- S 歌曲封面 -->
   	<div class="thumb" :class="[getPlayState?'playing':'pause']">
   		<img :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+ getSongList[getCurSongIndex].albummid +'.jpg?max_age=2592000'">
   	</div>
   	<!-- E 歌曲封面 -->

   	<div class="song-info"  @click.self="showPlayView()">
   		<h3 v-text="getSongList[getCurSongIndex].songname"></h3>
   		<span v-text="getSongList[getCurSongIndex].singer[0].name"></span>
   	</div>
 
   	<div class="song-operator">
   		<a href="javascript:" class="play-paused" :class="[getPlayState?'play':'pause']" @click="playOrPause"></a>
   		<a href="javascript:" class="song-list" @click="songListState = true"></a>
   	</div>

    <div class="audio">
      <audio id="player" :src="getCurSongSrc" autoplay="autoplay"></audio>
    </div>

    <!-- S 歌曲播放列表 -->
    <SongList :state="songListState" @close="songListState = false" @itemplay="itemPlay"></SongList>
    <!-- E 歌曲播放列表 -->
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex';
import jsonp from "jsonp";
import api from "@/api/singerApi";
import playIcon from '../assets/icon/play.png';
import pauseIcon from '../assets/icon/pause.png';

//引入歌曲播放列表
import SongList from '@/components/SongList';
export default {
  name: '',
  data(){
    return {
      thumb:{},
      playClass:'playing',
      songListState:false
    }
  },
  computed: {
    ...mapGetters([
      'getPlayState',
      'getCurSong',
      'getCurSongSrc',
      'getCurSinger',
      'getSongList',
      'getCurSongIndex'
    ])
  },
  watch:{
    //监听 getPlayState状态 动态调整miniPlayer的旋转动画播放与暂停
    getPlayState:function(n,o){
      if(n){ //播放
        this.thumb.style.animationPlayState = 'running';
      }else{//暂停
        this.thumb.style.animationPlayState = 'paused';
      }
    }
  },
  methods:{
    //切换歌曲更新播放地址
    _getPlaySrc(mid){
      this.mid = mid;
      //动态获取vkey
      let vKeyApi = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&cid=205361747&platform=yqq&hostUin=0&needNewCode=0&uin=0&songmid="+this.mid+"&filename=C400"+this.mid+".m4a&guid=7120953682";

      jsonp(vKeyApi,{param:'callback'},(err,data)=>{
        this.vk = data.data.items[0].vkey;
        this.src = 'http://dl.stream.qqmusic.qq.com/C400'+this.mid+'.m4a?vkey='+this.vk+'&guid=7120953682&uin=0&fromtag=66';
        
        //将播放地址加入state
        this.setCurSongSrc(this.src);

        this.playClass = 'playing';
        this.setPlayState(true);
        let player = document.querySelector("#player");
        player.play();
      });
    },
    itemPlay(mid){
      this._getPlaySrc(mid);
    },
    
    //播放或暂停
    playOrPause:function(){
      let player = document.querySelector("#player");
      let playState = this.getPlayState;
      let thumb = document.querySelector('.mini-player .thumb');
      this.thumb = thumb;
      let playBtn = document.querySelector('.play-paused');
      if(playState){
        player.pause();
        this.setPlayState(false);
        thumb.style.animationPlayState = 'paused';
        playBtn.setAttribute('class','play-paused play');
      }else{
        player.play();
        this.setPlayState(true);
        thumb.style.animationPlayState = 'running';
        playBtn.setAttribute('class','play-paused pause');
      }
    },
    showPlayView(){//点击miniplayer底部显示播放界面
      console.log(this.getSongList[this.getCurSongIndex]);
      this.$router.push({path:'/song/'+this.getSongList[this.getCurSongIndex].songmid+'/'+this.getSongList[this.getCurSongIndex].albummid});
    },
    ...mapMutations({
      setPlayState: 'SET_PLAY_STATE',
      setCurSongSrc: 'SET_CUR_SONG_SRC'
    })
  },
  components:{
    SongList
  }
}
</script>

<style lang="scss" scoped>
.mini-player{
	width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  background: #101010;
  display: flex;
  align-items: center;
  padding-left:18px;
  box-sizing: border-box;
  
  .thumb{
    &.playing{
      animation:playCicle 5s linear infinite;
    }
  	img{
  		width:45px;
  		height:45px;
  		border-radius: 50%;
  	}
  }
  .song-info{
  	flex:1;
  	margin-left:16px;
    overflow: hidden;
  	h3{
  		color: #fff;
  		font-size:16px;
  		font-weight: 400;
      overflow: hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
  	}
  	span{
  		color: #ccc;
  		font-size:12px;
  	}
  }
  .song-operator{
  	margin-right:10px;
  	.play-paused,.song-list{
		width:30px;
		height:30px;	
		display: inline-block;
  	}
    .play-paused{
      margin-right:16px;
    }
  	.play{
  		background:url(../assets/icon/pause.png) no-repeat;
  		background-size:100% 100%;
  	}
    .pause{
      background:url(../assets/icon/play.png) no-repeat;
      background-size:100% 100%;
      margin-right:16px;
    }
  	.song-list{
		  background:url(../assets/icon/list.png) no-repeat;
  		background-size:100% 100%;
  	}
  }
}

@keyframes playCicle{
  from{
    transform:rotateZ(0deg);
  }
  to{
    transform:rotateZ(360deg);
  }
}
</style>