<template>
  <div class="img-poster">
    <div class="img-container">
      <img :src="src" />
    </div>
    <!-- <button v-if="showCloseButton" class="close-btn" @click="close">{{ btnText }}</button> -->
    <div class="footer">
      <div v-if="showCloseButton" class="btn" @click="close">{{ btnText }}</div>
      <slot></slot>
    </div>
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
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 160px;
  background: white;
  z-index: 9000;
  overflow: auto;
}

.img-container img {
  width: 100vw;
}
.footer {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  padding-top: 40px;
  padding-bottom: 70px;
  background: white;
  box-shadow: 0px -2px 12px 0px rgba(0, 0, 0, 0.06);
  /* .btn {
    border-radius: 8px;
    height: 50px;
    font-size: 30px;
    font-weight: 500;
    color: #FFFFFF;
    background: #00B300;
  } */

  .btn {
    border-radius: 8px;
    height: 88px;
    font-size: 30px;
    font-weight: 500;
    color: #ffffff;
    background: #00b300;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin: 0 28px;
  }
}
</style>
