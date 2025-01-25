<template>
  <el-upload
    v-bind="uploadItem.uploadAttrs"
    v-model:file-list="fileList"
    :on-success="(response, file, fileList) => onSuccess(response, file, fileList, uploadItem)"
    :http-request="uploadItem.httpRequest || httpRequest"
    :action="uploadUrl"
    :disabled="disabled"
    :beforeUpload="(rawFile) => beforeUpload(rawFile, uploadItem)"
  >
    <div class="upload-empty">
      <slot name="empty">
        <Icon icon="ep:plus" />
        <!-- <span>请上传图片</span> -->
      </slot>
    </div>
    <template #file="{ file }">
      <img :src="file.url" class="upload-image" />
      <div class="upload-handle" @click.stop>
        <div class="handle-icon" @click="handlePictureCardPreview(file)">
          <Icon icon="ep:zoom-in" />
          <span>查看</span>
        </div>
        <div v-if="!disabled" class="handle-icon" @click="handleRemove(file)">
          <Icon icon="ep:delete" />
          <span>删除</span>
        </div>
      </div>
    </template>
    <slot name="uploadArea"> </slot>
    <slot name="uploadTip"></slot>
  </el-upload>
</template>
<script setup lang="ts">
import {
  UploadFile,
  UploadFiles,
  UploadUserFile,
  ElNotification,
  UploadRawFile
} from 'element-plus'
import { useUpload } from '@/components/UploadFile/src/useUpload'

const { uploadUrl, httpRequest } = useUpload()
const message = useMessage() // 消息弹窗

type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

const props = defineProps({
  // 表单的配置项
  uploadItem: {
    type: Object,
    default: () => ({})
  },
  fileSize: {
    type: Number,
    default: 5
  },
  fileType: {
    type: Array as PropType<FileTypes[]>,
    default: () => ['image/jpeg', 'image/png']
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
watch(
  () => props.uploadItem,
  () => {},
  { deep: true }
)

const fileList = ref<UploadUserFile[]>([])
const uploadList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)

const emits = defineEmits(['on-success', 'before-upload'])

// 图片预览
const viewImageUrl = ref('')
const imgViewVisible = ref(false)
const handlePictureCardPreview = (uploadFile) => {
  viewImageUrl.value = uploadFile.url!
  imgViewVisible.value = true
}

// 删除图片
const handleRemove = (uploadFile: UploadFile) => {
  fileList.value = fileList.value.filter(
    (item) => item.url !== uploadFile.url || item.name !== uploadFile.name
  )
  //删除图片
  // emit(
  //   'update:modelValue',
  //   fileList.value.map((file) => file.url!)
  // )
}

const beforeUpload = (rawFile: UploadRawFile, clickItem: any) => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize
  const imgType = props.fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    ElNotification({
      title: '温馨提示',
      message: '上传图片不符合所需的格式！',
      type: 'warning'
    })
  if (!imgSize)
    ElNotification({
      title: '温馨提示',
      message: `上传图片大小不能超过 ${props.fileSize}M！`,
      type: 'warning'
    })
  uploadNumber.value++
  emits('before-upload', rawFile, clickItem)
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}
const onSuccess = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles,
  clickItem: any
) => {
  message.success('上传成功')
  // 删除自身
  // @ts-ignore
  const index = fileList.value.findIndex((item) => item.response?.data === response.data)
  fileList.value.splice(index, 1)
  uploadList.value.push({ name: response.data, url: response.data })
  if (uploadList.value.length == uploadNumber.value) {
    fileList.value.push(...uploadList.value)
    uploadList.value = []
    uploadNumber.value = 0
  }
  emits('on-success', { response, uploadFile, uploadFiles, clickItem })
}
onMounted(() => {})
onUnmounted(() => {})
defineExpose({})
</script>
<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: '8px';

      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: '150px';
      height: '150px';
      background-color: transparent;
      border-radius: '8px';
    }

    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      transition: var(--el-transition-duration-fast);
      align-items: center;
      justify-content: center;

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
    }

    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }

  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
}
</style>
