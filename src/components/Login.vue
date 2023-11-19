<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Lock} from '@element-plus/icons-vue'
import { FormInstance, FormRules } from 'element-plus'
import { Login } from "../utils/api/api"
import type { IUserInfo } from "../utils/api/model"

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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {

      Login(ruleForm).then(resp => {
        console.log("resp = ", resp)
      }).catch(err => {
        console.log("Err = ", err)
      })

      console.log(ruleForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>

<template>
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
</template>

<style>
.content {
  width: 600px;
  height: 400px;
  display: flex; /* let img and div display on the same line */
  background-color: rgba(200, 244, 248, 0.2);
}

.logo {
  width: 300px;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px dashed rgba(11, 172, 187, 0.3);
}

.logo img {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.login {
  width: 350px;
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
}

.login .title {
  margin-top: 80px;
  font-size: 30px;
  font-weight: bold;
}

.login .loginForm {
  padding-top: 30px;
  padding-bottom: 20px;
}

.login .loginForm .submit {
  margin: 0 auto;
}
</style>