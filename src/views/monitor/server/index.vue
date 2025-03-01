<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-descriptions :column="2" border>
          <template #title>
            <el-icon>
              <Monitor />
            </el-icon>
            <span class="ml-1">服务器信息</span>
          </template>
          <el-descriptions-item label="操作系统">{{ data.sys.osName }}</el-descriptions-item>
          <el-descriptions-item label="系统架构">{{ data.sys.osArch }}</el-descriptions-item>
          <el-descriptions-item label="系统版本">{{ data.sys.osVersion }}</el-descriptions-item>
          <el-descriptions-item label="系统名称">{{ data.sys.computerName }}</el-descriptions-item>
          <el-descriptions-item label="系统IP">{{ data.sys.computerIp }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row class="mt-6 descriptions-row">
      <el-descriptions :column="2" border>
        <template #title>
          <el-icon>
            <Cpu />
          </el-icon>
          <span class="ml-1">CPU</span>
        </template>
        <el-descriptions-item label="CPU 型号">{{ data.cpu.cpuModel }}</el-descriptions-item>
        <el-descriptions-item label="核心数">{{ data.cpu.cpuNum }}</el-descriptions-item>
        <el-descriptions-item label="用户使用率">{{ data.cpu.used }}%</el-descriptions-item>
        <el-descriptions-item label="系统使用率">{{ data.cpu.sys }}%</el-descriptions-item>
        <el-descriptions-item label="当前空闲率">{{ data.cpu.free }}%</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" border>
        <template #title>
          <el-icon>
            <Tickets />
          </el-icon>
          <span class="ml-1">系统内存</span>
        </template>
        <el-descriptions-item label="内存总量" width="100">{{
          data.mem.total
        }}</el-descriptions-item>
        <el-descriptions-item label="已用内存" width="100">{{
          data.mem.used
        }}</el-descriptions-item>
        <el-descriptions-item label="剩余内存">{{ data.mem.free }}</el-descriptions-item>
        <el-descriptions-item label="内存使用率">{{ data.mem.usage }}</el-descriptions-item>
      </el-descriptions>
    </el-row>
    <el-row class="mt-6">
      <el-col :span="24">
        <el-descriptions :column="2" border>
          <template #title>
            <el-icon>
              <CoffeeCup />
            </el-icon>
            <span class="ml-1">JVM信息</span>
          </template>
          <el-descriptions-item label="名称" width="100">{{ data.jvm.name }}</el-descriptions-item>
          <el-descriptions-item label="Java版本" width="100">{{
            data.jvm.version
          }}</el-descriptions-item>
          <el-descriptions-item label="厂商">{{ data.jvm.vendor }}</el-descriptions-item>
          <el-descriptions-item label="最大可用内存">{{ data.jvm.max }}</el-descriptions-item>
          <el-descriptions-item label="总内存">{{ data.jvm.total }}</el-descriptions-item>
          <el-descriptions-item label="已用内存">{{ data.jvm.used }}</el-descriptions-item>
          <el-descriptions-item label="空闲内存">{{ data.jvm.free }}</el-descriptions-item>
          <el-descriptions-item label="内存使用率">{{ data.jvm.usage }}</el-descriptions-item>
          <el-descriptions-item label="安装路径">{{ data.jvm.home }}</el-descriptions-item>
          <el-descriptions-item label="项目路径">{{ data.jvm.userDir }}</el-descriptions-item>
          <el-descriptions-item label="启动时间">{{ data.jvm.startedTime }}</el-descriptions-item>
          <el-descriptions-item label="运行时长">{{ data.jvm.runTime }}</el-descriptions-item>
          <el-descriptions-item label="运行参数">{{
            data.jvm.inputArguments
          }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row class="mt-6">
      <el-col :span="24">
        <div class="disk-header mb-5">
          <el-icon>
            <MessageBox />
          </el-icon>
          <span class="ml-1">磁盘信息</span>
        </div>
        <el-table :data="data.disks" class="w-full" border>
          <el-table-column align="center" label="磁盘名称" prop="diskName" />
          <el-table-column align="center" label="磁盘类型" prop="diskType" width="100"/>
          <el-table-column align="center" label="磁盘路径" prop="dirName" width="390"/>
          <el-table-column align="center" label="总大小" prop="total" width="110"/>
          <el-table-column align="center" label="已用大小" prop="used" width="110"/>
          <el-table-column align="center" label="空闲大小" prop="free" width="110"/>
          <el-table-column align="center" label="空间使用率" prop="usage" width="110"/>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { getServerInfoApi } from '@/api/monitor/server'
import { CoffeeCup, Cpu, MessageBox, Monitor, Tickets } from '@element-plus/icons-vue'
import modal from '@/utils/modal'

const data = reactive({
  cpu: {
    cpuModel: '',
    cpuNum: 0,
    used: 0,
    sys: 0,
    free: 0
  },
  mem: {
    total: '',
    used: '',
    free: '',
    usage: ''
  },
  jvm: {
    name: '',
    version: '',
    vendor: '',
    max: 0,
    total: 0,
    used: 0,
    free: 0,
    usage: 0,
    home: '',
    userDir: '',
    startedTime: '',
    runTime: '',
    inputArguments: ''
  },
  sys: {
    osName: '',
    osArch: '',
    osVersion: '',
    computerName: '',
    computerIp: ''
  },
  disks: []
})

onMounted(() => {
  getServerInfo()
})

const getServerInfo = () => {
  const loading = modal.loading('正在加载服务监控数据，请稍候！')
  getServerInfoApi().then((res: any) => {
    Object.assign(data, res.data)
    modal.closeLoading(loading)
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
