<template>
  <div class="share-page">
    <div class="share-img"><img src="../assets/images/share-img.png" alt="" /></div>
    <div class="share-text">
      <span>点击右上角 ...<br>分享小程序给好友</span>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.share-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.share-img {
  margin-right: 150px;
  text-align: right;
}
.share-text {
  font-size: 28px;
  color: #333;
  text-align: center;
  span {
    display: inline-block;
    line-height: 2em;
    padding: 30px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
}
</style>
