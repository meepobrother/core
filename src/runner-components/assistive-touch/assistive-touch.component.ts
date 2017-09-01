import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RunnerUtilService} from "../runner-util.service";
import {Router} from "@angular/router";
declare const require;
let store = require('store');
declare const weui;
let toast = weui.toast;
let actionSheet = weui.actionSheet;

import { CoreUtilService } from '../../meepo-core/core-util.service';
@Component({
  selector: 'suyun-assistive-touch',
  templateUrl: './assistive-touch.component.html',
  styleUrls: ['./assistive-touch.component.scss']
})
export class AssistiveTouchComponent implements OnInit {
  @ViewChild('container') container: ElementRef;

  open: boolean = false;
  items: any[] = []
  constructor(
    public util: RunnerUtilService,
    public router: Router,
    public core: CoreUtilService
  ) {
    this.items = []
  }

  onClick(){
    this.open = !this.open;
  }

  openThemes(){
    this.showTemplate = !this.showTemplate
  }

  showTemplate: boolean = false;

  ngOnInit() {
    this.getMenu();
    setTimeout(()=>{
      if(this.util.isAdmin || this.util.isManager){
        if(this.util.isAdmin){
          this.items.push({
            title: '升级',
            icon: 'update',
            link: ['/cloud/download']
          })
        }
        this.items.push({
          title: '装修',
          icon: 'design-icon  ',
          call: ()=>{
            if(this.util.edit){
              this.util.hideAdmin()
            }else{
              this.util.showAdmin()
            }
          }
        })
        this.items.push({
          title: '主题',
          icon: 'themes-icon',
          call: ()=>{
            this.showTemplate = !this.showTemplate;
            this.open = false;
          }
        })
        this.items.push({
          title: '管理',
          icon: 'shops-icon ',
          link: ['/admin/index']
        })
      }
    },1000)
    
    window['requirejs']([
      window['module_url'] + "./assets/bower_components/alloytouch/alloy_touch.js",
      window['module_url'] + "./assets/bower_components/alloytouch/transformjs/transform.js",
    ],()=>{
      let box = this.container.nativeElement;
      window['Transform'](box);
      new window['AlloyTouch']({
        touch: box,
        pressMove: (evt)=>{
          box['translateX'] += evt.deltaX;
          box['translateY'] += evt.deltaY;
        }
      })
    })

    // SystemJS.import(window['module_url']+'assets/bower_components/alloylever/alloy-lever.js').then((AlloyLever)=>{
    //   console.log('AlloyLever',AlloyLever)
    // })
    
    // AlloyLever.config({
    //     cdn:'//s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',  //vconsole的CDN地址
    //     reportUrl: "//a.qq.com",  //错误上报地址
    //     reportPrefix: 'qun',    //错误上报msg前缀，一般用于标识业务类型
    //     reportKey: 'msg',        //错误上报msg前缀的key，用户上报系统接收存储msg
    //     otherReport: {              //需要上报的其他信息
    //         uin: 491862102
    //     },
    //     entry:"#entry"          //请点击这个DOM元素6次召唤vConsole。//你可以通过AlloyLever.entry('#entry2')设置多个机关入口召唤神龙
    // })
  }
  showLoading: boolean = false;
  modules: any[] = []

  getMenu(){
    this.showLoading = true;
    this.core.post('cloud.modules',{}).subscribe(res=>{
      if(res.code == 1){
        this.modules = res.info;
        this.modules.map(res=>{
          if(res['assistive']){
            res['assistive'].map(r=>{
              this.items.push(r)
            })
          }
        })
        this.items.push({
          title: '清空缓存',
          icon: 'clear-icon',
          call: ()=>{
            store.clearAll()
            toast('操作成功');
          }
        })
        this.showLoading = false;
      }
    })
  }


  add(){
    this.router.navigate(['/cloud/index'])
  }
  onKefu(){
    this.router.navigate(['/charts/index'])
  }

  go(item: any){
    this.open = !this.open;
    item.call ? item.call() : this.router.navigate(item.link)
  }

}
