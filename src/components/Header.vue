<template>
  <div class="header">
   	<h1 class="logo"><i></i>vue音乐</h1>	
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
.header{
  padding:5px 0;
  background-color:#060506;
}
.logo{
  font-weight: 400;
  font-size:22px;
  color:#fff;
  text-align: center;
  i{
    display:inline-block;
    vertical-align: middle;
    width:30px;
    height:30px;
    background:url(../assets/icon/logo.png) no-repeat;
    background-size:30px 30px;
  }
}
</style>