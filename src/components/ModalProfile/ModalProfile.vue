<template>
  <section>
    <modal-change-email v-model:visible="isShowModal" :is-show-modal="isShowModal" />

    <modal-upload-image
      v-model:visible="modalCrop"
      :file-content="fileContent"
      @back-modal="handleBack($event)"
      @file-img="onFileImg($event)"
    />

    <a-modal v-model:visible="open" :title="$t('modal.title_profile')" @cancel="handleCancel">
      <template #footer>
        <div class="modal-profile">
          <!--upload img-->
          <div class="modal-profile__img">
            <div class="container">
              <div class="avatar-upload">
                <div class="avatar-edit">
                  <input
                    id="imageUpload"
                    ref="imageUpload"
                    type="file"
                    accept="image/*"
                    hidden
                    @change="onFileChange($event)"
                    @click="resetUploadImage"
                  />
                  <a-tooltip color="#fff" :title="$t('modal.tooltip_img')" class="pencil-icon">
                    <label for="imageUpload"></label>
                  </a-tooltip>
                </div>
                <div class="avatar-preview">
                  <template v-if="image">
                    <div id="imagePreview-avatar" :style="{ backgroundImage: `url(${image})` }"></div>
                  </template>
                  <template v-else>
                    <div id="imagePreview"></div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!--Form-->
          <form class="modal-profile__form">
            <!--Name -->
            <div class="form-group">
              <div class="form-content">
                <label class="form-label required">{{ $t('modal.name_profile') }}</label>

                <div>
                  <a-input
                    v-model:value="form.user_name"
                    :placeholder="$t('modal.please_enter')"
                    size="large"
                    class="name_profile"
                  />
                </div>
              </div>
            </div>

            <!--Email -->
            <div class="form-group">
              <div class="form-content">
                <label class="form-label required">{{ $t('modal.email_profile') }}</label>

                <div class="form-content__email">
                  <p class="email-profile">{{ form.email }}</p>
                  <a-tooltip
                    color="#fff"
                    :title="$t('modal.tooltip_email')"
                    class="pencil-icon"
                    @click.prevent="handleChangeEmail"
                  >
                    <pencil-icon />
                  </a-tooltip>
                </div>
              </div>
            </div>

            <p class="note-progile">{{ $t('modal.note_profile') }}</p>

            <!-- Action Section Submit & Cancel -->
            <div class="card-footer">
              <a-button key="back" class="btn-close" @click="handleCancel">
                {{ $t('modal.handle_cancle') }}
              </a-button>
              <a-button key="submit" type="primary" html-type="submit" @click.prevent="handeleSubmit">
                {{ $t('modal.handle_ok') }}
              </a-button>
            </div>
          </form>
        </div>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, watch, toRefs, ref } from 'vue'

import { uniqueId } from 'lodash-es'
import ModalChangeEmail from '@/components/ModalProfile/ModalChangeEmail'

import PencilIcon from '@/assets/icons/ico_pencil.svg'
import ModalUploadImage from '@/components/ModalProfile/ModalUploadImage'
import usePutProfileService from '@/components/ModalProfile/composables/usePutProfileService'

export default defineComponent({
  name: 'ModalProfile',

  components: { ModalUploadImage, PencilIcon, ModalChangeEmail },

  props: {
    isShow: {
      type: Boolean,
      default: false,
      require: true
    },
    dataProfile: {
      type: Object,
      required: true
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { isShow } = toRefs(props)
    const { dataProfile } = toRefs(props)

    const open = ref(false)
    const isShowModal = ref(false)
    const modalCrop = ref(false)
    const fileContent = ref([])
    const image = ref()
    const imageUpload = ref()

    let form = ref({ user_name: '', email: '' })

    watch(isShow, (value) => {
      open.value = value
    })

    watch(dataProfile, (val) => {
      let data = val.data
      form.value.user_name = data.fullname
      image.value = data.avatar
      form.value.email = data.email
    })

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    const handleBack = (e) => {
      open.value = e
    }

    const handleChangeEmail = () => {
      open.value = false
      isShowModal.value = true
      context.emit('update:visible', false)
    }

    const resetUploadImage = () => {
      imageUpload.value.value = []
    }

    const onFileChange = async (e) => {
      open.value = false
      context.emit('update:visible', false)

      const files = e.target.files || e.dataTransfer.files
      const fileUploads = []

      if (!files.length) return

      modalCrop.value = true

      for (let file of files) {
        file = Object.assign(file, {
          uid: uniqueId('imageUpload_'),
          src: await toBase64(file)
        })
        fileUploads.push(file)
      }

      fileContent.value = [...fileUploads]
    }

    const onFileImg = (file) => {
      image.value = file.src
    }

    const toBase64 = (file) => {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }

    const handeleSubmit = async () => {
      console.log('submit')
      module.exports = typeof self == 'object' ? self.formData : window.formData
      const formData = new FormData()
      formData.append('full_name', form.value.user_name)

      try {
        const { putProfile } = usePutProfileService(formData)
        await putProfile()
      } catch (e) {
        console.log(e)
      }
    }

    return {
      open,
      form,
      isShowModal,
      image,
      fileContent,
      modalCrop,
      imageUpload,
      resetUploadImage,
      onFileChange,
      handleCancel,
      handleChangeEmail,
      handeleSubmit,
      handleBack,
      onFileImg
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  max-width: 960px;
  padding: 0;
}

.avatar-upload {
  position: relative;
  max-width: 205px;

  .avatar-edit {
    position: absolute;
    right: 0;
    z-index: 1;
    top: 85px;
    height: 34px;

    input {
      display: none;

      + label {
        display: inline-block;
        width: 34px;
        height: 34px;
        margin-bottom: 0;
        border-radius: 100%;
        background: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
        cursor: pointer;
        font-weight: normal;
        transition: all 0.2s ease-in-out;
        background-image: url('../../assets/icons/ico_addimg.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        transform: scaleX(-1);
        border: 1px solid #064780;

        &:hover {
          background: #31aaf1;
          border: 1px solid #31aaf1;
          background-image: url('../../assets/icons/ico_addimg.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          transform: scaleX(-1);
        }
      }
    }
  }

  .avatar-preview {
    width: 120px;
    height: 120px;
    position: relative;
    border-radius: 100%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    background-color: #bfbfbf;
    margin: auto;

    #imagePreview {
      width: 50%;
      height: 50%;
      border-radius: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url('../../assets/icons/ico_user.png');
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    #imagePreview-avatar {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url('../../assets/icons/ico_user.png');
    }
  }
}
</style>
