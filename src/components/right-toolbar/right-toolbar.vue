<template>
  <div class="right-toolbar">
    <el-row>
      <el-tooltip v-if="search" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button icon="search" circle @click="toggleSearch" />
      </el-tooltip>
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button icon="refresh" circle @click="handleRefresh" />
      </el-tooltip>
      <el-tooltip effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button v-if="showColumnType === 'transfer'" icon="menu" circle @click="showColumnDialog" />
        <el-dropdown v-else trigger="click" :hide-on-click="false" placement="bottom-end">
          <el-button icon="menu" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in columns" :key="item.key">
                <el-checkbox
                  :checked="item.visible"
                  @change="handleCheckboxChange($event, item.label)"
                  :label="item.label"
                />
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </el-row>
    <el-dialog v-model="visible" :title="title" :close-on-click-modal="false" width="600">
      <el-transfer :titles="['显示', '隐藏']" v-model="value" :data="columns" @change="handleTransferChange" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue'

const props = defineProps({
  // 是否显示搜索条件
  showSearch: {
    type: Boolean,
    default: () => true
  },
  // 是否显示搜索图标
  search: {
    type: Boolean,
    default: () => true
  },
  // 显隐列信息
  columns: {
    type: Array as PropType<any[]>,
  },
  // 显隐列类型（checkbox：复选框，transfer：穿梭框）
  showColumnType: {
    type: String,
    default: () => 'checkbox'
  }
})

const emit = defineEmits(['update:showSearch', 'refreshPage'])

// 是否显示穿梭框
const visible = ref(false)
// 穿梭框标题
const title = ref('显示/隐藏')
// 穿梭框隐藏列数据
const value = ref([] as any[])

onMounted(() => {
  if (props.showColumnType === 'transfer') {
    // 显隐列初始默认隐藏列
    for (let item in props.columns) {
      if (props.columns[item].visible === false) {
        value.value.push(parseInt(item))
      }
    }
  }
})

/**
 * 显示/隐藏搜索操作
 */
const toggleSearch = () => {
  emit('update:showSearch', !props.showSearch)
}

/**
 * 刷新按钮操作
 */
const handleRefresh = () => {
  emit('refreshPage')
}

/**
 * 穿梭框数据变更操作
 *
 * @param data 穿梭框隐藏的数据
 */
const handleTransferChange = (data: any[]) => {
  for (let item in props.columns) {
    const key = props.columns[item].key
    props.columns[item].visible = !data.includes(key)
  }
}

/**
 * 打开显隐列对话框
 */
const showColumnDialog = () => {
  visible.value = true
}

/**
 * 显隐列复选框勾选变更操作处理
 *
 * @param event 复选框选中状态
 * @param label 复选框标签
 */
const handleCheckboxChange = (event: any, label: string) => {
  props.columns.filter((item) => item.label === label)[0].visible = event
}
</script>

<style lang="scss" scoped>
.right-toolbar {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;

  .el-button {
    margin-left: 10px;
  }
}

/**
 * 显隐列样式，调小上下间间距
 */
::v-deep(.el-dropdown-menu__item) {
    padding: 0 16px;
}
</style>
