<template>
  <div class="loading" v-show="state">
   		<i></i>
		  <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  name: '',
  data(){
    return {
    
    }
  },
  props:{
  	//提示文字
  	text:{
  		type: String,
      default: '加载中...'
  	},
  	state:{
  		type: Boolean,
  		default: true
  	}
  },
  methods:{
    
  }
}
</script>

<style lang="scss" scoped>
.loading{
  position:fixed;
  top:310px;
  width:100%;
	font-size:15px;
	color:#fff;
	text-align: center;
	i{
		display:inline-block;
		width:25px;
		height:25px;
		background: url(./loading.gif) no-repeat;
		background-size:100% 100%;
	}
}
</style>