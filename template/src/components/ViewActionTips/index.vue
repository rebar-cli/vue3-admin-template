<template>
  <el-tooltip effect="dark" placement="top">
    <template #content>
      平移视图：滚轮（纵向平移），Shift + 滚轮（横向平移），鼠标中键 / 空格键 + 拖拽 (自由移动)
      <br />
      缩放视图：Ctrl / Command + 滚轮
    </template>
    <el-icon class="tips"><QuestionFilled /></el-icon>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.tips {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
