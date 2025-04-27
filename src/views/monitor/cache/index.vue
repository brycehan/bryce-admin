<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-descriptions :column="3" border>
          <template #title>
            <icon icon="ep:monitor" />
            <span class="ml-1">基本信息</span>
          </template>
          <el-descriptions-item label="Redis版本">{{ data.info.redis_version }}</el-descriptions-item>
          <el-descriptions-item label="运行模式">{{
            data.info.redis_mode === 'standalone' ? '单机' : '集群'
          }}</el-descriptions-item>
          <el-descriptions-item label="端口">{{ data.info.tcp_port }}</el-descriptions-item>
          <el-descriptions-item label="客户端数">{{ data.info.connected_clients }}</el-descriptions-item>
          <el-descriptions-item label="运行时间（天）">{{ data.info.uptime_in_days }}</el-descriptions-item>
          <el-descriptions-item label="已用内存">{{ data.info.used_memory_human }}</el-descriptions-item>
          <el-descriptions-item label="使用 CPU">{{ data.info.used_cpu_user_children }}%</el-descriptions-item>
          <el-descriptions-item label="最大内存配置">{{ data.info.maxmemory_human }}</el-descriptions-item>
          <el-descriptions-item label="AOF 是否开启">{{
            data.info.aof_enabled === 0 ? '否' : '是'
          }}</el-descriptions-item>
          <el-descriptions-item label="RDB 是否成功">{{ data.info.rdb_last_bgsave_status }}</el-descriptions-item>
          <el-descriptions-item label="Key 数量">{{ data.keyCount }}</el-descriptions-item>
          <el-descriptions-item label="网络入口/出口"
            >{{ data.info.instantaneous_input_kbps }}kps/{{
              data.info.instantaneous_output_kbps
            }}kps</el-descriptions-item
          >
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row class="mt-6">
      <el-col :span="12">
        <div class="disk-header">
          <icon icon="ep:pie-chart" />
          <span class="ml-1">命令统计</span>
        </div>
        <el-divider content-position="right"></el-divider>
        <div class="el-table el-table--enable-row-hover el-table--default">
          <div ref="commandStatsRef" style="height: 420px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="disk-header">
          <icon icon="ep:odometer" />
          <span class="ml-1">内存信息</span>
        </div>
        <el-divider></el-divider>
        <div class="el-table el-table--enable-row-hover el-table--default">
          <div ref="usedMemoryRef" style="height: 420px" />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { getInfoApi } from '@/api/monitor/cache'
import modal from '@/utils/modal'
import * as echarts from 'echarts'
const data = reactive({
  info: {
    redis_version: '',
    redis_mode: 'standalone',
    tcp_port: 6379,
    connected_clients: 1,
    uptime_in_days: 0,
    used_memory_human: 0,
    used_cpu_user_children: 0,
    maxmemory_human: 0,
    aof_enabled: 0,
    rdb_last_bgsave_status: '0',
    instantaneous_input_kbps: '0.00',
    instantaneous_output_kbps: '0.00',
  },
  keyCount: 0,
  commandStats: [],
})

const commandStatsRef = ref()
const usedMemoryRef = ref()
let commandStats = null
let usedMemory = null

onMounted(() => {
  getCacheInfo()
})

const getCacheInfo = () => {
  const loading = modal.loading('正在加载缓存监控数据，请稍候！')
  getInfoApi().then((res: any) => {
    Object.assign(data, res.data)
    modal.closeLoading(loading)
    // 命令统计图表初始化
    commandStats = echarts.init(commandStatsRef.value)
    commandStats.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '命令',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: res.data.commandStats,
          animationType: 'cubicInOut',
          animationDuration: 1000,
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
        },
      ],
    })

    // 内存信息图表初始化
    usedMemory = echarts.init(usedMemoryRef.value)
    usedMemory.setOption({
      tooltip: {
        formatter: '{b} <br/>{a} ：' + res.data.info.used_memory_human,
      },
      series: [
        {
          type: 'gauge',
          name: '峰值',
          min: 0,
          max: 1000,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d'],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2,
            },
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4,
            },
          },
          axisLabel: {
            color: 'inherit',
            distance: 40,
            fontSize: 20,
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} M',
            color: 'inherit',
          },
          data: [
            {
              value: parseFloat(res.data.info.used_memory_human),
              name: '内存消耗',
            },
          ],
        },
      ],
    })

    window.addEventListener('resize', function () {
      commandStatsRef.value.resize()
      usedMemoryRef.value.resize()
    })
  })
}
</script>

<style scoped lang="scss">
.el-descriptions :deep(.el-descriptions__title) {
  display: flex;
  align-items: center;
  font-weight: unset;
  line-height: 1rem;
}

.disk-header {
  display: flex;

  span {
    font-size: 16px;
    line-height: 1rem;
  }
}

.descriptions-row {
  display: flex;
  justify-content: space-between;

  .el-descriptions {
    width: 48%;
  }
}

::v-deep(.el-col-12) {
  padding: 0 10px;
}

::v-deep(.el-divider--horizontal) {
  margin: 18px 0;
}
</style>
