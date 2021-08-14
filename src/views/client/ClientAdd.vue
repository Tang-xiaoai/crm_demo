<template>
  <div class="client-add">
    <!--  步骤条  -->
    <el-steps
      :active="currentStep"
      finish-status="success"
      align-left
      style="width:510px;margin: 0px auto 40px;justify-content: space-between;align-items: center;"
    >
      <el-step />
      <el-step />
    </el-steps>
    <!--  基本信息form  -->
    <el-form v-show="currentStep === 0" ref="baseForm" class="center-form" :rules="rules" :model="form" style="width: 500px" label-width="100px">
      <el-form-item label="客户类型" prop="type">
        <el-select v-model="form.type" style="width: 124px;" placeholder="客户类型">
          <el-option label="企业" value="1" selected />
          <el-option label="个人" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="customer_name">
        <el-input v-model="form.customer_name" style="width: 360px;" :placeholder="form.type === '1' ? '请输入完整企业名称':'请输入真实姓名'" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleNext">下一步</el-button>
      </el-form-item>
    </el-form>
    <!--  联系人信息form  -->
    <el-form v-show="currentStep === 1" ref="infoForm" class="center-form" :rules="rules" :model="form" style="width: 500px" label-width="100px">
      <el-form-item v-if="form.type === '1'" label="姓名" prop="name">
        <el-input v-model="form.name" style="width: 360px;" placeholder="请输入2-20个中文或英文字符" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" style="width: 124px;" placeholder="请选择">
          <el-option label="男" value="1" selected />
          <el-option label="女" value="2" />
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
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="createData">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { regionData, CodeToText } from 'element-china-area-data'
import { addClient } from '@/api/client'

export default {
  name: 'ClientAdd',
  data() {
    return {
      listLoading: false,
      currentStep: 0,
      props: { expandTrigger: 'hover' },
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
  methods: {
    prevStep() {
      this.currentStep--
    },
    nextStep() {
      this.currentStep++
    },
    resetAdd() {
      this.currentStep = 0
      this.form = {
        type: '',
        customer_name: '',
        name: '',
        gender: '',
        phone: '',
        birthday: '',
        email: ''
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
    handleNext() {
      this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          this.nextStep()
        } else {
          console.log('请检查提交信息!!')
          return false
        }
      })
    },
    createData() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          this.nextStep()
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
              message: '添加客户成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
            this.resetAdd()
          }).catch(() => {
            this.currentStep = 0
            this.$router.push('/client/add')
          })
        } else {
          console.log('请检查提交信息!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .client-add {
    margin: 20px 24px;
    padding-top: 78px;
    min-height: 644px;
    background: #fff;
  }
  .center-form {
    margin: 0 auto;
  }
  .el-step {
    height: 32px;
  }
  .el-step/deep/.el-step__head::after {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: rgba(0,0,0,0.45);
    text-align: left;
    line-height: 24px;
    margin-left: 8px;
  }
  .el-step/deep/.el-step__head:nth-child(1)::after{
    content: '填写基础信息';
    /*content: "\e6da";*/
  }
  .el-step/deep/.el-step__head:nth-child(2)::after{
    content: '填写联系人信息';
  }
  .el-step/deep/.el-step__head.is-process::after {
    color: rgba(0,0,0,0.65);
  }
  .el-step/deep/.el-step__icon {
    width: 32px;
    height: 32px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.15);
    font-family: HelveticaNeue;
    font-size: 16px;
    color: rgba(0,0,0,0.25);
    text-align: center;
    line-height: 24px;
  }
  .el-step/deep/.el-step__head.is-process .el-step__icon{
    background: #1890FF;
    font-family: HelveticaNeue;
    border: none;
    color: #FFFFFF;
  }
  .el-step/deep/.el-step__head.is-success .el-step__icon {
    background: white;
    color: #1890FF;
    border-color: #1890FF;
  }
  .el-step/deep/.el-step__line {
    width: 192px;
    height: 1px;
    top: 16px;
    left: 152px;
    background: #1890FF;
  }
</style>
