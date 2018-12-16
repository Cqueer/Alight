var express=require('express');
var router=express.Router();
var fs=require('fs');
var AipSpeechServer = require('baidu-aip-sdk').speech;

//设置appid/appkey/appsecret
var APP_ID = "14823408";
var API_KEY = "8DC3DiBAdfL89cOmnpdcrbvT";
var SECRET_KEY = "uD5B0132Pv1LgS2WxARSotKy2rk4Ny8o";

// 新建一个对象，建议只保存一个对象调用服务接口
var client =new AipSpeechServer(APP_ID, API_KEY, SECRET_KEY);

// 语音合成
// function doTextToAudio(text, params){
//   client.text2audio(
//     params.text || '哈哈，你好，百度语音合成测试',
//     {
//       //cuid: '机器 MAC 地址或 IMEI 码，长度为60以内',
//       spd: params.spd || '5',//音速
//       pit: params.pit || '5',//音调
//       vol: params.vol || '5',//音量
//       per: params.per || '1'//播音角色
//     }
//     )
//   .then(
//     function(res){
//       if(res.data){
//         console.log(res);
//         fs.writeFileSync(params.filePath || '/audio/tts.audio.mp3', res.data);
//       }else{
//         // 服务发生错误
//         console.log(res);
//       }
//     }, 
//     function(e){
//       // 发生网络错误
//       console.log(e);
//     }
//   );
// }

var text='日光岩，是鼓浪屿每天第一缕阳光照到的地方，俗称""岩仔山""，别名""晃岩""，相传1641年，郑成功来到晃岩，看到这里的景色胜过日本的日光山，便把""晃""字拆开，称之为""日光岩""。日光岩游览区由日光岩和琴园两个部分组成。日光岩耸峙于鼓浪屿中部偏南，是由两块巨石一竖一横相倚而立，成为龙头山的顶峰，海拔92.7米，为鼓浪屿最高峰，被称为“百米高台”。古往今来，鼓浪屿日光岩一直吸引着许多文人墨客，他们陶醉于这天风海涛中，吟诗作赋，留下不少珍贵的手迹。岩壁上方的摩崖石刻“鼓浪洞天”据今已有400多年的历史了。摩崖石刻下的是日光寺，原名莲花庵，厦门四大名庵之一，又称“一片瓦”，是一座精巧玲珑袖珍式的寺庙；因为每天凌晨，朝阳从厦门的五老峰后升起，莲花庵最先沐浴在阳光里，因此得名“日光寺”，此山也称“日光岩”。著名的弘一法师也曾经在日光岩住过几个月。进日光岩寺门之后，走少许几步，便是圆通之门。从这里上日光岩，不但路途好走，且省时间。如果你正好遇上一个晴空万里的好天气，登上了日光岩的顶峰，厦门的美景将会尽收眼底。从日光岩往下看，鼓浪屿像一艘彩船，停泊于万顷碧波之中，时浮时沉，波光闪烁。';
router.post('/speech', function(req, res, next){
  //console.log('./public/audio/');
  console.log(req.body);//用这种content-type=www-form-urlencoded才能获取到参数
  console.log(req.body.text.length);
  //return ;
  client.text2audio(
    req.body.text || '日光岩，是鼓浪屿每天第一缕阳光照到的地方，俗称"岩仔山"',
    {
      //cuid: '机器 MAC 地址或 IMEI 码，长度为60以内',
      spd: req.body.spd || '5',//音速
      pit: req.body.pit || '5',//音调
      vol: req.body.vol || '5',//音量
      per: req.body.per || '0'//播音角色
    }
  )
  .then(
    function(res1){
      if(res1.data){
        //console.log(res1);
        fs.writeFileSync(req.body.filePath || './public/audio/tts.audio.mp3', res1.data);

        res.json({
          ret: 0,
          data:{
            path: 'http://47.94.206,213:3000/audio/tts.audio.mp3'
          },
          msg: ''
        });

      }else{
        // 服务发生错误
        console.log(res1);
        res.json({
          ret: res1.err_no,
          data:{
          },
          msg: res1.err_msg
        });
      }
    }, 
    function(e){
      // 发生网络错误
      console.log(e);
      res.json({
        ret: -100,
        data:{
        },
        msg: '网络错误，请检查网络'
      });
    }
  );
});

module.exports=router;