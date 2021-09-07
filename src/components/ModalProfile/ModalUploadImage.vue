<template>
  <a-modal v-model:visible="open" :title="$t('modal.title_upload')" @cancel="handleCancel">
    <template #footer>
      <div class="card-common">
        <div v-show="!ctx.flag">
          <div ref="croppie" class="croppie" />
          <div>
            <button @click="zoomOut">zoom out</button>
            <Slider v-model="slider" :tooltips="false" @change="onSlider"></Slider>
            <button @click="zoomIn">zoom in</button>
          </div>
          <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
          <a-button key="submit" type="primary" html-type="submit" @click="uploadImg">{{
            $t('modal.submit')
          }}</a-button>
        </div>
        <div v-show="ctx.flag">
          <template v-if="ctx.errorMessage">
            <warning-icon />
            <!-- Error -->
            <h2>{{ ctx.errorMessage }}</h2>
            <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
            <a-button type="primary" @click="handleUploadNew">{{ $t('modal.upload_new') }}</a-button>
          </template>
          <template v-else>
            <h3>Uploading...</h3>
            <div class="loader">Loading...</div>
          </template>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, nextTick, ref, toRefs, watch } from 'vue'
import { includes } from 'lodash-es'
import { useI18n } from 'vue-i18n'

import Croppie from 'croppie'
import 'croppie/croppie.css'

import Slider from '@vueform/slider'

import WarningIcon from '@/assets/icons/ico_warning.svg'

const tmpContext = {
  flag: false,
  errorMessage: '',
  tmpFile: null
}

const TIMEOUT = 1000

export default defineComponent({
  name: 'ModalUploadImage',

  components: { WarningIcon, Slider },

  props: {
    fileContent: {
      type: Array,
      required: true
    }
  },

  emits: ['update:visible', 'back-modal', 'file-img'],

  setup(props, context) {
    const { fileContent } = toRefs(props)
    const open = ref(false)
    const { t } = useI18n()

    const croppie = ref()
    const init = ref()
    const ctx = ref({ ...tmpContext })
    const slider = ref(0)

    const profileEnums = ref({
      size: t('modal.errorMessage.size'),
      img: t('modal.errorMessage.img'),
      imgsize: t('modal.errorMessage.imgsize')
    })

    watch(fileContent, async (file) => {
      open.value = true
      ctx.value.tmpFile = file[0]

      await nextTick()

      if (!init.value) init.value = await initCroppieApp()

      ctx.value.flag = true

      const vImage = validateImage(ctx.value.tmpFile)
      const vSize = validateSize(ctx.value.tmpFile)

      if (!vImage && !vSize) {
        return setTimeout(() => {
          ctx.value.errorMessage = profileEnums.value.imgsize
        }, TIMEOUT)
      }

      if (!vImage) {
        setTimeout(() => {
          ctx.value.errorMessage = profileEnums.value.img
        }, TIMEOUT)
      }

      if (!vSize) {
        setTimeout(() => {
          ctx.value.errorMessage = profileEnums.value.size
        }, TIMEOUT)
      }

      if (vImage && vSize) {
        setTimeout(() => {
          ctx.value.errorMessage = ''
          ctx.value.flag = false
          init.value.bind({ url: ctx.value.tmpFile.src })
          setTimeout(() => {
            slider.value = init.value._currentZoom * 100
          }, TIMEOUT / 2)
        }, TIMEOUT)
      }
    })

    const initCroppieApp = () => {
      return new Croppie(croppie.value, {
        viewport: { width: 180, height: 180, type: 'circle' },
        boundary: { width: 457, height: 235 },
        showZoomer: false,
        enableOrientation: false
      })
    }

    const uploadImg = async () => {
      const blob = await init.value.result('blob')
      const base64 = await init.value.result('base64')
      let file = new File([blob], `profile_avatar_${new Date().getTime()}`, {
        lastModified: new Date().getTime(),
        type: blob.type
      })
      file = Object.assign(file, { src: base64 })

      ctx.value = { ...tmpContext }
      context.emit('update:visible', false)
      context.emit('back-modal', true)
      context.emit('file-img', file)
    }

    const onSlider = (value) => {
      console.log(value)
      // init.value.setZoom(value + 0.05)
    }

    const zoomIn = (evt) => {
      evt.preventDefault()
      const delta = init.value._currentZoom
      init.value.setZoom(delta + 0.01)
      slider.value = (delta + 0.1) * 100
    }

    const zoomOut = (evt) => {
      evt.preventDefault()
      const delta = init.value._currentZoom
      init.value.setZoom(delta - 0.1)
      slider.value = (delta - 0.1) * 100
    }

    const handleCancel = () => {
      ctx.value = { ...tmpContext }
      context.emit('update:visible', false)
    }

    const handleUploadNew = () => {
      ctx.value = { ...tmpContext }
      context.emit('update:visible', false)
      context.emit('back-modal', true)
    }

    const validateImage = (file) => {
      const type = file.type.split('/').pop().toLowerCase()
      return includes(['jpeg', 'jpg', 'png'], type)
    }

    const validateSize = (file) => {
      const fsize = (file.size / 1024 / 1024).toFixed(2)
      return fsize <= 1
    }

    return {
      croppie,
      open,
      ctx,
      slider,
      onSlider,
      uploadImg,
      zoomIn,
      zoomOut,
      handleCancel,
      handleUploadNew
    }
  }
})
</script>

