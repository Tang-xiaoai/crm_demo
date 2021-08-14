<template>
  <div class="update-connect">
    <el-form
      ref="infoForm"
      class="center-form"
      :rules="rules"
      :model="form"
      style="width: 500px"
      label-width="100px"
    >
      <el-form-item v-if="form.type === '1'" label="姓名" prop="name">
        <el-input v-model="form.name" style="width: 360px;" placeholder="请输入2-20个中文或英文字符" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" style="width: 124px;" placeholder="请选择">
          <el-option label="男" value="1" :selected="form.gender==='1'?'selected':''" />
          <el-option label="女" value="2" :selected="form.gender==='2'?'selected':''" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" style="width: 360px;" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          placeholder="选择日期"
          style="width: 224px;"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" style="width: 360px;" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="地址" prop="city">
        <el-cascader
          v-model="form.city"
          :options="casOptions"
          :props="props"
          style="width: 360px;"
          @change="handleCasChange"
        />
      </el-form-item>
      <el-form-item width="360px" prop="address">
        <el-input v-model="form.address" style="width: 360px;" type="text" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate">提交</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { CodeToText, regionData } from 'element-china-area-data'
import { addClient } from '@/api/client'

export default {
  name: 'UpdateConnect',
  data() {
    return {
      listLoading: false,
      props: { expandTrigger: 'hover' },
      customer_guid: '',
      casOptions: regionData,
      selectedOptions: [],
      citySelection: '',
      form: {
        type: '',
        customer_name: '',
        name: '',
        gender: '',
        phone: '',
        birthday: '',
        email: '',
        city: '',
        address: ''
      },
      rules: {
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        customer_name: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请输入合法手机号', trigger: ['blur', 'change'] }
        ],
        city: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    const person_tre = this.$route.query.person
    this.customer_guid = this.$route.query.customer_guid
    const person = JSON.parse(person_tre)
    this.form = Object.assign({}, person)
  },
  methods: {
    resetAdd() {
      this.form = {
        type: '',
        customer_name: '',
        name: '',
        gender: '',
        phone: '',
        birthday: '',
        email: '',
        city: '',
        address: ''
      }
    },
    handleCasChange(value) {
      const tempCity = Object.assign([], value)
      let name = ''
      // 将地址码转换为地址
      for (let i = 0; i < tempCity.length; i++) {
        name += CodeToText[tempCity[i]] + '/'
      }
      this.citySelection = name
    },
    handleUpdate() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.form)
          tempData.city = this.citySelection
          tempData.birthday = new Date(tempData.birthday).getTime() / 1000
          if (tempData.name === '') {
            tempData.name = tempData.customer_name
          }
          addClient(tempData).then(() => {
            this.$notify({
              title: 'Success',
              message: '修改客户成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
            this.resetAdd()
          }).catch(() => {
            this.$router.push('/client/add')
          })
        } else {
          console.log('请检查提交信息!!')
          return false
        }
      })
      return 0
    },
    handleCancel() {

    }
  }
}
</script>

<style scoped>
  .update-connect {
    margin: 20px 0;
    min-height: 640px;
    padding: 42px 0;
    background: #fff;
  }
  .center-form {
    width: 420px;
    margin: 0 auto;
  }
</style>
