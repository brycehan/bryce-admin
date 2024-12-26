<template>
  <div class="header-right-search">
    <svg-icon icon="icon-search" @click="openSearch" />
    <el-dialog
      v-model="visible"
      width="280px"
      :destroy-on-close="true"
      :modal="false"
      fullscreen
      :show-close="true"
    >
      <div class="search-container">
        <el-autocomplete
          ref="menuAutoCompleteRef"
          v-model="search"
          size="large"
          prefix-icon="Search"
          :fetch-suggestions="menuSearch"
          placeholder="菜单搜索"
          @select="handleSelect"
          @blur="handleBlur"
          clearable
        >
          <template #default="{ item }">
            <svg-icon :icon="item.meta.icon" />
            {{ item.meta.title }}
          </template>
        </el-autocomplete>
      </div>

    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouterStore } from '@/stores/modules/router'
import { useRouter } from 'vue-router'

const visible = ref(false)
const menuAutoCompleteRef = ref()
const search = ref('')
const routerStore = useRouterStore()
const router = useRouter()

const openSearch = () => {
  visible.value = true
  nextTick(() => {
    setTimeout(() => {
      menuAutoCompleteRef.value.focus()
    })
  })
}

/**
 * 菜单搜索项数据类型
 *
 * @interface SearchItemRaw 菜单搜索项原始数据
 */
interface SearchItemRaw {
  path: string
  meta: {
    title: string
  }
}

// 菜单搜索后端数据
const menuList = routerStore.searchMenu

/**
 * 菜单搜索
 *
 * @param queryString 搜索关键字
 * @param callback 结果回调处理
 */
const menuSearch = (queryString: string, callback: any) => {
  const list = queryString ? menuList.filter(searchFilter(queryString)) : menuList
  callback(list)
}

/**
 * 菜单搜索过滤
 *
 * @param queryString 搜索关键字
 * @returns 搜索结果
 */
const searchFilter: any = (queryString: string) => {
  return (searchItemRaw: SearchItemRaw) =>
    searchItemRaw.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
    searchItemRaw.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1
}

/**
 * 选择菜单
 *
 * @param item 菜单对象
 */
const handleSelect = (item: SearchItemRaw) => {
  router.push(item.path)
  visible.value = false
}

/**
 * 失焦关闭搜索框
 */
const handleBlur = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.header-right-search {
  .search-container {
    width: 600px;
    height: 380px;
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--theme-header-bg-color);
    border-radius: 3px;
  }
  ::v-deep(.el-dialog) {
    box-shadow: unset;
    background: rgba(0, 0, 0, 0.5);
  }

  ::v-deep(.el-autocomplete) {
    width: 560px;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
