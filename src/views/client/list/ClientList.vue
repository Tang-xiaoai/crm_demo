<template>
  <div class="client-list">
    <!-- 搜素 -->
    <div class="filter-container" style="min-width: 1280px;height: 76px;">
      <el-input
        v-model="listQuery.where.guid"
        placeholder="客户ID"
        style="width: 224px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.where.type" placeholder="客户类型" style="width: 124px;margin-left: 12px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input
        v-model="listQuery.where.customer_name"
        placeholder="客户名称"
        style="width: 224px;margin-left: 12px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.where.name"
        placeholder="联系人姓名"
        style="width: 124px;margin-left: 12px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.where.phone"
        placeholder="联系人电话"
        style="width: 124px;margin-left: 12px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        style="margin-left: 10px;"
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
        @click="goToCreateClient"
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
    <!-- 用户列表 -->
    <el-table
      v-loading="listLoading"
      :table-key="tableKey"
      :data="list"
      :header-cell-style="{ paddingLeft:'10px' }"
      :cell-style="{ paddingLeft:'10px' }"
      element-loading-text="Loading"
      style="min-width: 1182px; "
      highlight-current-row
    >
      <el-table-column align="left" label="ID" min-width="120px">
        <template slot-scope="scope">
          {{ scope.row.guid }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="类型" min-width="80px">
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? '企业':'个人' }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="客户名称" min-width="200px">
        <template slot-scope="scope">
          {{ scope.row.customer_name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="联系人姓名" min-width="130px">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="联系人电话" min-width="160px">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="创建时间" min-width="200px">
        <template slot-scope="scope">
          {{ addTime(scope.row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="312px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="width: 60px;padding-left: 0;padding-right: 0;" @click="gotoAddConsult(scope.row)">
            新增咨询
          </el-button>
          <el-button type="success" size="mini" style="width: 60px;padding-left: 0;padding-right: 0;" @click="handleSend(scope.row)">
            转发手机
          </el-button>
          <el-button size="mini" style="width: 60px;" @click="gotoDetail(scope.row)">
            详情
          </el-button>
          <el-button size="mini" style="width: 60px;" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
import { getClientList } from '@/api/client'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  data() {
    return {
      listLoading: false,
      tableKey: 1,
      typeOptions: [
        { label: '企业', key: 1 },
        { label: '个人', key: 2 }
      ],
      list: [
        {
          'guid': '1a9dde8481c474be3b43c0ffb4ac7dbe',
          'type': 1,
          'customer_name': 'xxxx公司',
          'name': '张三',
          'phone': 133445566789,
          'add_time': 1613186880
        },
        {
          'guid': '1a9dde8481c474be3b43c0ffb4ac7dbe',
          'type': 1,
          'customer_name': 'xxxx公司',
          'name': '张三',
          'phone': 133445566789,
          'add_time': 1613186880
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        where: {
          type: '',
          customer_name: ''
        }
      },
      rules: {

      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      // 要进行深复制，不然传参格式与本页面的格式冲突
      const data = JSON.parse(JSON.stringify(this.listQuery))
      data.where = JSON.stringify(this.listQuery.where)
      getClientList(data).then(response => {
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
    addTime(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    goToCreateClient() {
      this.$router.push('/client/add')
    },
    gotoAddConsult(row) {
      this.$router.push({ path: '/client/list/add', query: { customer_guid: row.guid }})
    },
    gotoDetail(row) {
      this.$router.push({ path: '/client/list/detail/info/' + row.guid })
    },
    handleSend() {
      return 0
    },
    handleUpdate(row) {
      alert('编辑页面没有原型。')
      return 0
    },
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
  .client-list {
    margin: 20px 0;
  }
  .block {
    padding: 21px 0;
  }
</style>
