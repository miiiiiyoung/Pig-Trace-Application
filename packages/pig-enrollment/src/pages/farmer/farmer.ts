import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { StatusPage } from '../status/status';
import { Http, Response } from '@angular/http';

/**
 * Generated class for the FarmerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-farmer',
  templateUrl: 'farmer.html'
})
export class FarmerPage {
  states: any;
  selected: string;
  ready: Promise<any>;
  websocket: WebSocket;
  config: any;

  memberId: any;
  memberName: any;
  baseUrl="http://172.16.25.78:3000/api/Member/"  // get 요청을 수행하기 위한 baseUrl
  pigId: any;
  pig: any;
  birthDate: any;
  myDate

  constructor(private navController: NavController, private navParams: NavParams, private http: Http) {

    // this.car = navParams.get('car');
    this.states = {};

    this.memberId = navParams.get('memberId');
    console.log("memberId : " + this.memberId);

    this.pigId = this.generateID();
    console.log("pigId : " + this.pigId);

    this.myDate = new Date().toISOString();
    console.log("myDate : " + this.myDate);

    // memberName에 getMember로 불러온 memberName 저장
    this.ready = this.getMember()
      .then((config) => {
        this.config = config;
        console.log('Config loaded:',this.config);
        this.memberName = config.memberName;
        console.log('memberName:',this.memberName);
      });

    // 웹 소켓과의 통신 연결
    this.ready = this.loadConfig()
      .then((config) => {
        this.config = config;
        console.log('Config loaded:',this.config)
        var webSocketURL;
        if (this.config.useLocalWS){
          webSocketURL = 'ws://' + location.host + '/ws/placepig';
        } else {
          webSocketURL = this.config.nodeRedBaseURL+'/ws/placepig';
        }
        console.log('connecting websocket', webSocketURL);
        this.websocket = new WebSocket(webSocketURL);

        this.websocket.onopen = function () {
          console.log('websocket open!');
        };

      });

  }

  // 로그인 한 memberId로 Member 참여자의 정보 GET
  getMember(): Promise<any>{
    console.log("getUrl : " + this.baseUrl + this.memberId);
    return this.http.get(this.baseUrl + this.memberId)
      .map((res: Response) => res.json())
      .toPromise();
  }

  loadConfig(): Promise<any> {
      // Load the config data.
      return this.http.get('/assets/config.json')
      .map((res: Response) => res.json())
      .toPromise();
  }


  open(option) {
    if (this.selected === option) {
      this.selected = null;
    } else {
      this.selected = option;
    }
  }

  select(option, state) {
    // 선택한 옵션 값 저장
    if (this.states[option] === state) {
      delete this.states[option];
    } else {
      this.states[option] = state;
      console.log("state["+option+"] : " + state);
    }
  }

  // 이력 번호 생성(현재 일자 + 현재 시간 : yyyymmddhhmmss)
  generateID() {
    var nowDate = new Date().toISOString();
    var date = nowDate.substring(0,4) + nowDate.substring(5,7) + nowDate.substring(8,10);
  
    var nowTime = new Date().toString();
    var time = nowTime.substring(16, 18) + nowTime.substring(19, 21) + nowTime.substring(22, 24);

    return date + time;

  }

  // 출생 신고(POST /Pig)
  purchase() {

    // 입력값 체크
    if(!this.states.kind) {
      this.open('kind');
      alert("'종류' 항목을 선택하세요!");
      return;
    }else if(!this.states.color) {
      this.open('color');
      alert("'색상' 항목을 선택하세요!");
      return;
    }else if(!this.states.sex) {
      this.open('sex');
      alert("'성별' 항목을 선택하세요!");
      return;
    }else if(!this.states.importType) {
      this.open('importType');
      alert("'수입 구분' 항목을 선택하세요!");
      return;
    }

    var pig = {
      $class: 'org.acme.mynetwork.Pig',
      pigId: this.pigId,
      birthDate: this.myDate.substring(0,10),
      kind: this.states.kind,
      color: this.states.color,
      sex: this.states.sex,
      importType: this.states.importType,
      owner: this.memberId
    };

    this.ready.then(() => {
      this.websocket.send(JSON.stringify(pig));
      console.log("Pig : " + pig);
      alert("출생 신고가 완료되었습니다!\n이력번호 : " + this.pigId);
    });
  }

  containsExtra(state) {
    if (this.states.extras) {
      return this.states.extras.indexOf(state) > -1;
    } else {
      return false;
    }
  }

  countExtras(num) {
    return this.states.extras && this.states.extras.length === num;
  }

/*
  getExtras() {
    if (!this.states.extras || this.states.extras.length === 0) {
      return '';
    } else if (this.states.extras.length === 1) {
      return this.states.extras[0];
    } else {
      return '2 selected';
    }
  }
*/
}
