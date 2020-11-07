<template>
  <div id="commentArea">
      <div>
          <div class="commentMain">
              评论区
          </div>
      </div>
      
  </div>
</template>

<script>

export default {
  name: 'commentArea',
  data(){
      return {
          
      }
  },
  components:{
  }
}

</script>

<style>
#newsOther {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #909399;
}

.commentMain{
  margin-left: 10px;
  margin-right:10px;
  margin-bottom: 20px;
  padding: 50px 20px;
  color:black;
  height: 100px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>