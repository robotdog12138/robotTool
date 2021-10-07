const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/dist/' : '/', // 根域上下文目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | error
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map'
        } else { // 生产环境配置
        }
    },
    devServer: {
        open: false, //自动启动浏览器
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false, //webpack已经默认开启，这里false
        proxy: { // 配置跨域
            '/api': {
                target: 'http://127.0.0.1:8080', //打包后接口地址
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => {}
    }
}