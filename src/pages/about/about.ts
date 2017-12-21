import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import { Media, MediaObject } from '@ionic-native/media';
import { MediaCapture } from '@ionic-native/media-capture';
import { VideoPlayer,VideoOptions } from '@ionic-native/video-player';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public fileTransfer:FileTransferObject;
  public path:any;
  public imgs:Array<string>;
  interval:any;
  constructor(private videoPlayer: VideoPlayer,private mediaCapture:MediaCapture,private media: Media,private imagePicker:ImagePicker,private camera: Camera,public navCtrl: NavController,private transfer: FileTransfer, private file: File) {
    this.fileTransfer = transfer.create();
  }


  /**
   * 选择照片
   */
  PhotoPick(){
    const options:ImagePickerOptions ={
      maximumImagesCount:5,
      quality:90,
      outputType :0
    };
      this.imgs = new Array<string>();
      this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        alert(results[i]);
       this.imgs.push(results[i]);
      }
    }, (err) => { });
  }


  /**
   * 拍照
   */
  takePhoto(){

      const options: CameraOptions = {
        quality: 70,                                                   //相片质量 0 -100
        destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,                                       //是否保存到相册
        // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,

      }

      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.path = base64Image;
      }, (err) => { });

    }

  /**
   * 录音
   * @type {number}
   */
    n:any = 0;
  recordSound(recinfo:any){
      alert(this.file.externalApplicationStorageDirectory+'my_file.m4a');
      this.file.createFile(this.file.externalApplicationStorageDirectory, 'my_file.m4a', true).then(() => {
       let ul = this.file.externalApplicationStorageDirectory.replace(/^file:\/\//, '') + 'my_file.m4a';
        alert(ul);
      let file = this.media.create(ul);
      file.startRecord();
      this.n = 0;
        this.interval=setInterval(() => {
          this.rec(recinfo,file)
        }, 1000);
    });
  }


  rec(recinfo,file){
      this.n++;
      //alert(this.n);
      recinfo.innerText = "正在录音 "+ this.n+"秒";
      if(this.n>=10){
        file.stopRecord();
        clearInterval(this.interval);
        recinfo.innerText = "录音 "+ this.n+"秒,已结束";
        return;
      }
  }


  /**
   * 播放录音
   * @param recinfo
   */
  playSound(recinfo:any) {
    alert("");

    let mobj:MediaObject = this.media.create(this.file.externalApplicationStorageDirectory+'my_file.m4a');
    mobj.play({numberOfLoops:1});


    let n = 0;
    this.interval=setInterval(() => {
      n++;
      recinfo.innerText = "正在播放："+ n;
      if(n>=mobj.getDuration()){
        recinfo.innerText = "播放结束";
      }
    }, 1000);

  }

  /**
   * 视频拍摄
   * @param url
   * @param vdo
   */
  captureVideo(url:any,vdo:any) {
    var options = { limit: 1, duration: 60 };

    this.mediaCapture.captureVideo(options).then(function(videoData) {


      alert(JSON.stringify(videoData,null,4));

      let a = videoData[0];
      alert(JSON.stringify(a,null,4));
      alert(a.localURL);
      let ss = a.localURL;
      url.value = ss;
      vdo.src = ss ;
      /**
       * @return
       * [
       {
           "name": "VID_20161227_153633.mp4",
           "localURL": "cdvfile://localhost/persistent/DCIM/Camera/VID_20161227_153633.mp4",
           "type": "video/mp4",
           "lastModified": null,
           "lastModifiedDate": 1482824196000,
           "size": 5671730,
           "start": 0,
           "end": 0,
           "fullPath": "file:///storage/sdcard0/DCIM/Camera/VID_20161227_153633.mp4"
       }
       ]
       */
    }, function(err) {
      // An error occurred. Show a message to the user
    });



  }



  //播放视频
  playVideo(url:any){
    alert(url.value);
    let options:VideoOptions={
      volume:50
    }
    this.videoPlayer.play(url.value,options).then(() => {
      alert('video completed');
    }).catch(err => {
      alert(JSON.stringify(err,null,4));
    });
  }























  upload() {
    let options: FileUploadOptions = {

      fileKey: 'file',
      fileName: 'name.jpg',   //文件名称
      headers: {},
      params: {
        maxSize: 50000000
      }
    };



    this.fileTransfer.upload(this.path, 'http://192.168.2.67:8088/AuthorityManageSystem/upload', options)
      .then((data) => {
        alert("上传成功");
      }, (err) => {
        alert(JSON.stringify(err,null,4));
      });
  }



  download() {
    const url = 'http://192.168.2.67:8088/AuthorityManageSystem/download?fileName=name.jpg';
    const target = this.file.externalApplicationStorageDirectory + 'download.png';
    this.fileTransfer.download(url,target).then((entry) => {
      alert(entry.toURL());
      this.path = entry.toURL();
       alert("下载成功11");
    }, (err) => {
      alert(JSON.stringify(err,null,4));
    });
  }







 }
