<template>
  <div class="home">
    <div id="nav">
      <!-- <router-link to="/chadan">茶蛋京东抢单</router-link> -->
      <router-link to="/about">about</router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      list: []
    };
  },
  components: {},
  created() {
    // let moment = require("moment");
    // let newList = [];
    // this.list.forEach((item, index) => {
    //   let time = moment.unix(item.event_time).format("YYYY-MM-DD HH:mm:ss");
    //   this.$set(item, "event_time", time);
    //   newList.push({event_content:item.event_content,event_time:item.event_time})
    // });

    // console.log(JSON.stringify(newList));
  }
};
</script>
