<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @update:current-page="handleCurrentChange"
      @update:page-size="handleSizeChange"
    />
  </div>
</template>

<script setup>
import { scrollTo } from '@/utils/scroll-to';
import { watch } from 'vue';

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50];
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  layout: {
    type: String,
    default: 'prev, pager, next, total, sizes, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits();

const currentPage = computed({
  get() {
    return props.page;
  },
  set(val) {
    emit('update:page', val);
  }
});
const pageSize = computed({
  get() {
    return props.limit;
  },
  set(val) {
    emit('update:limit', val);
  }
});

watch([currentPage, pageSize], ([newPage, newPageSize]) => {
  emit('change', { page: newPage, limit: newPageSize });
});

function handleSizeChange(val) {
  pageSize.value = val;
  // 当前页数超出最大有效页数时，重置当前页数为最大有效页数
  if (currentPage.value * val > props.total) {
    const validPage = Math.ceil(props.total / val);
    currentPage.value = validPage;
  }
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
function handleCurrentChange(val) {
  currentPage.value = val;
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: right;
}
.pagination-container.hidden {
  display: none;
}
</style>
