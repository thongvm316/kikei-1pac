<template>
  <section>
    <modal-change-email v-model:visible="isShowModal" :is-show-modal="isShowModal" />

    <modal-upload-image
      v-model:visible="modalCrop"
      :file-content="fileContent"
      @back-modal="handleBack($event)"
      @file-img="onFileImg($event)"
    />

    <modal-saved-email
      v-model:visible="modalResetPassword"
      :modal-reset-password="modalResetPassword"
      :form="form.email"
      @back-modal="handleBack($event)"
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
          <form class="modal-profile__form" @submit="onSubmit">
            <!--Name -->
            <div class="form-group">
              <Field
                v-slot="{ field, handleChange }"
                v-model="form.user_name"
                name="name_profile"
                rules="input_required"
              >
                <div class="form-content">
                  <label class="form-label required">{{ $t('modal.name_profile') }}</label>
                  <div class="form-input">
                    <a-input
                      :value="field.value"
                      :placeholder="$t('modal.please_enter')"
                      size="large"
                      class="name_profile"
                      @change="handleChange"
                    />
                    <!-- Error message -->
                    <ErrorMessage v-slot="{ message }" as="span" name="name_profile" class="errors">
                      {{ replaceField(message, 'name_profile') }}
                    </ErrorMessage>
                  </div>
                </div>
              </Field>
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

            <div class="note-progile" @click="handleModalResetPassword">{{ $t('modal.note_profile') }}</div>

            <!-- Action Section Submit & Cancel -->
            <div class="card-footer">
              <a-button key="back" class="btn-close" @click="handleCancel">
                {{ $t('modal.handle_cancel') }}
              </a-button>
              <a-button key="submit" type="primary" html-type="submit">
                {{ $t('modal.handle_ok') }}
              </a-button>
            </div>
          </form>

          <!-- Loading -->
          <div :class="isLoading ? 'overlay-loading' : null">
            <a-spin :spinning="isLoading" class="spin-loading" />
          </div>
        </div>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { defineComponent, watch, toRefs, ref, computed } from 'vue'
import { uniqueId } from 'lodash-es'

import ModalChangeEmail from '@/components/ModalProfile/ModalChangeEmail'
import PencilIcon from '@/assets/icons/ico_pencil.svg'
import ModalUploadImage from '@/components/ModalProfile/ModalUploadImage'
import usePutProfileService from '@/components/ModalProfile/composables/usePutProfileService'
import ModalSavedEmail from '@/components/ModalProfile/ModalSavedEmail'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ModalProfile',

  components: { ModalSavedEmail, ModalUploadImage, PencilIcon, ModalChangeEmail },

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

  emits: ['update:visible', 'back-modal', 'is-submit'],

  setup(props, context) {
    const { t, locale } = useI18n()
    const store = useStore()

    const { isShow } = toRefs(props)
    const { dataProfile } = toRefs(props)

    const { handleSubmit } = useForm()

    const open = ref(false)
    const isShowModal = ref(false)
    const modalCrop = ref(false)
    const modalResetPassword = ref(false)
    const loading = ref(false)
    const fileContent = ref([])
    const image = ref()
    const imageUpload = ref()

    let form = ref({ user_name: '', email: '' })

    const isLoading = computed(() => store.state.loading.isLoading)

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

    const handleBackModal = () => {
      context.emit('back-modal', false)
    }

    const handleChangeEmail = () => {
      open.value = false
      isShowModal.value = true
      context.emit('update:visible', false)
    }

    const handleModalResetPassword = () => {
      open.value = false
      modalResetPassword.value = true
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

    const onSubmit = handleSubmit(async () => {
      const base64result = image.value.split(',')[1]
      const data = {
        fullname: form.value.user_name,
        avatar: base64result
      }

      try {
        const { putProfile } = usePutProfileService(data, loading)
        await putProfile()

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message: 'profile.profile_success'
        })

        context.emit('is-submit', true)

        handleCancel()
      } catch (e) {
        console.log(e)
      }
    })

    const replaceField = (text, field) => {
      return text.replace(field, t(`modal.error_${field}`))
    }

    return {
      open,
      form,
      isShowModal,
      image,
      fileContent,
      modalCrop,
      imageUpload,
      modalResetPassword,
      onSubmit,
      isLoading,
      handleModalResetPassword,
      handleBackModal,
      resetUploadImage,
      onFileChange,
      handleCancel,
      handleChangeEmail,
      handleBack,
      onFileImg,
      replaceField
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

.modal-profile {
  position: relative;

  .overlay-loading {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    background: rgba(255, 255, 255, 0.5);

    .ant-spin {
      .ant-spin-dot {
        font-size: 24px;
      }
    }

    .spin-loading {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
