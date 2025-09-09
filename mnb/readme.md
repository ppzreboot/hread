## Start Dev
``` bash
deno run dev
```

## Principle
在做这样一个自动化流程时，
“考虑将来的变化”是必要的，但不能无边无际。
目前暂定为：`elm app` + `js port` + `lib(elm or js)`

mnb 模块应尽量不出现 js 源码（i.e. asset 里尽量不要有 js）。
如果非要出现，也要简单到“不需要用构建工具”才行，否则拆分出去。
