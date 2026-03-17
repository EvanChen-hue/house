# Housekeeping Admin (React + Ant Design)

学习测试小程序管理后台（演示版）：登录页、用户管理、服务管理（阿姨列表 + 新增/编辑弹窗 + 上架开关 + 照片上传）、首页收入统计大屏（ECharts）。

## Run

```bash
npm install
npm run dev
```

## API Mode

- 默认使用 Mock（本地持久化），便于纯前端演示
- 接后端时：设置环境变量 `VITE_USE_MOCK=0`，并按需设置 `VITE_API_BASE_URL`

## Structure

- `src/pages/*` 页面
- `src/layout/*` 后台整体布局
- `src/components/*` 可复用组件（含图表、表单弹窗）
- `src/api/*` API 封装（当前为 mockRequest）
- `src/mock/db.js` Mock 数据与本地持久化
- `src/assets/images/*` 图片资源目录
