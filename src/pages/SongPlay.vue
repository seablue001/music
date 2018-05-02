<template>
  <transition name="songplay">
  <div class="song-play">
  	<div class="header">
  		<h1><i @click="close"></i>{{getCurSinger}}</h1>
  		<span v-text="getCurSong"></span>
  	</div>
	   
    <div class="box"></div>
    <div class="thumb" :class="playClass">
      <img :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+albummid+'.jpg?max_age=2592000'">
    </div>

    <div class="opt-btn">
      <a href="javascript:void(0);" class="mode"></a>
      <a href="javascript:void(0);" class="prev"></a>
      <a href="javascript:void(0);" class="playPause pause" @click="playOrPause"></a>
      <a href="javascript:void(0);" class="next"></a>
      <a href="javascript:void(0);" class="like"></a>
    </div>
  
  	<div class="bg-album">
  		<img :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+albummid+'.jpg?max_age=2592000'">
  	</div>


  </div>
  </transition>

</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import api from '@/api/songApi'
import jsonp from 'jsonp'

import playIcon from '../assets/icon/play.png'
import pauseIcon from '../assets/icon/pause.png'

export default {
  name: '',
  data(){
    return {
    	mid:'',
    	albummid:'',
    	vk:'',
    	src:'',
      playClass:''
    }
  },
  computed: {
    ...mapGetters([
      'getPlayState',
      'getCurSong',
      'getCurSinger',
      'getCurSinger'
    ])
  },
  created:function(){
  	let vm = this;
  	this.mid = this.$route.params.id;
  	this.albummid = this.$route.params.albummid;

  	//动态获取vkey
  	let vKeyApi = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&cid=205361747&platform=yqq&hostUin=0&needNewCode=0&uin=0&songmid="+this.mid+"&filename=C400"+this.mid+".m4a&guid=7120953682";

  	jsonp(vKeyApi,{param:'callback'},function(err,data){
  		vm.vk = data.data.items[0].vkey;
  		vm.src = 'http://dl.stream.qqmusic.qq.com/C400'+vm.mid+'.m4a?vkey='+vm.vk+'&guid=7120953682&uin=0&fromtag=66';
  		
      //将播放地址加入state
      vm.setCurSongSrc(vm.src);

      vm.playClass = 'playing';
      vm.setPlayState(true);
      let player = document.querySelector("#player");
      player.play();
  	});
  },
  methods:{
    close:function(){
      this.$router.go(-1);
    },
    playOrPause:function(){
      let player = document.querySelector("#player");
      let playState = this.getPlayState;
      let thumb = document.querySelector('.thumb');
      let playBtn = document.querySelector('.playPause');
      if(playState){
        player.pause();
        this.setPlayState(false);
        thumb.style.animationPlayState = 'paused';
        playBtn.setAttribute('class','playPause play');
      }else{
        player.play();
        this.setPlayState(true);
        thumb.style.animationPlayState = 'running';
        playBtn.setAttribute('class','playPause pause');
      }
    },
    ...mapMutations({
      setPlayState: 'SET_PLAY_STATE',
      setCurSongSrc: 'SET_CUR_SONG_SRC'
    })
  }
}
</script>

<style lang="scss" scoped>
@mixin bg($src){
  background:url('../assets/icon/'+$src) no-repeat;
  background-size:100% 100%;
}
.song-play{
  overflow-x: hidden;
  position: relative;
  z-index: 1010;
  height:100vh;
}
.header{
	text-align: center;
	color:#fff;
	position: relative;
  top:0;
    z-index: 1010;
	h1{
		font-weight: 400;
		font-size:22px;
		line-height: 55px;
		i{
			display: inline-block;
			width:25px;
			height:25px;
			padding:15px;
			background:url("../assets/icon/arrow_down.png") no-repeat;
			background-size:25px 25px;
			background-position: center center;
			position: absolute;
		  left: 0;
		}
	}
	span{
		font-size: 15px;
	}
}

.thumb{
  text-align: center;
  margin-top:15px;
  position: relative;
  left: 0;
  top: 0;
  z-index:1010;
  &.playing{
    animation:playCicle 5s linear infinite;
  }

  img{
    width:250px;
    height:250px;
    border-radius: 50%;
    border:10px solid rgba(0,0,0,.26);
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


.opt-btn{
  display: flex;
  position: fixed;
  z-index:1010;
  bottom:30px;
  width:100%;
  justify-content:space-around;
  a{
    width:30px;
    height:30px;
    background:red;
    $opList:'mode','prev','play','pause','next','like';
    @each $val in $opList{
      &.#{$val}{
        @include bg('#{$val}.png');
      }
    }
  
  }
}


.bg-album{
	background: #000;
  height: 100vh;
  position: fixed;
  top: 0;
  width: 100%;
  transform-origin:center center;

	img{
		width: 100%;
	    height: 100vh;
	    position: absolute;
	    top: 0;
	    filter:blur(20px);
	}	
}

.header,.opt-btn{ 
  transition:all .2s cubic-bezier(0, 0.48, 0.32, 1.31) .25s;
}
.thumb{
  transition:all .4s cubic-bezier(0.68, 0.44, 0.32, 0.71);
  img{
    transition:all .4s cubic-bezier(0.68, 0.44, 0.32, 0.71);
  }
}


.songplay-enter-active,.songplay-enter-to{
  .header{
    top: 0px;
  }
}

.songplay-enter,.songplay-leave-active{
  .header{
      top: -97px;
  }
}

.songplay-enter-active,.songplay-enter-to{
  .opt-btn{
    bottom: 30px;
  }
}

.songplay-enter,.songplay-leave-active{
  .opt-btn{
      bottom: -30px;
  }
}


.songplay-enter-active,.songplay-enter-to{
  .thumb{
    width: 250px;
    height: 250px;
    img{
      width: 250px;
      height: 250px;
    }
  }
}

.songplay-enter,.songplay-leave-active{
  .thumb{
    width: 45px;
    height: 45px;
    left: -100px;
    top: 415px;
    img{
      width: 45px;
      height: 45px;
    }

  }
}

</style>