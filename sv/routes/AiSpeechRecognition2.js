var express=require('express');
var router=express.Router();
var fs=require('fs');
var Multiparty =require('multiparty');
var ffmpeg=require('fluent-ffmpeg');//创建一个ffmpeg命令
//ffmpeg.setFfmpegPath('D:\\ffmpeg\\bin\\ffmpeg.exe');
var AipSpeechServer=require('baidu-aip-sdk').speech;



//设置appid/appkey/appsecret
var APP_ID = "14823408";
var API_KEY = "8DC3DiBAdfL89cOmnpdcrbvT";
var SECRET_KEY = "uD5B0132Pv1LgS2WxARSotKy2rk4Ny8o";

// 新建一个对象，建议只保存一个对象调用服务接口
var client =new AipSpeechServer(APP_ID, API_KEY, SECRET_KEY);

router.post('/recognition', function(req, res, next){
  //生成multiparty对象，并配置上传目标路径
  var form =new Multiparty.Form({ uploadDir: './public/audio'});
  //上传完成后处理
  form.parse(req, function(err, fields, files){
    var filesTemp=JSON.stringify(files, null, 2);

    if(err){
      console.log('parse error: '+err);
      res.json({
        ret: -1,
        data:{
          
        },
        msg: '未知错误'
      });
    }else{
      //console.log('parse files: '+filesTemp);
      var inputFile=files.file[0];
      var uploadedPath=inputFile.path;
      console.log('parse files: '+uploadedPath);
      var dstPath='./public/audio/recognition.mp3'; //+inputFile.originalFilename;
      var wavToPcm='./public/audio/11.wav';
      var command=ffmpeg();
      command.addInput(uploadedPath)
      //.withAudioCodec('pcm_s16le')//设置音频编码器
      // .withAudioBitrate('48k')//设置音频比特率 - 参照小程序的16000采样率的编码码率
      .withAudioChannels(1)//设置音频通道数 - 参考小程序
      //.saveToFile('./public/audio/222.wav')//保存编码文件到文件夹 --保存成wav是可以的，但是pcm报错
      .saveToFile('./public/audio/16k.wav')
      .on('error', function(err){
        console.log('mp3 to pcm error');
        console.log(err)
      })
      .on('end', function(){
        console.log('processiong finish');
        //调用百度语音合成接口
        var voice = fs.readFileSync('./public/audio/16k.wav');
        var voiceBuffer=new Buffer(voice);
        console.log(voiceBuffer)
        client.recognize(voiceBuffer, 'wav', 16000).then(function(result){
          console.log(result);
          var data=[];
          if(result.err_no===0){
            data=result.result;
          }
          res.json({
            ret: result.err_no,
            data: {
              data: data
            },
            msg: result.err_msg
          });
        }, function(err){
          console.log('baidu recognition err');
          console.log(err);
        });
        //语音识别 end

        //删除上传的文件
        fs.unlink(uploadedPath, function(err){
          if(err){
            console.log(uploadedPath+'文件删除失败');
            console.log(err);
          }else{
            console.log(uploadedPath+'文件删除成功');
          }
        });
        fs.unlink('./public/audio/16k.wav', function(err){
          if(err){
            console.log('16k.wav文件删除失败');
            console.log(err);
          }else{
            console.log('16k.wav文件删除成功');
          }
        });
      })
      ;
      
      //重命名为真实文件名
      // fs.rename(uploadedPath, dstPath, function(err){
      //   if(err){
      //     console.log('rename error: '+err);
      //     res.json({
      //       ret: -1,
      //       data:{
              
      //       },
      //       msg: '参数异常'
      //     });
      //   }else{
      //     console.log('rename ok');
      //     res.json({
      //       ret: 0,
      //       data:{
      //         path: 'http://127.0.0.1:3000/audio/recognition.mp3'
      //       },
      //       msg: 'ok'
      //     });
      //   }
      // });
    }
  });
});

module.exports=router;