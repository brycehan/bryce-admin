<template>
  <div class="header-right-search" @click="openSearch">
    <icon icon="ion:search" />
    <el-dialog v-model="visible" width="280px" :destroy-on-close="true" :modal="false" fullscreen :show-close="true">
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
            <div class="flex items-center gap-0.5">
              <icon :icon="item.meta.icon" />
              <span> {{ item.meta.title }} </span>
            </div>
          </template>
        </el-autocomplete>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouterStore } from '@/stores/modules/router'

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
const menuList = routerStore.flatRoutes

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
const handleSelect = (item: Record<string, any>) => {
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: var(--theme-header-height);
  font-size: 16px;
  line-height: var(--theme-header-height);
  color: var(--theme-header-text-color);
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 10%);
  }

  .search-container {
    position: absolute;
    top: 100px;
    left: 50%;
    width: 600px;
    height: 380px;
    background-color: var(--theme-header-bg-color);
    border-radius: 3px;
    transform: translateX(-50%);
  }

  ::v-deep(.el-dialog) {
    background: rgb(0 0 0 / 50%);
    box-shadow: unset;
  }

  ::v-deep(.el-autocomplete) {
    position: absolute;
    top: 20px;
    left: 50%;
    width: 560px;
    transform: translateX(-50%);
  }
}
</style>
