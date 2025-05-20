<template>
  <ConfirmModal :title :text :leftButton :rightButton @left-button="onLeftButton" @right-button="onRightButton"
    @back-wrap="emit('close')" />
</template>

<script setup>
import ConfirmModal from '@/components/ConfirmModal.vue';

const emit = defineEmits(['close', 'confirm'])

const title = "确认跳过验证流程"
const text = `跳过验证环节可能导致任务审核失败，无法获取任务奖励，是否确认密码准确并提交？`
const leftButton = "返回"
const rightButton = "确认"

const onLeftButton = () => {
  emit('close')
}
const onRightButton = () => {
  emit('confirm')
}
</script>

<style scoped lang="scss"></style>
