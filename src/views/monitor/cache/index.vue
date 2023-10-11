<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-descriptions :column="3" border>
          <template #title>
            <el-icon>
              <Monitor />
            </el-icon>
            <span class="ml-1">基本信息</span>
          </template>
          <el-descriptions-item label="Redis版本">{{ data.info.redis_version}}</el-descriptions-item>
          <el-descriptions-item label="运行模式">{{ data.info.redis_mode === 'standalone' ? '单机': '集群'}}</el-descriptions-item>
          <el-descriptions-item label="端口">{{ data.info.tcp_port}}</el-descriptions-item>
          <el-descriptions-item label="客户端数">{{ data.info.connected_clients}}</el-descriptions-item>
          <el-descriptions-item label="运行时间（天）">{{ data.info.uptime_in_days}}</el-descriptions-item>
          <el-descriptions-item label="Key 数量">{{ data.keyCount}}</el-descriptions-item>
          <el-descriptions-item label="最大内存配置">{{ data.info.maxmemory_human}}</el-descriptions-item>
          <el-descriptions-item label="使用 CPU">{{ data.info.used_cpu_user_children}}%</el-descriptions-item>
          <el-descriptions-item label="已用内存">{{ data.info.used_memory_human}}</el-descriptions-item>
          <el-descriptions-item label="AOF 是否开启">{{ data.info.aof_enabled === 0 ? '否': '是'}}</el-descriptions-item>
          <el-descriptions-item label="RDB 是否成功">{{ data.info.rdb_last_bgsave_status}}</el-descriptions-item>
          <el-descriptions-item label="网络入口/出口">{{ data.info.instantaneous_input_kbps}}kps/{{ data.info.instantaneous_output_kbps}}kps</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row class="mt-4">
      <el-col :span="24">
          <div class="disk-header mb-3">
            <el-icon>
              <MessageBox />
            </el-icon>
            <span class="ml-1">命令统计</span>
          </div>
          <el-table :data="data.commandStats" class="w-100" border>
            <el-table-column align="center" label="命令" prop="name" />
            <el-table-column align="center" label="调用量" prop="value" />
          </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import { info } from "@/api/monitor/cache";
import {MessageBox, Monitor} from "@element-plus/icons-vue";

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
  commandStats: []
})

onMounted(() => {
  getCacheInfo()
})

const getCacheInfo = () => {
  info().then((res: any) => {
    Object.assign(data, res.data)
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
    line-height: 1rem;
    font-size: 16px;
  }
}
.descriptions-row {
  .el-descriptions {
    width: 48%;
  }
  display: flex;
  justify-content: space-between;
}
</style>