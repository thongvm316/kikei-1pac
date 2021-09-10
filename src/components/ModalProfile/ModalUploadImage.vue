<template>
  <a-modal
    v-model:visible="open"
    :title="
      !ctx.flag
        ? $t('modal.title_crop')
        : ctx.flag && ctx.errorMessage
        ? $t('modal.title_fail')
        : $t('modal.title_upload')
    "
    @cancel="handleCancel"
  >
    <template #footer>
      <div class="card-common">
        <div v-show="!ctx.flag">
          <div ref="croppie" class="croppie" />

          <div class="slider-range">
            <button
              id="btn-slider-l"
              class="controller-block__toogle-icon ant-btn ant-btn-default ant-btn-icon-only"
              @mousedown="mouseDownZoomOut"
              @mouseup="mouseUpZoom"
            >
              <span>-</span>
            </button>
            <Slider
              v-model="slider"
              :tooltips="false"
              :step="figure.step"
              :min="figure.min"
              :max="figure.max"
              @update="onUpdateSlider"
            ></Slider>
            <button
              id="btn-slider-r"
              class="controller-block__toogle-icon ant-btn ant-btn-default ant-btn-icon-only"
              @mousedown="mouseDownZoomIn"
              @mouseup="mouseUpZoom"
            >
              <span>+</span>
            </button>
          </div>

          <span class="note">{{ $t('profile.note') }}</span>

          <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.back') }}</a-button>
          <a-button key="submit" type="primary" html-type="submit" @click="uploadImg">{{ $t('modal.save') }}</a-button>
        </div>
        <div v-if="ctx.flag" class="content-loading">
          <template v-if="ctx.errorMessage">
            <warning-icon />
            <!-- Error -->
            <h2>{{ ctx.errorMessage }}</h2>
            <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.back') }}</a-button>
            <a-button type="primary" @click="handleUploadNew">{{ $t('modal.upload_new') }}</a-button>
          </template>
          <template v-else>
            <h3>{{ $t('profile.uploading') }}</h3>
            <div class="loader" />
          </template>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, nextTick, ref, toRefs, watch } from 'vue'
import { forEach, includes } from 'lodash-es'
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

const STEP = 0.1
const TIMEOUT = 1000
const VIEW_PORT_SIZE = 180
const BOUNDARY = {
  width: 457,
  height: 235
}

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
    const flagZoom = ref(false)
    const figure = ref({ min: 0.3, max: 1.5, step: 0.0001 })

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

          init.value.bind({ url: ctx.value.tmpFile.src }).then(() => {
            const crSlider = document.getElementsByClassName('cr-slider')[0]

            forEach(figure.value, (item, key) => {
              figure.value[`${key}`] = +crSlider.getAttribute(`${key}`)
              if (includes(['min', 'max'], key)) {
                figure.value[`${key}`] = +figure.value[`${key}`].toFixed(1)
              }
            })

            // set default zoom
            init.value.setZoom(figure.value.min)
            slider.value = figure.value.min
          })
        }, TIMEOUT)
      }
    })

    const initCroppieApp = () => {
      return new Croppie(croppie.value, {
        viewport: { width: VIEW_PORT_SIZE, height: VIEW_PORT_SIZE, type: 'circle' },
        boundary: { width: BOUNDARY.width, height: BOUNDARY.height },
        showZoomer: false,
        enableOrientation: true,
        mouseWheelZoom: false
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

    const onUpdateSlider = (value) => {
      if (!flagZoom.value) {
        // press move
        let delta = 0
        if (value > slider.value) {
          // increase
          delta = value + figure.value.step
        } else {
          // decrease
          delta = value - figure.value.step
        }
        init.value.setZoom(delta)
      }
    }

    const mouseDownZoomIn = () => {
      const delta = Number(init.value._currentZoom.toFixed(1))

      if (delta <= figure.value.max) {
        const numIncrease = delta + STEP
        init.value.setZoom(numIncrease)
        slider.value = numIncrease
      }

      flagZoom.value = true
    }

    const mouseDownZoomOut = () => {
      const delta = Number(init.value._currentZoom.toFixed(1))

      if (delta >= figure.value.min) {
        const numDecrease = delta - STEP
        init.value.setZoom(numDecrease)
        slider.value = numDecrease
      }

      flagZoom.value = true
    }

    const mouseUpZoom = () => {
      if (flagZoom.value) {
        flagZoom.value = false
      }
    }

    const handleCancel = () => {
      ctx.value = { ...tmpContext }
      context.emit('update:visible', false)
    }

    const handleUploadNew = () => {
      context.emit('back-modal', true)
      context.emit('update:visible', false)
      ctx.value = { ...tmpContext, flag: true }
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
      figure,
      onUpdateSlider,
      uploadImg,
      mouseDownZoomIn,
      mouseDownZoomOut,
      mouseUpZoom,
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
    margin: 14px auto;
    text-indent: -9999em;
    width: 40px;
    height: 40px;
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

  .note {
    display: block;
    font-size: 12px;
    margin-bottom: 21px;
  }

  .content-loading {
    margin: 46px 0 0;

    h2 {
      margin-top: 7px;
    }

    h3,
    h2 {
      font-size: 16px;
    }
  }
}
</style>
