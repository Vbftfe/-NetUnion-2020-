const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const body = require('koa-body');
const cors = require('koa-cors');
const fs = require('fs');
const path = require('path');
const sendEmail = require('./email.js');

let uploadFilePath; // 存储接收到的上传文件的本地路径

app.use(body({
  multipart: true, //这里补充一点，如果不加multipart：true ctx.request.body会获取不到值
  Formidable: {
    maxFileSize: 20010241024
  }
}))

app.use(cors())

router.post('/file', async (ctx) => {

  // 上传单个文件 
  // console.log(ctx.request.files.file)
  // return ctx.body = 'success';
  const file = ctx.request.files.file;
  // 获取上传文件 
  // 创建可读流 
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, './upload') + `\\${file.name}`;
  // 创建可写流 
  const upStream = fs.createWriteStream(filePath);
  console.log(filePath);
  // 可读流通过管道写入可写流 
  reader.pipe(upStream);
  uploadFilePath = filePath;
  return ctx.body = "上传成功";
})

router.post('/loginMess', async (ctx) => {
  if (uploadFilePath) {
    sendEmail(ctx.request.body, uploadFilePath);
  } else {
    sendEmail(ctx.request.body);
  }
  uploadFilePath = '';
  console.log(ctx.request.body);
  return ctx.body = 'success';
})

app.use(router.routes());

app.listen(3000);
console.log('curl -i http://localhost:3000/file -d "name=test"');