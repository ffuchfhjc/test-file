const clusterListData = [
  {
    packageName: '测试集群1测试集群1测试集群1测试集群1',
    taskCount: 10,
    distance: 100,
    estimateDuration: '10',
    packageAmount: 100,
    packageLat: 40.00094,
    packageLng: 116.47543,
  },
  {
    packageName: '测试集群2',
    taskCount: 10,
    distance: 100,
    estimateDuration: '100',
    packageAmount: 100,
    packageLat: 40.00094,
    packageLng: 116.46543,
  },
]
const taskListData = [
  {
    wifiName: '测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    poiAddress: '测试门店地址',
    distance: 1000,
    poiLat: 40.01092,
    poiLng: 116.49673,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi2',
    poiName: '测试门店2',
    poiAddress: '测试门店地址测试门店地址测试门店地址测试门店地址',
    distance: 1000,
    poiLat: 40.00094,
    poiLng: 116.46543,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    poiAddress: '测试门店地址',
    distance: 1000,
    poiLat: 40.01092,
    poiLng: 116.49673,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi2',
    poiName: '测试门店2',
    poiAddress: '测试门店地址测试门店地址测试门店地址测试门店地址',
    distance: 1000,
    poiLat: 40.00094,
    poiLng: 116.46543,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    poiAddress: '测试门店地址',
    distance: 1000,
    poiLat: 40.01092,
    poiLng: 116.49673,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi2',
    poiName: '测试门店2',
    poiAddress: '测试门店地址测试门店地址测试门店地址测试门店地址',
    distance: 1000,
    poiLat: 40.00094,
    poiLng: 116.46543,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    poiAddress: '测试门店地址',
    distance: 1000,
    poiLat: 40.01092,
    poiLng: 116.49673,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi2',
    poiName: '测试门店2',
    poiAddress: '测试门店地址测试门店地址测试门店地址测试门店地址',
    distance: 1000,
    poiLat: 40.00094,
    poiLng: 116.46543,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi测试wifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    poiAddress: '测试门店地址',
    distance: 1000,
    poiLat: 40.01092,
    poiLng: 116.49673,
    taskReward: 100,
  },
  {
    wifiName: '测试wifi2',
    poiName: '测试门店2',
    poiAddress: '测试门店地址测试门店地址测试门店地址测试门店地址',
    distance: 1000,
    poiLat: 40.00094,
    poiLng: 116.46543,
    taskReward: 100,
  },
]
const taskRecordData = {
  statusList: [
    { status: 'all', count: 4 },
    { status: 'pending', count: 2 },
    { status: 'approved', count: 2 },
    { status: 'rejected', count: 0 },
  ],
  taskRecord: [
    {
      date: '2025-04-22',
      task: [
        {
          wifiName: '任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1',
          status: 'pending',
          poiName: '任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1',
          amount: 100,
          time: '2025-04-22 10:00:00',
        },
        {
          wifiName: '任务2',
          status: 'approved',
          poiName: '任务2',
          amount: 100,
          time: '2025-04-22 10:00:00',
        },
        {
          wifiName: '任务3',
          status: 'rejected',
          poiName: '任务3',
          amount: 100,
          time: '2025-04-22 10:00:00',
        },
      ],
    },
    {
      date: '2025-04-21',
      task: [
        {
          wifiName: '任务1',
          status: 'pending',
          poiName: '任务1',
          amount: 100,
          time: '2025-04-22 10:00:00',
        },
        {
          wifiName: '任务2',
          status: 'approved',
          poiName: '任务2',
          amount: 100,
          time: '2025-04-22 10:00:00',
        },
      ],
    },
  ],
}
const scanWifiListData = [
  {
    wifiName: 'testNearbyWifitestNearbyWifitestNearbyWifitestNearbyWifi',
    poiName: '测试门店1测试门店1测试门店1测试测试门店1测试门店1测试门店1测试',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1测试门店1测试门店1测试',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1测试门店1测试门店1测试门店1测试门店1测试门店1',
    taskReward: 100,
  },
  {
    wifiName: 'testNearbyWifi',
    poiName: '测试门店1',
    taskReward: 100,
  },
]
const withdrawHistoryData = {
  withdrawDetailBOList: [
    { amount: 3000, create_time: '2025.05.15' },
    { amount: 5000, create_time: '2025.05.15' },
  ],
  totalWithdraw: 2300,
}
const shareData = {
  totalReward: '2300',
  canInvite: true,
  recordDTOList: [
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'pending',//review,success,fail
      reward: 4000,
      effectTime: 200000
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'review',//review,success,fail
      schedule: '任务进度(2/25),任务完成后发放奖励',
      reward: 4000,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'success',//review,success,fail
      reward: 3000,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'fail',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'review',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'success',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'fail',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'review',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'success',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    },
    {
      name: 'wxid1234',
      avatar: 'https://p0.meituan.net/undertake/5db3940ad7c3662c6ba330f0fc3f831e1592.png',
      status: 'fail',//review,success,fail
      reward: 100,
      effectTime: 60 * 1000 * 30
    }
  ]
}
const orderActivityProgressData = [
  {
    "orderActivityName": '完成首单任务',
    "current": 1,
    "target": 1,
    "status": 1,
    "reward": "400"
  },
  {
    "orderActivityName": '完成前10单任务',
    "current": 7,
    "target": 10,
    "status": 0,
    "reward": "3000"
  },
  {
    "orderActivityName": '完成前50单任务',
    "current": 7,
    "target": 50,
    "status": 0,
    "reward": "6000"
  }
]
const statisticsData = {
  orderActivityProgress: orderActivityProgressData
}
export { clusterListData, taskListData, scanWifiListData, taskRecordData, withdrawHistoryData, shareData, orderActivityProgressData, statisticsData }
