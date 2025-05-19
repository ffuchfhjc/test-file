<template>
  <ConfirmModal :title :text :leftButton :rightButton @left-button="onLeftButton" @right-button="onRightButton" @back-wrap="emit('close')" />
</template>

<script setup>
import ConfirmModal from "@/components/ConfirmModal.vue"

const emit = defineEmits(["close", "leave"])

const title = "是否确认退出页面"
// const text = `美团首页搜索“<span style="color: #00b300;">门店淘金</span>”进入。`
const text = [
  {
    content: "美团首页搜索",
    highlight: false,
  },
  {
    content: "门店淘金",
    highlight: true,
  },
  {
    content: "进入",
    highlight: false,
  },
]
const leftButton = "取消"
const rightButton = "确认"
const onLeftButton = () => {
  emit("close")
}
const onRightButton = () => {
  emit("leave")
}
</script>

<style scoped lang="scss"></style>
