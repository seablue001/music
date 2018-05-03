<template>
<keep-alive>
	<transition name="fade">
	  <div class="singer-detail">
		  
	   		<div class="header">
		   		<div class="container">
		   			<router-link to="/singer">	
		   			<i ></i>
		   			</router-link>
		   			{{singer.singer_name}}
		   		</div>
	   		</div>
	   		<div class="thumb">
	   			<img :src="'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+ singer.singer_mid +'.jpg'" v-if="loadState">
	   		</div>
		   	<div class="list">
		   		<keep-alive>
			        <div class="wrapper singerdetail-wrapper">
			      	    <div class="content">
					   		<ul>
					   			<li v-for="(m,k) in singer.list" @click="setCurInfo(m.musicData.songname,singer.singer_name,m.musicData)">
					   				<router-link :to="'/song/' + m.musicData.songmid + '/' + m.musicData.albummid" tag="div">
					   				<h2 v-text="m.musicData.songname"></h2>
					   				<span>{{singer.singer_name}}-{{m.musicData.albumname}}</span>
					   				</router-link>
					   			</li>
					   		</ul>
				   		</div>
				   	</div>
				</keep-alive>
		   	</div>
		
	  </div>
  </transition>
</keep-alive>
</template>

<script>
import jsonp from "jsonp"
import api from "@/api/singerApi"
import BScroll from 'better-scroll'
import {mapGetters,mapMutations} from 'vuex'
export default {
  name: '',
  data(){
    return {
    	loadState:false,
    	singer:{}
    }
  },
  computed:{
  	...mapGetters([
  		'getCurSong',
  		'getCurSinger',
  		'getSongList',
  		'getPlayState'
  	])
  },
  created:function(){
  	let vm = this;
  	let mid = this.$route.params.id;
  	let singerApi = api.singerDetailApi+mid;

  	jsonp(singerApi,{param:'jsonpCallback'},function(err,data){
  		vm.singer = data.data;
  		vm.loadState = true;
  		vm.$nextTick(function(){
	      scroll = new BScroll('.singerdetail-wrapper',{
	        click:true
	      });
	    });
  	});
  },
  mounted(){
  	if(this.getPlayState){
  		let wrapperNode = document.querySelector('.singerdetail-wrapper');
		wrapperNode.style.height = '280px';
		wrapperNode.style.bottom = '60px';
  	}
	
  },
  methods:{
    back:function(){ 
    	this.$router.push('/singer', function(){
    	}, function(){});
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
  }
}
</script>

<style lang="scss" scoped>
.container{
	padding:0 10px;
	margin:0 auto;
}
.singer-detail{
	background-color: #060506;
	height:100vh;
}
.header{
	text-align: center;
	font-size:20px;
	line-height: 55px;
	color:#fff;
	position: fixed;
    width: 100%;
	i{
		display: inline-block;
		width:25px;
		height:25px;
		padding:15px;
		background:url("../assets/icon/back.png") no-repeat;
		background-size:25px 25px;
		background-position: center center;
		position: absolute;
	    left: 0;
	}
}

.thumb{
	img{
		width:100%;
	}
}

.list{
	.wrapper{
		width:100vw;
		height:340px;
		position:fixed;
		bottom:0;
		z-index:99;
		background-color: #060506;
		color:#fff;
		overflow: hidden;
		li{
			padding:0 10px;
			padding-top:10px;
			h2{
				font-weight: normal;
				font-size:18px;
			}
			span{
				font-size:14px;
				color:#666;
			}
		}
	}
	
}
.fade-enter-active{
  animation: slideInRight .3s ease-in-out;
}

</style>