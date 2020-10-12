<template>
  <div id="app">
    <div v-if="loading" class="loading-wrap">
      <div class="loadEffect">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {{ loadingText }}
    </div>
    <Update :show.sync="show" :percent="percent"></Update>
    <div id="nav">
      <div class="title">
        <span>一个工具</span
        ><span style="font-size: 14px; margin-right: 10px;">v1.0.0</span>
        <!-- <button @click="updateApp">检查更新</button> -->
      </div>
    </div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Update from '@/components/update'
export default {
  data () {
    return {
      percent: 0,
      show: false
    }
  },
  components: { Update },
  created () {
    this.$router.push({ path: '/' })
  },
  mounted () {
    //更新进度
    this.$electron.ipcRenderer.on('downloadProgress', (event, data) => {
      this.percent = data.percent.toFixed(2)
      if (data.percent >= 100) {
        // this.show = false;
      }
    })

    /**
     * 主进程返回的检测状态
     */
    this.$electron.ipcRenderer.on('message', (event, data) => {
      switch (data.status) {
        case -1:
          alert(data.msg)
          this.show = false
          break
        case 0:
          alert(data.msg)
          this.show = false
          break
        case 1:
          this.show = true
          break
      }
    })
  },
  methods: {
    updateApp () {
      this.$electron.ipcRenderer.send('checkForUpdate', 'asdad')
    }
  },
  computed: {
    loading () {
      return this.$store.state.loadOption.status
    },
    loadingText () {
      return this.$store.state.loadOption.text
    }
  }
}
</script>

<style lang="less">
html {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
}
* {
  margin: 0;
  padding: 0;
}
#app {
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.loading-wrap {
  box-sizing: border-box;
  text-align: center;
  padding-top: 15%;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(58, 49, 49, 0.5);
  z-index: 1000;
  font-size: 30px;
  font-weight: bold;
  color: white;
}

.loadEffect {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
  margin-top: 100px;
}
.loadEffect span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  position: absolute;
  animation: load 1.04s ease infinite;
}
@keyframes load {
  0% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.3);
    opacity: 0.5;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -10px;
  animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -10px;
  animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -10px;
  animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -10px;
  animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  animation-delay: 1.04s;
}
</style>