<style src="@vueform/slider/themes/default.css"></style>
<style scoped lang="scss">
.card-common {
  overflow: hidden;

  .croppie {
    width: auto;
    height: auto;
    position: relative;

    .btn-zoom-in {
      position: absolute;
      bottom: 5px;
      right: 140px;
      padding: 7px;
      line-height: 0;
      width: 24px;
      height: 24px;

      &:hover {
        background: #31aaf1;
        color: white;
      }
    }

    .btn-zoom-out {
      position: absolute;
      bottom: 5px;
      left: 130px;
      padding: 7px;
      line-height: 0;
      width: 24px;
      height: 24px;

      &:hover {
        background: #31aaf1;
        color: white;
      }
    }
  }

  h2 {
    margin-bottom: 72px;
  }

  .loader {
    font-size: 10px;
    margin: 50px auto;
    text-indent: -9999em;
    width: 6em;
    height: 6em;
    border-radius: 50%;
    background: #ffffff;
    background: -moz-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: -webkit-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: -ms-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: linear-gradient(to right, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    position: relative;
    -webkit-animation: load3 1.4s infinite linear;
    animation: load3 1.4s infinite linear;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }

  .loader:before {
    width: 50%;
    height: 50%;
    background: #064780;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  .loader:after {
    background: white;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .loader-story {
    font-size: 10px;
    margin: 50px auto;
    text-indent: -9999em;
    width: 11em;
    height: 11em;
    border-radius: 50%;
    background: #ffffff;
    background: -moz-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: -webkit-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: -ms-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    background: linear-gradient(to right, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
    position: relative;
    -webkit-animation: load3 1.4s infinite linear;
    animation: load3 1.4s infinite linear;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }

  .loader-story:before {
    width: 50%;
    height: 50%;
    background: #3499db;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }

  .loader-story:after {
    background: white;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  .advertise-photo {
    margin-bottom: 100px;
  }

  @media only screen and (max-width: 1368px) {
    .advertise-photo {
      margin-bottom: 80px;
    }
  }

  @media only screen and (max-width: 1024px) {
    .advertise-photo {
      margin-bottom: 60px;
    }
  }

  @media only screen and (max-width: 576px) {
    .advertise-photo {
      margin-bottom: 40px;
    }
  }

  .advertise-photo img {
    width: 100%;
  }
}
</style>
