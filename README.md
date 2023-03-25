## Project setup
npm install
npm run serve

### cấu trúc thư mục
index.js : nơi import các thư viện css global.
main.js : nơi khai báo các package dùng global.
router.js : nơi chứa các path điều hướng component ở thư mục views.
App.vue : là component gốc dc render đầu tiên.
api : setup nơi chưa api để gọi, chia theo từng module.
assets: chứa tài nguyên và scss global.
components: chứa các component dùng chung hệ thống.
constants:
    +config.js : chưa các setup global đường dẫn và các state theme.
    +handling.js: chứa các hàm dùng chung cho hệ thống.
    +wfs.js: chưa các code liên quan đến TomCat,Map..
containers: chứa các component của layout hệ thống.
layouts: chứa các UI lớn hoặc các template.
locales: chứa các file ngôn ngữ.
store: nơi chứa state global chung cho tất cả.
data: chứa các dữ liệu bên dưới của phía client.
hooks: nơi chứa các hooks dùng chung hệ thống.
utils: chứa các function của template.
views: chứa các component và đường dẫn liên quan đến file router.js.
    app/category,function,../
            + module(npl,fire,monitor,gas..) : chứa theo từng dự án.
            + hooks : scoped chỉ dùng cho module đó.
            + component : scoped chỉ dùng cho module đó.