<template>
  <div class="content-wrap">
    <div class="left-wrap"></div>
    <div class="right-wrap">
      <!-- <VueDragResize
          style="background: rgba(173,216,230,0.7)"
          :isActive="true"
          :w="barTextSet.width"
          :h="barTextSet.height"
          :x="barTextSet.left"
          :y="barTextSet.top"
          :minh="10"
          v-on:resizing="barTextResize"
          v-on:dragging="barTextResize"
        >
          <div class="title-item">
            <span>单号</span>
            <span>位置：{{ barTextSet.top }} х {{ barTextSet.left }}</span>
            <span>宽高：{{ barTextSet.width }} х {{ barTextSet.height }}</span>
          </div>
        </VueDragResize> -->
    </div>
  </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize'

export default {
  name: 'set',
  data () {
    return {}
  },
  components: {
    VueDragResize
  },
  methods: {}
}
</script>

<style scoped></style>
