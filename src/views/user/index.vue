<template>
  <div class="app-container">
    <!-- 搜素 -->
    <div class="filter-container" style="min-width: 1280px;height: 76px;">
      <el-input
        v-model="listQuery.where.user_name"
        placeholder="用户名"
        style="width: 224px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.where.nick_name"
        placeholder="昵称"
        style="width: 224px;margin-left: 12px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.where.phone"
        placeholder="手机号"
        style="width: 124px;margin-left: 12px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.searchDate"
        type="daterange"
        style="width: 250px;margin-left: 12px;"
        range-separator="-"
        start-placeholder="创建开始日期"
        end-placeholder="创建结束日期"
      />
      <el-button
        class="filter-item"
        type="primary"
        style="margin-left: 48px;"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 8px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 8px;"
        type="primary"
        icon="el-icon-download"
      >
        导出
      </el-button>
    </div>
    <!-- 管理员列表 -->
    <el-table
      v-loading="listLoading"
      :table-key="tableKey"
      :data="list"
      :header-cell-style="{ paddingLeft:'20px' }"
      :cell-style="{ paddingLeft:'20px' }"
      element-loading-text="Loading"
      style="min-width: 1182px; "
      highlight-current-row
    >
      <el-table-column align="left" label="序号" min-width="80px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="用户名" min-width="116px">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="头像" min-width="104px">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar !== '---'" :src="scope.row.avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" alt="">
          <img v-else src="@/assets/imgView.gif?imageView2/1/w/80/h/80" alt="" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column align="left" label="昵称" min-width="130px">
        <template slot-scope="scope">
          {{ scope.row.nick_name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="手机号" min-width="160px">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" min-width="200px">
        <template slot-scope="scope">
          {{ addTime(scope.row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="状态" min-width="150px">
        <template slot-scope="scope">
          <el-badge is-dot :type="scope.row.status === 1 ? 'primary':'info'" class="status-dot" />
          <span>{{ scope.row.status === 1 ? '正常':'已禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="242px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="width: 60px;padding-left: 0;padding-right: 0;margin: 0 auto;" @click="handleUpfatePwd(scope.row)">
            修改密码
          </el-button>
          <el-button size="mini" style="width: 60px;" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button
            v-if="scope.row.status !== 1"
            size="mini"
            type="success"
            style="width: 60px;"
            @click="changeStatus(scope.row)"
          >
            启用
          </el-button>
          <el-button
            v-else
            size="mini"
            type="danger"
            style="width: 60px;"
            @click="changeStatus(scope.row)"
          >
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加用户弹窗  --><!-- 修改信息弹窗  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 850px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="temp.user_name" type="text" placeholder="请设置6-20位数字或字母" style="width: 220px;" :disabled="dialogStatus !== 'create'" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="密码" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="请设置6-10位数字或字母" autocomplete="off" style="width: 220px;" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="密码确认" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" type="password" placeholder="请再次输入密码" style="width: 220px;" autocomplete="off" />
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model="temp.nick_name" type="text" placeholder="请输入4-12位中英文字符" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="temp.phone" type="text" placeholder="请输入" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar" style="margin-bottom: 30px;width: 360px;">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
          >
            <div class="upload-img">
              <img v-if="temp.avatar" :src="temp.avatar" alt="">
              <div v-else class="upload-info">
                <i class="el-icon-plus avatar-uploader-icon" />
                <div class="el-upload__text">上传</div>
              </div>
            </div>
            <div class="el-upload__tip">支持jpg，jpeg，png格式，图片大小不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 修改密码弹窗  -->
    <el-dialog title="修改密码" :visible.sync="dialogPwdFormVisible">
      <el-form
        ref="pwdForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 840px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="temp.user_name" type="text" style="width: 220px;" disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="请输入6-10个数字或字母" style="width: 220px;" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码确认" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" type="password" placeholder="请再次输入密码" style="width: 220px;" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePwd()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        background
        style="text-align: right;"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getAdminList, addAdmin, updateAdmin, updateAdminPwd, updateAdminStatus } from '@/api/user'
import { Message } from 'element-ui'

export default {
  name: 'Index',
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      listLoading: true,
      tableKey: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPwdFormVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      list: [
        {
          'guid': '1a9dde8481c474be3b43c0ffb4ac7dbe',
          'user_name': 'test1',
          'password': 'e0498134cd63ebfd45ee25714453cc6d',
          'status': 1,
          'add_time': 1613186880,
          'nick_name': '张三',
          'avatar': 'https://csdn-exam.oss-cn-shenzhen.aliyuncs.com/index.jpg'
        }
      ],
      temp: {
        'user_name': '',
        'password': '',
        'add_time': Date.parse(new Date()) / 1000,
        'nick_name': '',
        'avatar': ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        searchDate: null,
        where: {
          user_name: '',
          nick_name: '',
          phone: ''
        }
      },
      rules: {
        user_name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { pattern: /^[A-z0-9]{6,20}$/, message: '请输入6-20位数字或字母', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          // { pattern: /^[A-z0-9]{6,10}$/, message: '请输入6-10位数字或字母', trigger: ['blur', 'change'] }
          { pattern: /^[A-z]\w{5,17}$/, message: '请输入czwrules', trigger: ['blur', 'change'] }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }
        ],
        nick_name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
          { pattern: /^[A-z]{4,12}$/, message: '请输入4-12位中英文字符', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/, message: '请输入合法手机号', trigger: ['blur', 'change'] }
        ]
        // ,avatar: [
        //   { required: true, message: ' ' }
        // ]
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      // 要进行深复制，不然传参格式与本页面的格式冲突
      const data = JSON.parse(JSON.stringify(this.listQuery))
      // 时间戳设置为开始时间00:00:00,结束时间23:59:59
      // 这么写麻烦，后续要优化
      data.searchDate = JSON.stringify({
        'startDate': !this.listQuery.searchDate ? 1613186880 : Math.floor(new Date(this.listQuery.searchDate[0]).getTime() / 86400000) * 86400,
        'endDate': !this.listQuery.searchDate ? Date.parse(new Date()) / 1000 : Math.ceil(new Date(this.listQuery.searchDate[1]).getTime() / 86400000) * 86400 + 86399
      })
      data.where = JSON.stringify(this.listQuery.where)

      getAdminList(data).then(response => {
        // 把返回来的data，从字符串转成json对象
        const result = response.data
        this.list = result.data
        this.total = result.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      return this.list
    },
    // 处理过滤条件 并重新获取列表
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 添加时间的时间戳格式转换
    addTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    // 添加管理员前重置临时内容
    resetTemp() {
      this.temp = {
        'user_name': '',
        'password': '',
        'add_time': Date.parse(new Date()) / 1000,
        'nick_name': '',
        'avatar': ''
      }
    },
    // 添加管理员 窗口
    handleCreate(row) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加管理员
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.temp.confirmPassword
          this.temp.avatar = 'https://csdn-exam.oss-cn-shenzhen.aliyuncs.com/index.jpg'
          addAdmin(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '管理员添加成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        } else {
          console.log('请检查提交信息!!')
          return false
        }
      })
    },
    // 修改密码窗口 弹出
    handleUpfatePwd(row) {
      this.temp = Object.assign({}, row)
      this.temp.password = ''
      this.dialogPwdFormVisible = true
      this.$nextTick(() => {
        this.$refs['pwdForm'].clearValidate()
      })
    },
    // 修改密码
    updatePwd() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            admin_guid: this.temp.guid,
            password: this.temp.password
          }
          updateAdminPwd(tempData).then(() => {
            this.dialogPwdFormVisible = false
            this.$notify({
              title: 'Success',
              message: '密码更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        } else {
          console.log('请检查提交信息!!')
          return false
        }
      })
    },
    // 更新管理员信息 窗口
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新管理员信息
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            admin_guid: this.temp.guid,
            nick_name: this.temp.nick_name,
            phone: this.temp.phone
          }
          updateAdmin(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '管理员信息更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getList()
        } else {
          console.log('请检查提交信息!!')
          return false
        }
      })
    },
    // 修改状态，根据状态动态弹出提示
    changeStatus(row) {
      let confirmMsg = ''
      if (row.status === 1) {
        confirmMsg = '禁用'
      } else {
        confirmMsg = '启用'
      }
      this.$confirm(`是否${confirmMsg}此用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const new_status = (row.status === 1 ? 2 : 1)
        // 点击确认 需要修改，则将修改状态发给后端，后端完成后，本地状态修改(不修改也行)
        updateAdminStatus({
          admin_guid: row.guid,
          status: new_status
        }).then(res => {
          row.status = new_status
          Message({
            message: `${confirmMsg}成功!` || `修改成功!`,
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(() => {
          Message({
            message: `${confirmMsg}不成功!` || '修改不成功',
            type: 'danger',
            duration: 5 * 1000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${confirmMsg}`
        })
      })
    },
    // 分页功能
    handleSizeChange(val) {
      this.listQuery.limit = val
      console.log(`${val}`)
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      console.log(`当前页: ${val}`)
      this.getList()
    }
  }
}
</script>

<style scoped>
  .status-dot {
    margin-top: 6px;
    margin-right: 8px;
  }
  .user-avatar {
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important;
  }
  .upload-img {
    width: 96px;
    height: 96px;
    border-radius: 3px;
  }
  .upload-img .upload-info{
    width: 96px;
    height: 96px;
    background: #FAFAFA;
    border: 1px dashed #DCDFE6;
    border-radius: 3px;
  }
  .upload-img img {
    width: 96px;
    height: 96px;
    border-radius: 3px;
  }
  .avatar-uploader-icon {
    padding: 0;
    font-size: 12px;
    color: #666666;
    text-align: center;
    vertical-align: bottom;
  }
  .block {
    padding: 21px 0;
  }
</style>
