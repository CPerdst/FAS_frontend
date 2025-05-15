<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FETCH_ALL_USERS_URL, ADD_USER_URL, UPDATE_USER_URL, DELETE_USER_URL } from '../../../utils/constant'
import apiClient from '../../../utils/asiox_instance'
import dayjs from 'dayjs'
import { getDatetimeByArrayTimeFormat } from '../../../utils/common_utils'

const users = ref([])
const loading = ref(false)
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const sortOptions = ref([
  { label: '按创建时间升序', value: 'createTime,asc' },
  { label: '按创建时间降序', value: 'createTime,desc' },
  { label: '按姓名升序', value: 'name,asc' },
  { label: '按姓名降序', value: 'name,desc' }
])
const sortValue = ref('createTime,desc')
const columnOptions = ref([
  { label: 'ID', value: 'id', show: true },
  { label: '姓名', value: 'username', show: true },
  { label: '电话', value: 'telephone', show: true },
  { label: '性别', value: 'sex', show: true },
  { label: '创建时间', value: 'createTime', show: true },
  { label: '角色', value: 'roles', show: true },
  { label: '可删除', value: 'deletable', show: true }
])
const showDialog = ref(false)
const dialogTitle = ref('')
const form = ref({
  username: '',
  telephone: '',
  password: '',
  sex: true
})
const isAdd = ref(true)
const currentId = ref(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const [sortField, sortOrder] = sortValue.value.split(',')
    const res = await apiClient(
      FETCH_ALL_USERS_URL,
      {
        method: 'get',
        params: {
          pageNum: pagination.value.pageNum,
          pageSize: pagination.value.pageSize,
        }
      }
    );  

    users.value = res.data.data.list
    pagination.value.total = res.data.data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = async () => {
  try {
    const res = await apiClient(
      ADD_USER_URL,
      {
        method: 'post',
        data: {
          username: form.value.username,
          telephone: form.value.telephone,
          password: form.value.password,
          sex: form.value.sex
        }
      }
    );
    if (res.data.code !== 0) {
      ElMessage.error("添加用户失败");
      showDialog.value = false;
      return
    }
    ElMessage.success('添加用户成功');
    showDialog.value = false;
    fetchUsers();
  } catch (error) {
    ElMessage.error('添加用户失败');
  }
}

const handleUpdate = async () => {
  try {
    const res = await apiClient(
      UPDATE_USER_URL + '/' + currentId.value,
      {
        method: 'put',
        data: form.value,
        params: { id: currentId.value }
      }
    );
    if (res.data.code !== 0) {
      ElMessage.error('更新用户失败')
      return
    }
    ElMessage.success('更新用户成功')
    showDialog.value = false
    fetchUsers()
  } catch (error) {
    ElMessage.error('更新用户失败')
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该用户?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const res = await apiClient(
      DELETE_USER_URL + '/' + id,
      {
        method: 'delete'
      }
    );
    if (res.data.code !== 0) {
      ElMessage.error('删除用户失败')
      return
    }
    ElMessage.success('删除用户成功')
    fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户失败')
    }
  }
}

const showAddDialog = () => {
  dialogTitle.value = '添加用户'
  isAdd.value = true
  form.value = { username: '', telephone: '', password: '', sex: false}
  showDialog.value = true
}

const showEditDialog = (user) => {
  dialogTitle.value = '编辑用户'
  isAdd.value = false
  currentId.value = user.id
  form.value = { username: user.username, telephone: user.telephone, oldPassword: '', sex: user.sex }
  showDialog.value = true
}

const submitForm = () => {
  if (isAdd.value) {
    handleAdd()
  } else {
    handleUpdate()
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  return getDatetimeByArrayTimeFormat(dateTime);
}

const handleColumnChange = (val) => {
  // 这里不需要调用fetchUsers，因为只是改变了显示列，不需要重新获取数据
}

// 判断用户是否可编辑或删除
const isUserEditable = (user) => {
  return user.deletable !== false;
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="management-users">
    <el-card>
      <div class="header">
        <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        <div class="right-controls">
          <el-select 
            v-model="sortValue" 
            @change="fetchUsers" 
            placeholder="请选择排序方式"
            style="margin-right: 10px; width: 150px;">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select 
            v-model="columnOptions" 
            multiple 
            collapse-tags 
            placeholder="选择显示列"
            style="width: 150px;"
            @change="handleColumnChange">
            <el-option
              v-for="item in columnOptions"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <el-table :data="users" v-loading="loading" border>
        <el-table-column 
          v-for="col in columnOptions.filter(c => c.show)" 
          :key="col.value"
          :prop="col.value" 
          :label="col.label" 
          :width="col.value === 'id' ? '80' : ''">
          <template #default="scope" v-if="col.value === 'createTime'">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
          <template #default="scope" v-else-if="col.value === 'roles'">
            {{ scope.row.roles.map(role => role.name).join(', ') }}
          </template>
          <template #default="scope" v-else-if="col.value === 'sex'">
            {{ scope.row.sex ? '男' : '女' }}
          </template>
          <template #default="scope" v-else-if="col.value === 'deletable'">
            {{ scope.row.deletable === false ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button 
              size="small" 
              @click="showEditDialog(row)"
              :disabled="!isUserEditable(row)">
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row.id)"
              :disabled="!isUserEditable(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="fetchUsers"
        @size-change="fetchUsers"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>

    <el-dialog v-model="showDialog" :title="dialogTitle">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="true">男</el-radio>
            <el-radio :label="false">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.telephone" />
        </el-form-item>
        <el-form-item label="旧密码" v-if="!isAdd">
          <el-input v-model="form.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="密码" v-if="isAdd">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="新密码" v-else>
          <el-input v-model="form.password" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.management-users {
  padding: 20px;
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .right-controls {
      display: flex;
    }
  }
  
  .el-pagination {
    margin-top: 20px;
    justify-content: center;
  }
}
</style>