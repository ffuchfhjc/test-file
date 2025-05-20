<template>
  <div class="area-select">
    <div :class="['select-item', { active: !fieldValue }]" @click="fieldValue = ''">
      附近3km
    </div>
    <div :class="['select-item', { active: fieldValue }]" @click="show = true">
      {{ fieldValue || '选择区域' }}
    </div>
    <Popup v-model:show="show" round position="bottom">
      <Cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="show = false"
        @finish="onFinish" />
    </Popup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCascaderAreaData } from '@vant/area-data';
import { Popup, Cascader } from 'vant';

const show = ref(false);
const fieldValue = ref('');
const cascaderValue = ref('520302');
const options = useCascaderAreaData();
const selectedItem = ref('nearby');

const handleSelect = (type) => {
  selectedItem.value = type;
  if (type === 'custom') {
    show.value = true;
  }
};

const onFinish = ({ selectedOptions }) => {
  show.value = false;
  console.log(cascaderValue.value)
  fieldValue.value = selectedOptions[selectedOptions.length - 1].text;
};
</script>

<style scoped lang="scss">
.area-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.select-item {
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background-color: #1989fa;
    color: #fff;
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
