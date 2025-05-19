<template>
  <div class="record">
    <div class="tabs">
      <div class="tabs-list">
        <div v-for="item in statusList" class="tab" :class="{ active: activeStatus === item.status }"
          @click="handleStatusClick(item.status)">
          <span class="tab-text">{{ STATUS_TEXT[item.status] }}</span>
          <span class="tab-count">{{ item.count }}</span>
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="item in filteredTaskRecord" :key="item.date" class="group">
        <div class="date">{{ item.date }}</div>
        <div v-for="task in item.task" :key="task.wifiName" class="item">
          <div class="icon">
            <img class="wifi" src="https://p0.meituan.net/undertake/1fbb25e9c5425f40e33e401b2b9d25721571.png"
              alt="wifi图标" />
          </div>
          <div class="content">
            <div class="header">
              <div class="title">{{ task.wifiName }}</div>
              <div class="status" :class="task.status">{{ STATUS_TEXT[task.status] }}</div>
            </div>
            <div class="location">{{ task.poiName }}</div>
            <div class="footer">
              <div class="time">{{ task.time }}</div>
              <div class="price">
                <span class="price-label">预计</span>
                <span class="price-symbol">¥</span>
                <span class="price-num">{{ formatAmount(task.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="!filteredTaskRecord.length">
        <img class="blank-img" src="https://p0.meituan.net/undertake/e89812400d3bf03c6c8b1a79d6c41ab07638.png" alt="">
        <div class="blank-text">暂无任务记录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store } from '../../store'
import { sendMv, sendMc } from '../../lxreport';
import { formatAmount } from '@/utils/transform'

sendMv('b_lintopt_3pfcu6zi_mv')

const props = defineProps(['userTasks'])
// 状态常量
const STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

const STATUS_TEXT = {
  [STATUS.ALL]: '全部',
  [STATUS.PENDING]: '待审核',
  [STATUS.APPROVED]: '已通过',
  [STATUS.REJECTED]: '未通过'
}
// 个人中心直接进任务通过状态
const activeStatus = ref(store.directShowApprove ? STATUS.APPROVED : STATUS.ALL)
store.directShowApprove = false

const handleStatusClick = (status) => {
  sendMc('b_lintopt_3pfcu6zi_mc', { status: STATUS_TEXT[status] })
  activeStatus.value = status
}

// 模拟数据
const taskRecord = computed(() => props.userTasks?.taskRecord || [])
const statusList = computed(() => props.userTasks?.statusList || [])

// 过滤任务记录
const filteredTaskRecord = computed(() => {
  if (activeStatus.value === STATUS.ALL) { return taskRecord.value }
  return taskRecord.value
    .map(dateGroup => ({
      ...dateGroup,
      task: dateGroup.task.filter(task => task.status === activeStatus.value)
    }))
    .filter(dateGroup => dateGroup.task.length > 0)
})
</script>

<style scoped lang="scss">
// 变量
$color-primary: #00B300;
$color-error: #FF2D19;
$color-bg: #F5F5F5;
$color-text: rgba(0, 0, 0, 0.9);

.no-data {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  box-sizing: border-box;
  background-color: #F5F5F5;

  .blank-img {
    width: 148px;
    height: 148px;
    margin-bottom: 40px;
  }

  .blank-text {
    font-size: 32px;
    color: rgba(0, 0, 0, 0.7);
    margin-bottom: 65px;
  }
}

.record {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.tabs {
  &-list {
    display: flex;
    font-size: 32px;
    font-weight: 600;
    line-height: 44px;
  }

  .tab {
    display: flex;
    flex: 0 0 25%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 0;

    &.active {
      color: $color-primary;
      background-color: $color-bg;
    }
  }
}

.list {
  flex: 1;
  overflow-y: auto;
  background: $color-bg;
  color: $color-text;

  .date {
    margin: 24px 0 8px 32px;
    font-size: 28px;
  }
}

.item {
  display: flex;
  margin: 16px 8px;
  padding: 32px 24px;
  background: #FFFFFF;
  border-radius: 8px;

  .icon {
    flex: 0 0 72px;

    .wifi {
      position: relative;
      top: -4px;
      width: 56px;
    }
  }

  .content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
    font-size: 28px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        overflow: hidden;
        font-size: 32px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        margin-left: 40px;
        font-size: 28px;
        flex-shrink: 0;

        &.approved {
          color: $color-primary;
        }

        &.rejected {
          color: $color-error;
        }
      }
    }

    .location {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      &-label {
        font-size: 28px;
        font-weight: 500;
      }

      &-symbol {
        font-size: 22px;
      }

      &-num {
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
}
</style>
