import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { StatusPage } from '../status/status';
import { Http, Response } from '@angular/http';

/**
 * Generated class for the PackagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-package',
  templateUrl: 'package.html'
})
export class PackagePage {
  states: any;    // 옵션값(등급, 도축검사)
  selected: string;
  ready: Promise<any>;
  websocket: WebSocket;
  config: any;

  memberId: any;    // 로그인 memberId
  memberName: any;    // 로그인 memberName
  myDate;   // 매입일자 date-picker
  // @ViewChild('focusInput') myWeight;   // 중량 input 박스
  myWeight;   // 중량 input 박스
  myPigId;    // 검색 이력번호
  pigOwnerId: any;   // 돼지 소유주(Butchery)의 Id
  pigOwnerName: any;   // 돼지 소유주(Butchery)의 Name
  pigBirthDate: any;    // 돼지 출생 일자
  baseUrl = "http://172.16.25.78:3000/api/";

  constructor(private navController: NavController, private navParams: NavParams, private http: Http) {

    this.states = {};

    // 로그인한 memberId 값 파라매터로 전달받음
    this.memberId = navParams.get('memberId');
    console.log("memberId : " + this.memberId);

    // 매입 일자 date-picker의 default 값을 현재 일자로 설정
    this.myDate = new Date().toISOString();
    console.log("myDate : " + this.myDate);

    // 웹 소켓과의 통신 연결(processpig)
    this.ready = this.loadConfig()
      .then((config) => {
        this.config = config;
        console.log('Config loaded:',this.config)
        var webSocketURL;
        if (this.config.useLocalWS){
          webSocketURL = 'ws://' + location.host + '/ws/processpig';
        } else {
          webSocketURL = this.config.nodeRedBaseURL+'/ws/processpig';
        }
        console.log('connecting websocket', webSocketURL);
        this.websocket = new WebSocket(webSocketURL);

        this.websocket.onopen = function () {
          console.log('websocket open!');
        };

      });

    // memberName에 getMember로 불러온 memberName 저장
    this.ready = this.getMember(this.memberId)
      .then((config) => {
        this.config = config;
        console.log('Config loaded:',this.config);
        this.memberName = config.memberName;
        console.log('memberName:',this.memberName);
      });
  }

  // 로그인 한 memberId로 Member 참여자의 정보 GET
  getMember(memberId): Promise<any>{
    var getUrl = this.baseUrl + "Member/" + memberId;
    console.log("getMemberUrl : " + getUrl);
    return this.http.get(getUrl)
      .map((res: Response) => res.json())
      .toPromise();
  }

  getPig(): Promise<any>{
    var getUrl = this.baseUrl + "Pig/" + this.myPigId;
    console.log("getPigUrl : " + getUrl);
    return this.http.get(getUrl)
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

  // 선택한 옵션 값 저장
  select(option, state) {
    if (this.states[option] === state) {
      delete this.states[option];
    } else {
      this.states[option] = state;
      console.log("state["+option+"] : " + state)
    }
  }

  // 포장 신고(POST /Process)
  package() {

    // 입력값 체크
    if(!this.states.grade) {
      this.open('grade');
      alert("'포장 단위' 항목을 선택하세요!");
      return;
    }/*else if(!this.myWeight) {
      this.myWeight.setFocus();
      alert("'중량' 항목을 입력하세요!");
      return;
    }*/

    var process = {
      $class: 'org.acme.mynetwork.Process',
      pig: this.myPigId,
      newOwner: this.memberId,
      purchaseDate: this.myDate.substring(0,10),
      grade: this.states.grade,
      purchaseName: this.memberName,
      weight: this.myWeight
    };

    this.ready.then(() => {
      this.websocket.send(JSON.stringify(process));
      console.log("Process : " + process);
      alert("포장 신고가 완료되었습니다!\n이력번호 : " + this.myPigId);
    });
  }

  // 이력 번호 검색 버튼 클릭
  search() {
    var pigId = this.myPigId;
    console.log("Search pigId : " + pigId);

    // 입력한 pigId로 불러온 pig 정보 저장
    this.ready = this.getPig()
      .then((config) => {
        this.config = config;
        console.log('Config loaded:',this.config);
        this.pigOwnerId = config.owner.substring(35);
        console.log('pigOwnerId:',this.pigOwnerId);
        this.pigBirthDate = config.birthDate;
        console.log('pigBirthDate:',this.pigBirthDate);

        // 불러온 pig의 owner id로 memberName 받아옴
        this.ready = this.getMember(this.pigOwnerId)
          .then((config) => {
            this.config = config;
            console.log('Config loaded:',this.config);
            this.pigOwnerName = config.memberName;
            console.log('pigOwnerName:',this.pigOwnerName);
          });
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
