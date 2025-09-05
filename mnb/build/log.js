import color from 'yoctocolors'

export default {
    app: {
        /** 为区别非内部日志，于是给“普通日志”也设置颜色 */
        inf: msg => console.log('\n' + color.blueBright(msg)),
        suc: msg => console.log('\n' + color.greenBright(msg)),
        err: msg => console.error('\n' + color.redBright(msg)),
    },
    mod: {
        inf: msg => console.log('\n' + color.blue(msg)),
        suc: msg => console.log('\n' + color.green(msg)),
        err: msg => console.error('\n' + color.red(msg)),
    }
}
