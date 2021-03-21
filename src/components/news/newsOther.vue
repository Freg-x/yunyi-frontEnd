<template>
  <div id="newsOther">
      <div>
          <div class="rest">
            今日热门
          </div>
      </div>
      
  </div>
</template>

<script>

export default {
  name: 'newsOther',
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
  margin:20px;
}

.rest{
  margin-left: 20px;
  margin-right:20px;
  margin-bottom:20px;
  padding: 50px 20px;
  color:black;
  height: 100px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>