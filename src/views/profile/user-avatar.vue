<template>
  <div class="user-avatar">
    <div class="user-avatar-head" @click="editCropper()">
      <img class="user-avatar-img" :src="state.options.img" alt="头像" />
    </div>
    <el-dialog v-model="state.dialogVisible" title="修改头像" :close-on-click-modal="false">
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropperRef"
            :img="state.options.img"
            :info="true"
            :auto-crop="state.options.autoCrop"
            :auto-crop-width="state.options.autoCropWidth"
            :auto-crop-height="state.options.autoCropHeight"
            :fixed-box="state.options.fixedBox"
            :outputType="state.options.outputType"
            @realTime="realTime"
            v-if="state.cropperVisible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="state.previews.url" alt="预览" :style="state.previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :sm="3" :xs="3">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button icon="UploadFilled" size="small"> 选择 </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :sm="2" :xs="2">
          <el-button icon="ZoomIn" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button icon="ZoomOut" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button icon="RefreshLeft" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :sm="2" :xs="2">
          <el-button icon="RefreshRight" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 6 }" :sm="2" :xs="2">
          <el-button type="primary" size="small" @click="uploadImg()">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// https://github.com/xyxiao001/vue-cropper
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import request from '@/utils/request'
import constant from '@/utils/constant'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/modules/auth'
import avatarImg from '@/assets/images/user1-128x128.jpg'
import { postAvatarApi } from '@/api/system/profile'

const cropperRef = ref()
const authStore = useAuthStore()

const state = reactive({
  dialogVisible: false,
  // 是否显示cropper
  cropperVisible: true,
  // 弹出层标题
  title: '修改头像',
  options: {
    img: authStore.user.avatar || avatarImg, // 裁剪图片的地址
    autoCrop: true, // 是否默认生成截图框
    autoCropWidth: 200, // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixedBox: true, // 固定截图框大小 不允许改变
    outputType: 'png', // 默认生成截图为PNG格式
    filename: 'avatar.png' // 文件名称
  },
  previews: {} as any,
  resizeHandler: null
})

/**
 * 编辑头像
 */
const editCropper = () => {
  state.dialogVisible = true
}

/**
 * 覆盖默认的上传行为
 */
const requestUpload = () => {}

/**
 * 向左旋转
 */
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
}

/**
 * 向右旋转
 */
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

/**
 * 图片缩放
 */
const changeScale = (num: number) => {
  num = num || 1
  cropperRef.value.changeScale(num)
}

const beforeUpload = (file: File) => {
  if (file.type.indexOf('image/') === -1) {
    ElMessage.error('文件格式错误，请上传图片类型,如：jpg，png后缀的文件')
    return
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        state.options.img = reader.result
      }
      state.options.filename = file.name
    }
  }
}
/**
 * 上传图片
 */
const uploadImg = () => {
  cropperRef.value.getCropBlob((data: any) => {
    const formData = new FormData()
    formData.append('file', data, state.options.filename)
    postAvatarApi(formData).then((res) => {
      state.options.img = res.data
      // 更新状态管理
      authStore.user.avatar = res.data
      ElMessage.success({
        message: '修改成功',
        duration: 3000,
        onClose: () => {
          // 关闭对话框
          state.dialogVisible = false
        }
      })
    })
  })
}

/**
 * 实时预览
 *
 * @param realData 预览数据
 */
const realTime = (realData: any) => {
  console.log('realTime', realData)
  state.previews = realData
}

/**
 * 上传头像
 *
 * @param data 表单数据
 */
const uploadFile = (data: any) => {
  return request.postForm(constant.uploadUrl, data)
}
</script>

<style scoped lang="scss">
.user-avatar {
  .user-avatar-head {
    position: relative;
    display: inline-block;
    height: 120px;
  }
  .user-avatar-head:hover:after {
    content: '+';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #eee;
    background: rgba(0, 0, 0, 0.5);
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
    line-height: 120px;
    text-align: center;
    border-radius: 50%;
  }
  .user-avatar-img {
    border-radius: 50%;
    height: 120px;
  }
  // 预览
  .avatar-upload-preview {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;
  }
}
</style>
