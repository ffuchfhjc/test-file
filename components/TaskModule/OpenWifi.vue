<template>
  <ConfirmModal :title :text :leftButton :rightButton @left-button="onLeftButton" @right-button="onRightButton"
    @back-wrap="emit('close')" />
</template>

<script setup>
import ConfirmModal from '@/components/ConfirmModal.vue';
import { store } from "../../store"
const emit = defineEmits(['close', 'hasOpenWifi'])

const title = "请打开WiFi开关"
const text = `请打开WiFi开关，否则无法验证WiFi`
const leftButton = "我已打开"
const rightButton = "去打开"

const onLeftButton = () => {
  emit('hasOpenWifi')
}
const onRightButton = () => {
  KNBP.use('meituan.pinBossWifiCommonJsHandler', {
    clazz: "BossWifiKnbInterface",
    method: "enableWifi"
  }).then(() => {
    console.log('跳转打开wifi成功')
  }).catch((err) => {
    console.error('跳转打开wifi失败', err)
  })
}
KNBP.setLLButton({
  handle: () => {
    store.resetBack()
    emit('close')
  }
})
</script>

<style scoped lang="scss"></style>
