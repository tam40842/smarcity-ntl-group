<template>
  <div>
    <template v-if="dataForm">
      <div class="form-management-cabinet">
        <b-row>
          <b-col lg="2">
            <b-form-group label="ID">
              <b-form-input
                :value="dataForm.ID ? dataForm.ID[1] : 'AUTO'"
                disabled
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="2">
            <b-form-group label="STT">
              <b-form-input
                v-model="dataForm.STT[1]"
                class="text-center"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.InputDate[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.InputDate[3]"
            >
              <datepicker
                :language="locale"
                :format="datePickerFormat"
                :bootstrap-styling="true"
                :placeholder="$t('modal.day-select')"
                v-model="dataForm.InputDate[1]"
                @input="
                  formatDateToServer(
                    dataForm.InputDate[1],
                    'InputDate',
                    'dataForm'
                  )
                "
              ></datepicker>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="5">
            <b-form-group
              :label="dataForm.Name[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.Name[3]"
            >
              <b-form-input
                v-model="dataForm.Name[1]"
                @input="resetStateInput('Name')"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="7">
            <b-form-group
              :label="dataForm.Address[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.Address[3]"
            >
              <b-form-input
                v-model="dataForm.Address[1]"
                @input="resetStateInput('Address')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="5">
            <b-form-group
              :label="dataForm.NameExtention1[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.NameExtention1[3]"
            >
              <b-form-input v-model="dataForm.NameExtention1[1]"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="7">
            <b-form-group
              :label="dataForm.AddressExtention1[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.AddressExtention1[3]"
            >
              <b-form-input
                v-model="dataForm.AddressExtention1[1]"
                @input="resetStateInput('AddressExtention1')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.LampLat[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.LampLat[3]"
            >
              <b-form-input v-model="dataForm.LampLat[1]" 
                @input="resetStateInput('LampLat')"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.LampLong[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.LampLong[3]"
            >
              <b-form-input v-model="dataForm.LampLong[1]" @input="resetStateInput('LampLong')"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.PowerTypeID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.PowerTypeID[3]"
            >
              <b-form-select
                v-model="dataForm.PowerTypeID[1]"
                :options="dataFormOptions.PowerTypeID"
                @input="resetStateInput('PowerTypeID')"
              ></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.ConnectTypeID[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.ConnectTypeID[3]"
            >
              <b-form-select
                v-model="dataForm.ConnectTypeID[1]"
                :options="dataFormOptions.ConnectTypeID"
                @input="resetStateInput('ConnectTypeID')"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.LampPhone[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.LampPhone[3]"
            >
              <b-form-input
                v-model="dataForm.LampPhone[1]"
                :disabled="
                  checkConnectTypeID('ConnectTypeID', 'dataForm') ? false : true
                "
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col lg="4">
            <b-form-group
              :label="dataForm.LampPhonePassword[0]"
              :invalid-feedback="$t('form.no-blank')"
              :state="dataForm.LampPhonePassword[3]"
            >
              <b-form-input
                v-model="dataForm.LampPhonePassword[1]"
                :disabled="
                  checkConnectTypeID('ConnectTypeID', 'dataForm') ? false : true
                "
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <b-form-group :label="dataForm.ImageLink[0] + ':'">
              <b-form-file
                :placeholder="$t('update-image') + '...'"
                v-model="listImage"
                :file-name-formatter="formatNames"
                multiple
                accept="image/*"
                :browse-text="$t('browse-text')"
              ></b-form-file>
            </b-form-group>
            <template
              v-if="
                (listImageBase64 && listImageBase64.length > 0) ||
                (dataForm.ImageLink[1] && dataForm.ImageLink[1].length > 0)
              "
            >
              <div class="box">
                <carousel
                  v-if="isShowCarousel"
                  :autoplay="true"
                  :loop="true"
                  :autoplayLoop="true"
                  :autoplayTimeout="3000"
                  :perPage="2"
                  :navigationEnabled="true"
                >
                  <template
                    v-if="listImageBase64 && listImageBase64.length > 0"
                  >
                    <template v-for="(img, i) in listImageBase64">
                      <slide :key="i + 'a'" style="" class="slide">
                        <div style="height: 149px; position: relative">
                          <b-img
                            style="width: 100%; height: 149px"
                            :src="img.Images"
                          />

                          <b-badge
                            style="
                              background: red !important;
                              position: absolute;
                              right: 0px;
                              top: -5px;
                              cursor: pointer;
                            "
                            @click.stop.prevent="removeBase64(i, 'BASE64')"
                          >
                            X
                          </b-badge>
                        </div>
                      </slide>
                    </template>
                  </template>
                  <template
                    v-if="
                      dataForm.ImageLink[1] && dataForm.ImageLink[1].length > 0
                    "
                  >
                    <template v-for="(img, i) in dataForm.ImageLink[1]">
                      <slide :key="i + 'b'" class="slide">
                        <div style="height: 149px; position: relative">
                          <b-img
                            style="width: 100%; height: 149px"
                            :src="img.ImageLink"
                          />

                          <b-badge
                            style="
                              background: red !important;
                              position: absolute;
                              right: 0px;
                              top: -5px;
                              cursor: pointer;
                            "
                            @click.stop.prevent="
                              removeBase64(i, 'DATAFORM', 'ImageLink')
                            "
                          >
                            X
                          </b-badge>
                        </div>
                      </slide>
                    </template>
                  </template>
                </carousel>
              </div>
            </template>
            <template v-else>
              <div style="height: 149px">
                <b-img
                  style="width: 100%; height: 149px; background: #c1c1c1"
                  :src="'https://dainam.edu.vn/img/system/no-image.png'"
                />
              </div>
            </template>
          </b-col>
          <b-col lg="6">
            <b-form-group :label="dataForm.LinkAvatar[0] + ':'">
              <b-form-file v-model="avatar"></b-form-file>
              <b-row class="mt-4">
                <b-colxx md="12">
                  <b-form-group>
                    <template v-if="avatarBase64">
                      <b-img
                        :src="avatarBase64"
                        fluid
                        alt="avatar-image"
                        style="height: 150px"
                      ></b-img>
                    </template>
                    <template v-else>
                      <template v-if="dataForm.LinkAvatar[1]">
                        <b-img
                          :src="dataForm.LinkAvatar[1]"
                          fluid
                          alt="avatar-image"
                          style="height: 150px"
                        ></b-img>
                      </template>
                    </template>
                  </b-form-group>
                </b-colxx>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </template>
    <template v-else>
      {{ $t("cards.no-data") }}
    </template>
  </div>
</template>

<script>
import { en, vi } from "vuejs-datepicker/dist/locale";

export default {
  props: ["dataForm", "listImageBase64", "dataFormOptions"],
  data() {
    return {
      locale: this.$t("language") == "vn" ? vi : en,
      datePickerFormat: "dd/MM/yyyy",

      listImage: null,
      // listImageBase64: [],
      isShowCarousel: true,
      avatarBase64: null,
      avatar: null,
    };
  },
  watch: {
    listImage(to, from) {
      if (to && to.length > 0) {
        // this.dataForm['ImageLink'][1] = []
        // this.listImageBase64.length = 0
        for (let i = 0; i < to.length; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(to[i]);
          setTimeout(() => {
            this.listImageBase64.push({
              ID: to[i].lastModified + i,
              Images: reader.result,
            });
          }, 500);
        }
      }
    },
    avatar(to, from) {
      if (to) {
        this.avatarBase64 = null;
        let reader = new FileReader();
        reader.readAsDataURL(to);
        setTimeout(() => {
          this.avatarBase64 = reader.result;
          this.$emit("changeAvatarBase64", this.avatarBase64);
        }, 500);
      }
    },
    file(newVal) {
      this.getBase64String(newVal);
    },
  },
  mounted() {
    this.isShowCarousel = false;
    setTimeout(() => {
      this.isShowCarousel = true;
    }, 300);
  },
  methods: {
    formatDateToServer(value, field, form) {
      this[form][field][1] = moment(value).format("YYYY-MM-DD");
    },
    resetStateInput(field) {
      //reset lại state khi có input để nó mất cái dòng cảnh báo đi
      if (this.dataForm[field][3] === false) {
        this.dataForm[field][3] = true;
      }
    },
    removeBase64(index, key, property) {
      this.isShowCarousel = false;
      setTimeout(() => {
        if (key === "BASE64") {
          let remove = this.listImageBase64.splice(index, 1);
        }
        if (key === "DATAFORM" && property) {
          let remove = this.dataForm[property][1].splice(index, 1);
        }
        this.isShowCarousel = true;
      }, 100);
    },
    formatNames(files) {
      return files.length === 1
        ? files[0].name
        : `${files.length} ${this.$t("form.image")}`;
    },
    checkConnectTypeID(field, form) {
      const value = this[form][field][1];
      const obj = this.dataFormOptions[field].find(
        (item) => item.value == value
      );
      if (obj) {
        if (
          obj.text.toUpperCase().includes("2G") ||
          obj.text.toUpperCase().includes("3G") ||
          obj.text.toUpperCase().includes("4G") ||
          obj.text.toUpperCase().includes("5G")
        ) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
.form-management-cabinet {
  .VueCarousel-pagination {
    display: none;
  }
  .b-form-file {
    height: 36px;
    .custom-file-label {
      height: 36px;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0;
      overflow: hidden;
      &::after {
        padding: 0.5rem 0.75rem;
        height: 36px;
      }
      // overflow: hidden;
    }
  }
  .vdp-datepicker {
    .form-control {
      text-align: right;
    }
    .form-control[readonly] {
      background: none;
    }
    .form-control:disabled {
      background: #e9ecef;
    }
  }
}
</style>
