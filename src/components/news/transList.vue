<template>
  <div id="transList">
      <div>
          翻译列表
      </div>
  </div>
</template>

<script>

export default {
  name: 'transList',
  data(){
      return {
          newsId:-1,
      }
  },
  watch:{
    $route(to){
      this.newsId = to.params.newsId;
      this.updateTransList();
    }
  },
  methods:{
    updateTransList:function(){
    }
  },
  components:{
  },
  created:function(){
    this.newsId = this.$route.params.newsId;
    this.updateTransList();
  }
}

</script>

<style scoped>

#transList{
  margin-left: 10px;
  margin-right:10px;
  margin-bottom: 20px;
  padding:20px;
  color:black;
  height: 100px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

}
</style>