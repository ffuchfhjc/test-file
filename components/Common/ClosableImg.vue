<template>
  <div class="img-poster">
    <div class="img-container">
      <img :src="src" />
    </div>
    <div class="close-btn" @click="close">×</div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"])

defineProps({
  src: {
    type: String,
    required: true,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  btnText: {
    type: String,
    default: "关闭",
  },
})

// 关闭
const close = () => {
  emit("close")
}

</script>

<style scoped lang="scss">
.img-poster {
  position: relative;
  width: 100vw;
  box-sizing: border-box;
}

.img-container {
  img {
    width: 100vw;
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
//   background: url("https://p0.meituan.net/undertake/db1ec72b4e12f1d5af01bc640a21e1e51151.png") no-repeat center center;
  color: white;
  font-size: 60px;
  text-align: center;
  line-height: 60px;
}
</style>
