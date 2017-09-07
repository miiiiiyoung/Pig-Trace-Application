# Blockchain - 돼지 등록(Pig enrollment)

돼지 고기 이력 데모 프로그램은 돼지 고기의 출생부터 도축, 포장, 판매까지의 각 단계를 처리하고 조회할 수 있습니다.
출생 : 농장에서 태어난 돼지를 등록합니다. (POST /Pig) - Asset
도축 : 등록된 돼지를 도축합니다. (POST /Process) - Transaction
포장 : 도축된 돼지를 포장합니다. (POST /Process) - Transaction
판매 : 포장된 돼지를 판매합니다. (POST / Process) - Transaction

Ionic 프레임워크를 사용해 만들어졌습니다.
프로그램 실행을 위해 REST API SERVER와 Node-RED가 실행되어있어야 합니다.(vehicle-lifecycle 프로그램의 README.md 파일 참고)

웹 브라우저의 `http://172.16.25.78:8200/`에 접속하면 화면이 출력됩니다.

## 앱 의존성(App Dependencies)

Ionic과 Cordova 설치:

```linux-config
npm install
npm install -g ionic cordova
```

## 프로그램 실행(Run the app)

프로그램 빌드:

```linux-config
npm run build
```

프로그램 실행:
    
```linux-config
npm start
```

## 구성(Configuration)

프로그램 구성은 `config/default.json` 파일에서 확인할 수 있습니다.
