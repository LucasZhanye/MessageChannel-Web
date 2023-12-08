<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Lock} from '@element-plus/icons-vue'
import { FormInstance, FormRules } from 'element-plus'
import type { IUserInfo } from "@/utils/api/model"
import {useUserStore} from '@/stores'
import { useRouter } from 'vue-router'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<IUserInfo> ({
  username: "",
  password: ""
})
const rules = reactive<FormRules<IUserInfo>>({
  username: [
    { required: true, trigger: 'blur' }
  ], 
  password: [
    { required: true, trigger: 'blur' }
  ]
})

const user = useUserStore()

const router = useRouter()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid, _fields) => {
    if (valid) {
      user.login(ruleForm).then(() => {
        router.push({"name": "Home"})
      }).catch((error) => {
        console.log("login fail:", error)
      })
    } else {
      ElMessage.error("Incorrect information entered")
    }
  })
}

</script>

<template>
  <div class="login-container">
    <div class="content">
      <div class="logo">
        <img src="../assets/logo.png" />
      </div>
      
      <div class="login">
        <div class="title">
          Welcome
        </div>

        <el-form
          class="loginForm"
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormRef"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="ruleForm.username" 
              placeholder="username"
              :prefix-icon="User"/>
          </el-form-item>

          <el-form-item prop="password">
            <el-input 
              v-model="ruleForm.password" 
              type="password" 
              placeholder="password"
              :prefix-icon="Lock"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit" @click="submitForm(ruleFormRef)">
              Login
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.login-container .content {
  width: 40%;
  height: 400px;
  display: flex;  /* let img and div display on the same line */
  place-items: center;
  background-color: rgba(200, 244, 248, 0.2);
}

.login-container .content .logo {
  flex-grow: 1;
  display: flex;
  align-items: center;
  border-right: 1px dashed rgba(11, 172, 187, 0.3);
}

.login-container .content .logo img {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.login-container .content .login {
  flex-grow: 1;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
}

.login-container .content .login .title {
  margin-top: 40px;
  font-size: 30px;
  font-weight: bold;
}

.login-container .content .login .loginForm {
  padding-top: 30px;
  padding-bottom: 20px;
}

.login-container .content .login .loginForm .submit {
  margin: 0 auto;
}
</style>