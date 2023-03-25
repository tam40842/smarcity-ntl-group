<template>
  <div
    class="login-npl h-100 w-100 d-flex justify-content-center align-items-center"
  >
    <b-card class="p-5" no-body style="opacity: 0.85">
      <div style="width: 100%">
        <router-link tag="a" to="/">
          <div class="text-center">
            <span class="logo-single" style="margin-bottom: 10px" />
          </div>
        </router-link>
        <h6 class="mb-4">
          <strong>{{ $t("user.login-title").toUpperCase() }}</strong>
        </h6>

        <b-form
          class="av-tooltip tooltip-label-bottom"
          @submit.prevent="formSubmit"
        >
          <b-form-group
            :label="$t('user.username')"
            class="has-float-label mb-4"
          >
            <b-form-input
              v-model="$v.form.username.$model"
              type="text"
              :state="!$v.form.username.$error"
            />
            <b-form-invalid-feedback v-if="!$v.form.username.required">
              {{ $t("user.username-required") }}
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.username.username">
              {{ $t("user.username-min-length") }}
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.username.minLength">
              {{ $t("user.username-min-length") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            :label="$t('user.password')"
            class="has-float-label mb-4"
          >
            <b-form-input
              v-model="$v.form.password.$model"
              type="password"
              name="password"
              autocomplete="on"
              :state="!$v.form.password.$error"
            />
            <b-form-invalid-feedback v-if="!$v.form.password.required">
              {{ $t("user.pass-required") }}
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-else-if="
                !$v.form.password.minLength || !$v.form.password.maxLength
              "
            >
              {{ $t("user.pass-min-max") }}
            </b-form-invalid-feedback>
          </b-form-group>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong> CHỌN NGÔN NGỮ </strong>
              <div class="d-inline-block">
                <b-dropdown
                  id="langddm"
                  class="ml-1 mr-5"
                  variant="light"
                  size="sm"
                  toggle-class="language-button"
                >
                  <template slot="button-content">
                    <b-img
                      v-for="(k, index) in localeOptions"
                      v-if="k.id === $i18n.locale"
                      :key="index"
                      alt="img_language"
                      fluid
                      :src="k.icon"
                      width="30"
                    />
                    <span class="name">{{ $i18n.locale.toUpperCase() }}</span>
                  </template>
                  <b-dropdown-item
                    v-for="(l, index) in localeOptions"
                    :key="index"
                    @click="changeLocale(l.id, l.direction)"
                  >
                    <b-img fluid :src="l.icon" width="30" />
                    {{ l.name }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
            <b-button
              type="submit"
              variant="primary"
              size="lg"
              :disabled="processing"
              :class="{
                'btn-multiple-state btn-shadow': true,
                'show-spinner': processing,
                'show-success': !processing && loginError === false,
                'show-fail': !processing && loginError,
              }"
            >
              <span class="spinner d-inline-block">
                <span class="bounce1" />
                <span class="bounce2" />
                <span class="bounce3" />
              </span>
              <span class="icon success">
                <i class="simple-icon-check" />
              </span>
              <span class="icon fail">
                <i class="simple-icon-exclamation" />
              </span>
              <span class="label">{{ $t("user.login-button") }}</span>
            </b-button>
          </div>
        </b-form>
      </div>
    </b-card>
    <b-modal
      :id="`modal-company`"
      title="CHỌN CÔNG TY"
      ok-title="Đồng ý"
      cancel-title="Hủy bỏ"
      size="md"
      centered
      @ok="submitLoginFinal"
    >
      <div>
        <b-table
          id="table-company-login"
          bordered
          responsive
          selectable
          :select-mode="'single'"
          head-variant="light"
          :fields="fields"
          :items="listCompany"
          @row-clicked="handleClick"
        />
      </div>
      <template #modal-footer="{ ok }">
        <div class="w-100 text-right">
          <b-button variant="primary" @click="ok()">
            <span style="font-weight: 550"> Xác nhận</span>
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { adminRoot, localeOptions } from "../../constants/config";
import { getDirection, setDirection } from "../../utils";
import userAPI from "@/api/modules/userAPI";

const {
  required,
  maxLength,
  minLength,
  username,
} = require("vuelidate/lib/validators");

export default {
  mixins: [validationMixin],
  data() {
    return {
      localeOptions,
      form: {
        username: "",
        password: "",
      },
      fields: [
        {
          key: "CompanyName",
          label: "Tên công ty",
        },
        {
          key: "CompanyAddress",
          label: "Địa chỉ",
        },
      ],
      listCompany: [],
      bodyFinal: null,
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(3),
      },
    },
  },
  computed: {
    ...mapGetters(["currentUser", "processing", "loginError"]),
  },
  methods: {
    ...mapActions(["login", "setLang"]),
    handleClick(row) {
      this.bodyFinal = {
        CmpnID: row.CmpnID,
        UserName: this.form.username,
        UserPassword: this.form.password,
      };
    },
    submitLoginFinal() {
      this.login(this.bodyFinal);
    },
    formSubmit() {
      this.$v.$touch();
      this.$v.form.$touch();
      if (!this.$v.form.$anyError) {
        userAPI
          .loginNPL({
            UserName: this.form.username,
            UserPassword: this.form.password,
          })
          .then((res) => {
            if (res.status) {
              if (res.data?.length > 1) {
                this.listCompany = res.data;
                this.$bvModal.show("modal-company");
              } else {
                this.login({
                  UserName: this.form.username,
                  UserPassword: this.form.password,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    changeLocale(locale, direction) {
      const currentDirection = getDirection().direction;
      if (direction !== currentDirection) {
        setDirection(direction);
      }
      this.setLang(locale);
    },
  },
  watch: {
    currentUser(val) {
      if (val) {
        setTimeout(() => {
          this.$router.push(adminRoot);
        }, 200);
      }
    },
    loginError(val) {
      if (val != null) {
        this.$notify("error", "Login Error", val, {
          duration: 3000,
          permanent: false,
        });
      }
    },
  },
  created() {
    if (this.currentUser) {
      setTimeout(() => {
        this.$router.push(adminRoot);
      }, 200);
    }
  },
};
</script>
<style>
.fixed-background {
  background: url("/assets/img/npl/bg3.jpg") no-repeat center center fixed;
  background-color: #34495e;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
<style scoped>
.title {
  text-align: center;
  display: flex;
  color: #e74c3c !important;
  font-weight: 900;
  background: #000;
  opacity: 0.8;
  padding: 3px;
  padding-top: 5px;
  border-radius: 5px;
}
</style>
