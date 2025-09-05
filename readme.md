# 第一版计划
目标：测试功能，不考虑用户体验

需求：input text -> synthesize by Polly -> play in browser
+ 只输入一条 text
+ 先姑且把 access key 写在 code 里
+ 千里之行，迈出第一步

## 逃离 JS
使用 elm 的一大原因，就是要逃离 js 混乱的构建生态，所以应禁止引入任何：
+ ts
+ 打包工具

如果非要用到 js，就用最普通的 js，写在 `/asset/js` 文件夹里，在 html 里通过 `<script>` 标签引入

慎用 custom element，优先考虑 port
