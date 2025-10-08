<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="queryForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input
            v-model="queryForm.realName"
            placeholder="请输入真实姓名"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="queryForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 180px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="queryForm.gender" placeholder="请选择性别" clearable style="width: 120px">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">新增会员</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="customerId" label="会员ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar
              v-if="row.avatarUrl"
              :src="row.avatarUrl"
              :size="50"
              shape="circle"
            />
            <el-avatar v-else :size="50" shape="circle">
              {{ row.realName?.charAt(0) || '?' }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="genderText" label="性别" width="70" align="center" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="country" label="国家" width="100" />
        <el-table-column prop="fullAddress" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="340" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              :type="row.status === 1 ? 'warning' : 'success'"
              size="small"
              @click="handleStatusChange(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="info" size="small" @click="handleResetPassword(row)">
              重置密码
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio :value="0">未知</el-radio>
            <el-radio :value="1">男</el-radio>
            <el-radio :value="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            v-model="formData.birthDate"
            type="date"
            placeholder="请选择出生日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-select
            v-model="formData.country"
            placeholder="请选择国家"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="country in countryList"
              :key="country"
              :label="country"
              :value="country"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="省/州" prop="province">
          <el-input v-model="formData.province" placeholder="国内：省份 / 国外：州/省" />
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="formData.city" placeholder="城市名称" />
        </el-form-item>
        <el-form-item label="区/县" prop="district">
          <el-input v-model="formData.district" placeholder="区县名称" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="formData.address"
            type="textarea"
            :rows="2"
            placeholder="街道门牌号等详细地址信息"
          />
        </el-form-item>
        <el-form-item label="头像" prop="avatarUrl">
          <ImageUpload
            v-model="formData.avatarUrl"
            type="avatar"
            :limit="1"
            :multiple="false"
            :list-type="'picture'"
            tip="建议尺寸：200x200像素"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="重置密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete, Key } from '@element-plus/icons-vue'
import {
  getCustomerPage,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  resetCustomerPassword
} from '@/api/customer'
import type { CustomerVO, CustomerQuery, CustomerForm } from '@/types/customer'
import ImageUpload from '@/components/ImageUpload.vue'

// 国家列表（按使用频率排序）
const countryList = [
  '中国',
  '美国',
  '日本',
  '韩国',
  '英国',
  '法国',
  '德国',
  '加拿大',
  '澳大利亚',
  '新西兰',
  '新加坡',
  '马来西亚',
  '泰国',
  '印度尼西亚',
  '菲律宾',
  '越南',
  '印度',
  '俄罗斯',
  '意大利',
  '西班牙',
  '荷兰',
  '瑞士',
  '瑞典',
  '挪威',
  '丹麦',
  '芬兰',
  '比利时',
  '奥地利',
  '波兰',
  '捷克',
  '匈牙利',
  '希腊',
  '葡萄牙',
  '爱尔兰',
  '巴西',
  '阿根廷',
  '墨西哥',
  '智利',
  '秘鲁',
  '哥伦比亚',
  '埃及',
  '南非',
  '沙特阿拉伯',
  '阿联酋',
  '土耳其',
  '以色列',
  '巴基斯坦',
  '孟加拉国',
  '尼日利亚',
  '肯尼亚',
  '其他'
]

// 查询表单
const queryForm = reactive<CustomerQuery>({
  username: '',
  realName: '',
  phone: '',
  gender: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10
})

// 表格数据
const loading = ref(false)
const tableData = ref<CustomerVO[]>([])
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = reactive<CustomerForm>({
  customerId: undefined,
  username: '',
  password: '',
  realName: '',
  gender: 0,
  birthDate: '',
  phone: '',
  email: '',
  country: '',
  avatarUrl: '',
  province: '',
  city: '',
  district: '',
  address: '',
  status: 1
})

// 表单验证规则
const formRules = reactive<FormRules<CustomerForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度为4-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
})

// 重置密码对话框
const passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  customerId: 0,
  newPassword: '',
  confirmPassword: ''
})

// 重置密码验证规则
const passwordRules = reactive<FormRules>({
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 加载列表数据
const loadTableData = async () => {
  loading.value = true
  try {
    const res = await getCustomerPage(queryForm)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryForm.pageNum = 1
  loadTableData()
}

// 重置
const handleReset = () => {
  queryForm.username = ''
  queryForm.realName = ''
  queryForm.phone = ''
  queryForm.gender = undefined
  queryForm.status = undefined
  handleQuery()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增会员'
  isEdit.value = false
  dialogVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (row: CustomerVO) => {
  dialogTitle.value = '编辑会员'
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(formData, {
    customerId: row.customerId,
    username: row.username,
    realName: row.realName,
    gender: row.gender,
    birthDate: row.birthDate,
    phone: row.phone,
    email: row.email,
    country: row.country,
    avatarUrl: row.avatarUrl || '',
    province: row.province,
    city: row.city,
    district: row.district,
    address: row.address,
    status: row.status
  })
}

// 状态切换
const handleStatusChange = async (row: CustomerVO) => {
  const newStatus = row.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'

  try {
    await ElMessageBox.confirm(`确定要${action}该会员吗？`, '提示', {
      type: 'warning'
    })

    await updateCustomer(row.customerId, {
      ...row,
      status: newStatus
    })

    ElMessage.success(`${action}成功`)
    loadTableData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${action}失败`)
    }
  }
}

// 重置密码
const handleResetPassword = (row: CustomerVO) => {
  passwordForm.customerId = row.customerId
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordDialogVisible.value = true
  passwordFormRef.value?.clearValidate()
}

// 删除
const handleDelete = async (row: CustomerVO) => {
  try {
    await ElMessageBox.confirm('确定要删除该会员吗？删除后将无法恢复！', '警告', {
      type: 'warning'
    })

    await deleteCustomer(row.customerId)
    ElMessage.success('删除成功')
    loadTableData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        await updateCustomer(formData.customerId!, formData)
        ElMessage.success('编辑成功')
      } else {
        await createCustomer(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      loadTableData()
    } catch (error) {
      ElMessage.error(isEdit.value ? '编辑失败' : '新增失败')
    } finally {
      submitting.value = false
    }
  })
}

// 提交密码重置
const handlePasswordSubmit = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      await resetCustomerPassword(passwordForm.customerId, passwordForm.newPassword)
      ElMessage.success('密码重置成功')
      passwordDialogVisible.value = false
    } catch (error) {
      ElMessage.error('密码重置失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.customerId = undefined
  formData.username = ''
  formData.password = ''
  formData.realName = ''
  formData.gender = 0
  formData.birthDate = ''
  formData.phone = ''
  formData.email = ''
  formData.country = ''
  formData.avatarUrl = ''
  formData.province = ''
  formData.city = ''
  formData.district = ''
  formData.address = ''
  formData.status = 1
  formRef.value?.clearValidate()
}

// 初始化
onMounted(() => {
  loadTableData()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card .pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

