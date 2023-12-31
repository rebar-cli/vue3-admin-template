import { createApp } from 'vue';

import Cookies from 'js-cookie';

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 中文语言

import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/margin.scss';
import '@/assets/styles/padding.scss';

import App from './App';
import store from './store';
import router from './router';
import directive from './directive'; // directive

// 注册指令
import plugins from './plugins'; // plugins
import { download } from '@/utils/request';

// svg图标
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon';
import elementIcons from '@/components/SvgIcon/svgicon';


import './permission'; // permission control

import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi';

// 分页组件
import Pagination from '@/components/Pagination';
// 文件上传组件
import FileUpload from '@/components/FileUpload';
// 图片上传组件
import ImageUpload from '@/components/ImageUpload';
// 图片预览组件
import ImagePreview from '@/components/ImagePreview';

// echarts
import * as echarts from 'echarts';
import 'echarts-liquidfill';
// dayjs
import dayjs from 'dayjs';
import { rewriteElementPlusGlobalFunction } from './element-plus/global';

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$dayjs = dayjs;

// 全局组件挂载
app.component('SvgIcon', SvgIcon);
app.component('Pagination', Pagination);
// 以下组件暂时没有使用的需要，tree-shaking无法移除全局注册但没有使用的组件
// app.component('FileUpload', FileUpload);
// app.component('ImageUpload', ImageUpload);
// app.component('ImagePreview', ImagePreview);

app.use(router);
app.use(store);
app.use(plugins);
app.use(elementIcons);

directive(app);

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: zhCn,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
});
// 覆盖elementplus的部分全局方法
rewriteElementPlusGlobalFunction(app);

app.mount('#app');
