<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FETCH_ALL_ROLES_URL, ADD_ROLE_URL, UPDATE_ROLE_URL, DELETE_ROLE_URL } from '../../../utils/constant'
import apiClient from '../../../utils/asiox_instance'
import dayjs from 'dayjs'
import { getDatetimeByArrayTimeFormat } from '../../../utils/common_utils'

const roles = ref([])
const loading = ref(false)
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const sortOptions = ref([
  { label: '按创建时间升序', value: 'createTime,asc' },
  { label: '按创建时间降序', value: 'createTime,desc' },
  { label: '按名称升序', value: 'name,asc' },
  { label: '按名称降序', value: 'name,desc' }
])
const sortValue = ref('createTime,desc')
const columnOptions = ref([
  { label: 'ID', value: 'id', show: true },
  { label: '名称', value: 'name', show: true },
  { label: '描述', value: 'description', show: true },
  { label: '创建时间', value: 'createTime', show: true },
  { label: '更新时间', value: 'updateTime', show: true },
  { label: '可删除', value: 'deletable', show: true }
])
const showDialog = ref(false)
const dialogTitle = ref('')
const form = ref({
  name: '',
  description: ''
})
const isAdd = ref(true)
const currentId = ref(null)
const currentRole = ref(null)

const fetchRoles = async () => {
  loading.value = true
  try {
    const res = await apiClient(
      FETCH_ALL_ROLES_URL,
      {
        method: 'get',
        params: {
          pageNum: pagination.value.pageNum,
          pageSize: pagination.value.pageSize,
        }
      }
    );  

    roles.value = res.data.data.list
    pagination.value.total = res.data.data.total
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = async () => {
  try {
    const res = await apiClient(
      ADD_ROLE_URL,
      {
        method: 'post',
        data: {
          name: form.value.name,
          description: form.value.description
        }
      }
    );
    if (res.data.code !== 0) {
      ElMessage.error("添加角色失败");
      showDialog.value = false;
      return
    }
    ElMessage.success('添加角色成功');
    showDialog.value = false;
    fetchRoles();
  } catch (error) {
    ElMessage.error('添加角色失败');
  }
}

const handleUpdate = async () => {
  try {
    const res = await apiClient(
      UPDATE_ROLE_URL,
      {
        method: 'put',
        data: {
          id: currentId.value,
          name: form.value.name,
          description: form.value.description
        }
      }
    );
    if (res.data.code !== 0) {
      ElMessage.error('更新角色失败')
      return
    }
    ElMessage.success('更新角色成功')
    showDialog.value = false
    fetchRoles()
  } catch (error) {
    ElMessage.error('更新角色失败')
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该角色?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const res = await apiClient(
      DELETE_ROLE_URL + '/' + id,
      {
        method: 'delete'
      }
    );
    if (res.data.code !== 0) {
      ElMessage.error('删除角色失败')
      return
    }
    ElMessage.success('删除角色成功')
    fetchRoles()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除角色失败')
    }
  }
}

const showAddDialog = () => {
  dialogTitle.value = '添加角色'
  isAdd.value = true
  form.value = { name: '', description: '' }
  showDialog.value = true
}

const showEditDialog = (role) => {
  dialogTitle.value = '编辑角色'
  isAdd.value = false
  currentId.value = role.id
  currentRole.value = role
  form.value = { name: role.name, description: role.description }
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
  // 这里不需要调用fetchRoles，因为只是改变了显示列，不需要重新获取数据
}

onMounted(() => {
  fetchRoles()
})
</script>

<template>
  <div class="management-roles">
    <el-card>
      <div class="header">
        <el-button type="primary" @click="showAddDialog">添加角色</el-button>
        <div class="right-controls">
          <el-select 
            v-model="sortValue" 
            @change="fetchRoles" 
            placeholder="请选择排序方式"
            style="margin-right: 10px">
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

      <el-table :data="roles" v-loading="loading" border>
        <el-table-column 
          v-for="col in columnOptions.filter(c => c.show)" 
          :key="col.value"
          :prop="col.value" 
          :label="col.label" 
          :width="col.value === 'id' ? '80' : ''">
          <template #default="scope" v-if="col.value === 'createTime' || col.value === 'updateTime'">
            {{ formatDateTime(scope.row[col.value]) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button 
              size="small" 
              @click="showEditDialog(row)"
              :disabled="row.deletable === false">
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row.id)"
              :disabled="row.deletable === false">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="fetchRoles"
        @size-change="fetchRoles"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>

    <el-dialog v-model="showDialog" :title="dialogTitle">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" rows="4" />
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
.management-roles {
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