/*
 * @Description: 
 * @Author: tiange
 * @Date: 2020-06-24 10:34:18
 * @LastEditTime: 2020-06-24 14:54:03
 * @LastEditors: tiange
 */
import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
}).$mount('#app')
