<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo区 -->
      <div class="logo-area">
        <div class="logo-icon">
          <el-icon :size="32" color="#36D399">
            <ShoppingCart />
          </el-icon>
        </div>
      </div>

      <!-- 标题区 -->
      <div class="title-area">
        <h1>管理员登录</h1>
      </div>

      <!-- 输入框组 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            :prefix-icon="User"
            clearable
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <!-- 辅助链接 -->
        <div class="form-footer">
          <el-checkbox v-model="rememberMe" label="记住密码" size="small" />
          <el-button link type="primary" size="small" class="forgot-link">忘记密码</el-button>
        </div>

        <!-- 操作按钮 -->
        <el-form-item class="login-button-item">
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            size="large"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 测试账号提示 -->
      <div class="login-tips">
        <el-divider content-position="center">
          <span class="divider-text">测试账号</span>
        </el-divider>
        <div class="tip-item">
          <el-tag type="success" size="small" effect="plain">超级管理员</el-tag>
          <span class="tip-account">admin / admin123</span>
        </div>
        <div class="tip-item">
          <el-tag type="success" size="small" effect="plain">运营管理员</el-tag>
          <span class="tip-account">operator / admin123</span>
        </div>
        <div class="tip-item">
          <el-tag type="success" size="small" effect="plain">数据分析员</el-tag>
          <span class="tip-account">analyst / admin123</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { validateUsername, validatePassword } from '@/utils/validate'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  captcha: '1234', // 临时使用固定验证码
  captchaKey: '', // 临时留空
})

// 记住密码
const rememberMe = ref(false)

// 加载状态
const loading = ref(false)

// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validateUsername(value)) {
          callback(new Error('用户名格式不正确（4-20位字母、数字或下划线）'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error('密码长度应为6-20位'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.login(loginForm)
        ElMessage.success('登录成功')

        // 获取重定向路径
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      } catch (error) {
        console.error('登录失败：', error)
      } finally {
        loading.value = false
      }
    }
  })
}

defineOptions({
  name: 'LoginPage',
})
</script>

<style scoped>
/* 容器 - 纯白背景 */
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  overflow: auto;
  padding: 20px;
}

/* 登录卡片 - 380px 宽，带边框和圆角 */
.login-box {
  width: 380px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

/* Logo区 - 居中，下方留白16px */
.logo-area {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #f0fff7;
  border-radius: 50%;
}

/* 标题区 - 24px，居中 */
.title-area {
  text-align: center;
  margin-bottom: 32px;
}

.title-area h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

/* 表单 */
.login-form {
  margin-top: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

/* 输入框样式调整 */
.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 1px #36d399 inset,
    0 0 0 2px rgba(54, 211, 153, 0.2);
}

.login-form :deep(.el-input__prefix) {
  color: #909399;
}

/* 表单底部 - 记住密码和忘记密码 */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-footer :deep(.el-checkbox) {
  font-size: 12px;
  color: #666666;
}

.form-footer :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #36d399;
  border-color: #36d399;
}

.form-footer :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #666666;
}

.forgot-link {
  font-size: 12px;
  color: #666666;
  padding: 0;
}

.forgot-link:hover {
  color: #36d399;
  text-decoration: underline;
}

/* 登录按钮 - 100%宽度，44px高度，绿色主题 */
.login-button-item {
  margin-bottom: 0;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background-color: #36d399;
  border-color: #36d399;
  transition: all 0.3s;
}

.login-button:hover {
  background-color: #2db788;
  border-color: #2db788;
}

.login-button:active {
  background-color: #28a178;
  border-color: #28a178;
}

.login-button.is-disabled {
  background-color: #a3e6cd;
  border-color: #a3e6cd;
}

/* 测试账号提示区 */
.login-tips {
  margin-top: 30px;
}

.divider-text {
  font-size: 12px;
  color: #c0c4cc;
}

.login-tips :deep(.el-divider__text) {
  background-color: #ffffff;
  padding: 0 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
}

.tip-item :deep(.el-tag) {
  border-color: #36d399;
  color: #36d399;
}

.tip-account {
  font-size: 12px;
  color: #666666;
}

/* 错误提示样式 */
.login-form :deep(.el-form-item__error) {
  color: #f56c6c;
  font-size: 12px;
}

.login-form :deep(.el-input__wrapper.is-error) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}
</style>
