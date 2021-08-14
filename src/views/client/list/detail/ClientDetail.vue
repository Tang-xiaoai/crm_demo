<template>
  <div class="client-detail">
    <!--  头部客户信息+tab切换  -->
    <header>
      <section class="header-wrapper">
        <el-description :title="'客户ID:'+customer.guid">
          <el-row>
            <el-description-item label="名称：" :span="8" :value="customer.customer_name" />
            <el-description-item label="类型：" :span="8" :value="customer.type === '1' ? '企业':'个人'" />
            <el-description-item label="" style="text-align: right">
              <template slot="content">
                <el-button
                  size="mini"
                  style="width: 60px;padding-left: 0;padding-right: 0;margin: 0 auto;"
                  @click="handleSend(customer)"
                >
                  转发手机
                </el-button>
                <el-button
                  size="mini"
                  style="width: 60px;margin-right: 8px;"
                  @click="updataClient(customer)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  style="width: 60px;padding-left: 0;padding-right: 0;margin: 0 auto;"
                  @click="gotoAddConsult()"
                >
                  新增咨询
                </el-button>
              </template>
            </el-description-item>
          </el-row>
          <el-row>
            <!--   <el-description-item label="创建时间：" :value="addTime(customer.add_time)" />-->
            <el-description-item label="创建时间：" value="没有数据传回" />
          </el-row>
        </el-description>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="客户信息" name="info" />
          <el-tab-pane label="咨询列表" name="list" />
        </el-tabs>
      </section>
    </header>
    <!--  主要内容区 联系人列表  -->
    <section v-if="activeName === 'info'" class="client-info">
      <section class="connect">
        <el-row :gutter="20" style="border-bottom: 1px solid #E9E9E9;">
          <el-col :span="12"><h3>联系人列表</h3></el-col>
          <el-col :span="12" style="text-align: right;margin-top: 15px;">
            <a href="javascript:void(0);" style="font-size: 14px;color: #1890FF;text-align: right;" @click="gotoAddClient">添加联系人</a>
          </el-col>
        </el-row>
        <div v-for="(item, index) in connectlist" :key="index" class="connect-item" style="font-size: 14px;color: rgba(0,0,0,0.65);">
          <el-row :gutter="20">
            <el-col :span="12"><h4 style="padding: 16px 0;margin: 0;">{{ item.name }}</h4></el-col>
            <el-col :span="12" style="text-align: right;margin-top: 10px;">
              <a href="javascript:void(0);" style="font-size: 14px;color: #1890FF;text-align: center;" @click="gotoUpdateClient(index)">编辑&emsp;|&emsp;</a>
              <a href="javascript:void(0);" style="font-size: 14px;color: #1890FF;text-align: center;">删除</a>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 15px;">
            <el-col :span="8">姓名：{{ item.name }}</el-col>
            <el-col :span="8">联系电话：{{ item.phone }}</el-col>
            <el-col :span="8">性别：{{ item.gender === 1 ? '男':'女' }}</el-col>
          </el-row>
          <el-row :gutter="20" style="margin-bottom: 15px">
            <el-col :span="8">出生日期：{{ item.birthday }}</el-col>
            <el-col :span="8">联系邮箱：{{ item.email }}</el-col>
            <el-col :span="8" rowspan="2">
              联系地址：
              <span>{{ item.city }}</span><br>
              <span style="margin-left: 74px">{{ item.address }}</span>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="consult-log">
        <el-row :gutter="20" style="border-bottom: 1px solid #E9E9E9;min-height: 51px;">
          <el-col :span="12"><h3>电话咨询记录</h3></el-col>
          <el-col :span="12" style="text-align: right;margin-top: 15px;">
            <a href="" style="font-size: 14px;color: #1890FF;text-align: center;">查看更多</a>
          </el-col>
        </el-row>
        <el-table
          v-loading="listLoading"
          :table-key="tableKey"
          :data="consultList"
          :header-cell-style="{ paddingLeft:'10px' }"
          :cell-style="{ paddingLeft:'10px' }"
          element-loading-text="Loading"
          highlight-current-row
        >
          <el-table-column align="left" label="操作人" min-width="98px">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="提交时间" min-width="210px">
            <template slot-scope="scope">
              {{ addTime(scope.row.add_time) }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="通话时长" min-width="180px">
            <template slot-scope="scope">
              {{ durationOption(scope.row.duration) }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="沟通内容" min-width="300px">
            <template slot-scope="scope">
              {{ scope.row.content }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="备注" min-width="290px">
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
        </el-table>
      </section>
    </section>
    <!--  主要内容区 咨询列表 -->
    <section v-else class="consult-list">
      <!--   搜索区   -->
      <div class="filter-container" style="min-width: 1280px;height: 76px;">
        <el-input
          v-model="listQuery.where.name"
          placeholder="操作人"
          style="width: 224px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="listQuery.searchDate"
          type="daterange"
          style="width: 250px;margin-left: 12px;"
          range-separator="-"
          start-placeholder="提交开始日期"
          end-placeholder="提交结束日期"
        />
        <el-input
          v-model="listQuery.where.remark"
          placeholder="备注"
          style="width: 224px;margin-left: 12px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
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
          @click="gotoAddConsult()"
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
      <!-- 咨询列表 -->
      <el-table
        v-loading="listLoading"
        :table-key="tableKey3"
        :data="consultList"
        :header-cell-style="{ paddingLeft:'10px' }"
        :cell-style="{ paddingLeft:'10px' }"
        element-loading-text="Loading"
        highlight-current-row
      >
        <el-table-column align="left" label="操作人" min-width="98px">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="提交时间" min-width="210px">
          <template slot-scope="scope">
            {{ addTime(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="通话时长" min-width="180px">
          <template slot-scope="scope">
            {{ durationOption(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="沟通内容" min-width="300px">
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="备注" min-width="290px">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
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
    </section>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getClientConsultDetail, getClientConsult } from '@/api/consult'

import ElDescription from '@/components/Description/index'
import ElDescriptionItem from '@/components/Description/el-description-item'

export default {
  name: 'ClientDetail',
  components: {
    ElDescription,
    ElDescriptionItem
  },
  data() {
    return {
      listLoading: false,
      tableKey: 2,
      tableKey3: 3,
      activeName: 'info',
      customer_guid: '',
      customer: {
        'guid': '12313',
        'type': 1,
        'customer_name': 'xxxxx'
      },
      connectlist: [
        {
          'name': '张三',
          'phone': 133445566789,
          'gender': 1,
          'birthday': '2019-09-09',
          'city': '///',
          'address': '无'
        },
        {
          'name': '张三',
          'phone': 133445566789,
          'gender': 1,
          'birthday': '2019-09-09',
          'city': '///',
          'address': '无'
        }
      ],
      consultList: [
        {
          name: 'name',
          add_time: 1613186880,
          duration: '',
          content: '',
          remark: ''
        },
        {
          name: 'name',
          add_time: 1613186880,
          duration: '',
          content: '',
          remark: ''
        }
      ],
      listQuery: {
        customer_guid: '',
        page: 1,
        limit: 10,
        searchDate: null,
        where: {
          // user_name: ''
        }
      },
      total: 0
    }
  },
  created() {
    this.customer_guid = this.$route.params.cguid
    this.getDetail()
  },
  methods: {
    // tab切换
    handleClick(tab) {
      this.activeName = tab.name
      if (this.activeName === 'info') {
        this.getDetail()
      } else {
        this.getList()
      }
    },
    durationOption(long) {
      const label = long / 60
      if (label < 60) {
        return label + '分钟内'
      } else if (label === 60) {
        return '1小时内'
      } else {
        return '大于1小时'
      }
    },
    handleSend() {
      return 0
    },
    gotoAddConsult() {
      this.$router.push({ path: '/client/list/add', query: { customer_guid: this.customer.guid }})
    },
    getDetail() {
      this.listLoading = true
      const tempData = {
        customer_guid: this.customer_guid
      }
      console.log('clientdetail tempData', tempData)
      getClientConsultDetail(tempData).then(response => {
        const result = response.data
        // 客户就一个吧，后端返回customer是一个列表,错误
        this.customer = result.customer[0]
        this.connectlist = result.link
        this.consultList = result.log
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    gotoAddClient() {
      this.$router.push({ path: '/client/list/detail/add', query: { guid: this.customer.guid }})
    },
    gotoUpdateClient(index) {
      this.$router.push({ path: '/client/list/detail/update', query: { person: JSON.stringify(this.connectlist[index]), customer_guid: this.customer.guid }})
    },
    getList() {
      this.listLoading = true
      const data = Object.assign({}, this.listQuery)
      data.customer_guid = this.customer_guid

      data.searchDate = JSON.stringify({
        'startDate': !this.listQuery.searchDate ? 1613186880 : Math.floor(new Date(this.listQuery.searchDate[0]).getTime() / 86400000) * 86400,
        'endDate': !this.listQuery.searchDate ? Date.parse(new Date()) / 1000 : Math.ceil(new Date(this.listQuery.searchDate[1]).getTime() / 86400000) * 86400 + 86399
      })
      data.where = JSON.stringify(this.listQuery.where)
      console.log('clientdetail listquery', data)
      getClientConsult(data).then(response => {
        const result = response.data
        this.consultList = result.data
        this.total = result.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updataClient(client) {
      return 0
    },
    addTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
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
  header {
    width: 100%;
    min-width: 1200px;
    height: 186px;
    margin-top: 2px;
    padding: 20px 24px;
    background: #fff;
  }
  h3 {
    font-size: 16px !important;
    color: rgba(0,0,0,0.85) !important;
    line-height: 24px;
  }
  h4 {
    font-size: 16px !important;
    color: rgba(0,0,0,0.85) !important;
    line-height: 22px;
  }
  .header-wrapper {
    width: 1180px;
  }
  /deep/ .el-tabs .el-tabs__nav-wrap::after {
    height: 0;
  }
  .connect {
    margin-top: 20px;
    padding: 0 20px 12px;
    background: #fff;
  }
  .connect .connect-item:not(:last-child) {
    border-bottom: 1px solid #E9E9E9;
  }
  .consult-log {
    margin: 20px auto;
    padding: 1px 20px 0;
    background: #fff;
  }
  .consult-list {
    padding: 20px 24px;
  }

</style>
