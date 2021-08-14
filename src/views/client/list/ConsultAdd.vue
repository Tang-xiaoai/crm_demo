<template>
  <div class="list-container">
    <el-form ref="dataForm" class="center-form" :rules="rules" :model="form" style="width: 700px" label-width="100px" label-position="left">
      <el-form-item label="通话时长" prop="duration">
        <el-select v-model="form.duration" style="width: 224px;" placeholder="请选择">
          <el-option v-for="item in durationOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="沟通内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          class="text-style"
          style="width: 600px;"
          maxlength="120"
          show-word-limit
          placeholder="请简要说明沟通的情况"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          class="text-style"
          style="width: 600px;height: 140px;"
          maxlength="120"
          show-word-limit
          placeholder="请备注客户跟进进度以及客户需求"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCreate">提交</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addClientConsult } from '@/api/consult'

const durationOptions = [
  { key: '60', display_name: '1分钟内' },
  { key: '300', display_name: '5分钟内' },
  { key: '600', display_name: '10分钟内' },
  { key: '1800', display_name: '30分钟内' },
  { key: '3600', display_name: '1小时内' },
  { key: '3800', display_name: '大于1小时' }
]
export default {
  name: 'ConsultAdd',
  data() {
    return {
      durationOptions,
      customer_guid: '',
      form: {
        duration: '',
        content: '',
        remark: ''
      },
      rules: {
        duration: [{ required: true, message: '通话时长不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // 路由跳转过来，获取customer_guid参数
    this.customer_guid = this.$route.query.customer_guid
  },
  methods: {
    resetForm() {
      this.form = {
        duration: '',
        content: '',
        remark: ''
      }
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.form.customer_guid = this.customer_guid
          addClientConsult(this.form).then(() => {
            this.$notify({
              title: 'Success',
              message: '添加咨询成功',
              type: 'success',
              duration: 2000
            })
            this.resetForm()
          })
        } else {
          console.log('表单验证不通过！')
        }
      })
    },
    handleCancel() {
      this.$confirm(`确定取消新增咨询?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetForm()
        this.$message({
          type: 'success',
          message: `已取消新增`
        })
        this.$router.push('/client/list')
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: `继续填写`
        })
      })
    }
  }
}
</script>

<style scoped>
  .list-container {
    background: #fff;
    width: 100%;
    min-height: 644px;
    padding: 40px  0;
    margin-top: 20px;
  }
  .center-form {
    margin: 0 auto;
  }
  .text-style/deep/textarea {
    height: 140px;
    padding: 14px 20px;
  }
</style>
