const emailjs = require('emailjs');
const fs = require('fs');
const client = new emailjs.SMTPClient({
  user: '13972480029@163.com',
  password: '填入自己邮箱的授权码',
  host: 'smtp.163.com',
  ssl: true,
});

function sendEmail(emailTxt, path) {
  /** 
   * @param emailTxt: 邮件的主题内容, js对象格式
   * @path path: 邮件附件的路径
   */
  let text = '';  // 将emailTxt对象转为格式字符串，转换后的字符串内容如下
  /*
    name1: value1,
    name2: value2,
    name3: value3
  */

  for (const key in emailTxt) {
    text += key + ': ' + emailTxt[key] + ',\n';
  }

  text = text.substring(0, text.length - 2)
  if (path) {
    let fileType = path.match(/\.\w+$/)[0].substring(1); // 获取文件类型
    client.send(
      {
        text,
        from: '13972480029@163.com',
        to: '13972480029@163.com',
        cc: 'else <else@your-email.com>',
        subject: 'testing emailjs',
        attachment: [
          {
            data: '<html>i <i>hope</i> this works!</html>',
            path,
            type: `application/${fileType}`,
            name: `attachment.${fileType}`
          },
        ],
      },
      (err, message) => {
        console.log(err || message);
      }
    );
  } else {
    client.send(
      {
        text,
        from: '13972480029@163.com',
        to: '13972480029@163.com',
        cc: 'else <else@your-email.com>',
        subject: 'testing emailjs'
      },
      (err, message) => {
        console.log(err || message);
      }
    );
  }
}

module.exports = sendEmail;