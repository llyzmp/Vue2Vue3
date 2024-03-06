// 处理打包脚本命令
const minimist = require('minimist')
const { build } = require('esbuild')
const { resolve } = require('path')
// 拿到reactivity -f global
const args = minimist(process.argv.slice(2))

// 要对哪个子项目进行打包
const target = args._[0] || 'reactivity'
// 指定打包之后的格式
const f = args.f || 'global'

build({
  // 入口
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  // 输出文件
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.${f}.js`),
  bundle: true,
  sourcemap: true,
  // IIFE 在创建时立即执行
  format: f.startsWith('global') ? 'iife' : f === 'cjs' ? 'cjs' : 'esm',
  // 打包后的全局名字
  globalName: resolve(__dirname, `../packages${target}/package.json`).buildOptions?.name,
  // 运行平台
  platform: f === 'cjs' ? 'node' : 'browser',
  // watch: {
  //   onRebuild(error, result) {
  //     if (error) console.error('watch build failed:', error)
  //     else console.log('watch build succeeded:', result)
  //   },
  // },
}).then(() => {
  console.log('初始编译成功，监听中...');
})