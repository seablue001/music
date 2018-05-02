<template>
  <div class="tab-nav">
  	 <router-link to="index" active-class="active"><span>推荐</span></router-link>
  	 <router-link to="singer" active-class="active"><span>歌手</span></router-link>
  	 <router-link to="search" active-class="active"><span>搜索</span></router-link>	
  </div>
</template>

<script>
export default {
  name: '',
  data(){
    return {
    
    }
  },
  methods:{
    
  }
}
</script>

<style lang="scss" scoped>
.tab-nav{
	background-color: #060506;
	padding:10px 0;
	overflow: hidden;
	a{
		display:block;
		float:left;
		width:33.33333%;
		text-align: center;
		font-size:16px;
		color:#fff;
		span{
			padding-bottom:8px;
		}
		&.active span{
			color:#d3442c;
			border-bottom:2px solid #d3442c;
		}
	}
}
</style>

