import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  states: any;    // 옵션값(등급, 도축검사)
  selected: string;
  ready: Promise<any>;
  websocket: WebSocket;
  config: any;

  myPigId;    // 검색 이력번호

  pigId: any;   // 이력번호
  pigBirthDate: any;    // 돼지 출생 일자
  pigKind: any;    //종류
  pigOwnerId: any;   // 돼지 소유주(Farmer)의 Id
  pigOwnerName: any;   // 돼지 소유주(Farmer)의 Name
  grade: any;

  private allAssets;
  // private asset;
  // private currentId;
	private errorMessage;

  baseUrl = "http://172.16.25.78:3000/api/";

  constructor(private navController: NavController, private navParams: NavParams, private http: Http) {

    this.states = {};


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

  }

  // data GET
  getData(subUrl): Promise<any>{
    var getUrl = this.baseUrl + subUrl;
    console.log("getUrl : " + getUrl);
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

  // 이력 번호 검색 버튼 클릭
  search() {
    var pigId = this.myPigId;
    console.log("Search pigId : " + pigId);

    // 입력한 pigId로 불러온 pig 정보 저장
    this.ready = this.getData("Pig/" + this.myPigId)
      .then((config) => {
        this.config = config;
        console.log('Config loaded:',this.config);
        this.pigId = config.pigId;
        console.log('pigId:',this.pigId);
        this.pigKind = config.kind;
        console.log('pigKind:',this.pigKind);
        this.pigOwnerId = config.owner.substring(35);
        console.log('pigOwnerId:',this.pigOwnerId);
        this.pigBirthDate = config.birthDate;
        console.log('pigBirthDate:',this.pigBirthDate);
      });

    this.loadAll();
  }

  // 트랜잭션 데이터 가져오기
  loadAll(): Promise<any> {
    let tempList = [];
    return this.getData("system/transactions")
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        if(asset.pig.substring(32) == this.myPigId){
          if(asset.newOwner.substring(35) == 'BUTCHERY'){
            asset.ownerName = "도축";
            asset.gradeName = "등급";
          }else if(asset.newOwner.substring(35) == 'PACKAGE'){
            asset.ownerName = "포장";
            asset.gradeName = "포장단위";
          }else if(asset.newOwner.substring(35) == 'RETAILER'){
            asset.ownerName = "판매";
            asset.gradeName = "판매단위";
          }
          tempList.push(asset);
          console.log("add.pig: " + asset.pig.substring(32));
        }

        // timestamp 필드를 기준으로 데이터 정렬
        tempList.sort((a, b) => {
          if (a.timestamp < b.timestamp) { return -1; }
          else if (a.timestamp > b.timestamp) { return 1; } 
          else { return 0; }
        });
        
    });
    
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
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
