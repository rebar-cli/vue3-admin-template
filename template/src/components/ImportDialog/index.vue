<template>
  <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
    <el-upload
      ref="uploadRef"
      v-model:file-list="upload.filelist"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      :auto-upload="false"
      drag
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import APP_CONFIG from '@/app-config';
import { getToken } from '@/utils/auth';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
  title: {
    type: String,
    default: '导入'
  },
  path: {
    type: String,
    required: true
  }
});
const emits = defineEmits(['importSuccess', 'importError']);

const uploadRef = ref();
const upload = reactive({
  filelist: [],
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: props.title,
  // 是否禁用上传
  isUploading: false,
  // 设置上传的请求头部
  headers: { Authorization: 'Bearer ' + getToken() },
  // 上传的地址
  url: APP_CONFIG.API_PATH + props.path
});

function show() {
  upload.open = true;
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value.handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;'>" + response.resp_msg + '</div>',
    '导入结果',
    { dangerouslyUseHTMLString: true }
  );
  emits('importSuccess', response);
};

// 文件上传失败处理
function handleFileError(response, file, filelist) {
  upload.isUploading = false;
  uploadRef.value.handleRemove(file);
  const resp = JSON.parse(response.message);
  proxy.$alert(
    `<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;white-space: pre-wrap;'>${resp.resp_msg}</div>`,
    '导入结果',
    { type: 'error', dangerouslyUseHTMLString: true }
  );
  emits('importError', response);
}

/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value.submit();
}

defineExpose({
  show
});
</script>

<style lang="scss" scoped></style>
