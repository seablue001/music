<template>
  <div id="app">
    
    
      <!-- <keep-alive> -->
        <router-view/>
      <!-- </keep-alive> -->
    
      
    
      <!-- S miniPlayer 迷你播放器 -->
      <MiniPlayer></MiniPlayer>
      <!-- E miniPlayer 迷你播放器 -->
 
  </div>
</template>

<script>
import MiniPlayer from '@/components/MiniPlayer';
export default {
  name: 'App',
  components:{
    MiniPlayer
  }
}
</script>

<style lang="scss">
@import '/assets/css/animate.css';
*{
  margin:0;
  padding:0;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color:transparent; 
}
a{
  text-decoration: none;  
}
body{
  background-color:#060506;
  overflow: hidden;
  height: 100vh;
}
#app {
  font-family: '微软雅黑','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
