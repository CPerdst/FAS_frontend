<script setup>

import {computed, onMounted, onUnmounted, reactive, ref, toRaw} from "vue";
import {
  FETCH_SAMPLE_REPORT_URL,
  SAMPLE_REPORT_VIEW_REACTIVE_PROPS
} from "../../utils/constant";
import {
  addPropsToJsonPanel, getDatetimeByArrayTimeFormat, getKBFormatedSize, getMBFormatedSize,
} from "../../utils/common_utils";
import apiClient from "../../utils/asiox_instance";

/**
 * SampleInfoList: 样本信息列表
 *
 */
const sampleReportViewData = reactive({
  sampleInfoList: computed(() => {
    return SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportTableProps.tableData.map((item) => {
      console.log(item);
      return {
        id: item.id,
        fileMd5: item.fileMd5,
        pdfPath: item.pdfPath,
        pdfSize: getKBFormatedSize(item.pdfSize),
        pdfCreateTime: getDatetimeByArrayTimeFormat(item.pdfCreateTime)
      }
    });
  }),
  reportTableColProps: computed(() => {return SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportTableProps.tableCol;}),
  reportOtherTableProps: computed(() => {return SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportTableProps.otherTableProps}),
  // 分页计算属性
  sampleReportFooterProps: computed(() => {return SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportFooterProps}),
  intervalId: null,
});

async function fetchSampleInfoList() {
  const response = await apiClient.get(FETCH_SAMPLE_REPORT_URL,
      {params: {
        pageNum: SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportFooterProps.paginationProps.pageNum,
        pageSize: SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportFooterProps.paginationProps.pageSize
      }}
  )
  // 更新 SAMPLE_REPORT_TABLE_PROPS.data
  SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportFooterProps.paginationProps.totalPages = response.data.data.total;
  SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportFooterProps.paginationProps.pageNum = response.data.data.pageNum;
  SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportFooterProps.paginationProps.pageSize = response.data.data.pageSize;
  SAMPLE_REPORT_VIEW_REACTIVE_PROPS.sampleReportTableProps.tableData = response.data.data.list;
}

function handleSizeChange(size) {
  console.log(size);
  fetchSampleInfoList();
}

onMounted(() => {
  // 首先获取一次样本信息列表
  fetchSampleInfoList();
  // 每5秒更新一次样本信息列表
  sampleReportViewData.intervalId = setInterval(() => {
    // 获取样本信息列表
    fetchSampleInfoList();
  }, 5000);

  // 添加样本信息列表到json面板
  addPropsToJsonPanel('sampleReportViewData', computed(() => SAMPLE_REPORT_VIEW_REACTIVE_PROPS));
});

onUnmounted(() => {
  // 删除fetch定时器
  clearInterval(sampleReportViewData.intervalId);
});

</script>

<template>
  <div class="enhanced-report-view">
    <el-card>
      <template #header>
        <div>
          <span class="card-header-title">样本信息列表</span>
        </div>
      </template>
      <el-table :data="sampleReportViewData.sampleInfoList" :row-key="row => row.id" v-bind="sampleReportViewData.reportOtherTableProps">
        <template v-for="(item, index) of sampleReportViewData.reportTableColProps">
          <el-table-column :prop="item.prop" :label="item.label" v-bind="item.otherProps">
            <template v-if="item.render" #default="scope">
              <component :is="item.render(scope)"/>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <template #footer>
        <div class="card-footer-pagination" style="height: 200px">
          <el-pagination
              background
              layout="prev, pager, next"
              size="small"
              :total="sampleReportViewData.sampleReportFooterProps.paginationProps.totalPages"
              :page-size="sampleReportViewData.sampleReportFooterProps.paginationProps.pageSize"
              v-model:current-page="sampleReportViewData.sampleReportFooterProps.paginationProps.pageNum"
              @current-change="handleSizeChange"
          />
<!--          <span class="card-footer-title">样本信息列表</span>-->
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
@use '../../assets/css/sample-report-view';
</style>