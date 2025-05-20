<template>
  <ConfirmModal :title :text :leftButton :rightButton @left-button="onLeftButton" @right-button="onRightButton"
    @back-wrap="emit('close')" />
</template>

<script setup>
import ConfirmModal from '@/components/ConfirmModal.vue';

const emit = defineEmits(['delete-wifi', 'close'])
const props = defineProps(['ssid'])

const title = "请您修改Wi-Fi设置"
const text = `Wi-Fi 连接记录会影响验证结果，请前往网络设置页，找到 ${props.ssid} 后，选择 删除/忘记。`
const leftButton = "我已操作"
const rightButton = "去操作"

const onLeftButton = () => {
  emit('delete-wifi')
}
const onRightButton = () => {
  window.KNBP.use('meituan.pinBossWifiCommonJsHandler', {
    clazz: "BossWifiKnbInterface",
    method: "openWifiSettings"
  })
}
</script>

<style scoped lang="scss"></style>
