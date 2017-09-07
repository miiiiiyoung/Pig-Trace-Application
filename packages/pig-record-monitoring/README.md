# Blockchain - 돼지 이력 모니터링(Pig record monitoring)

Pig Process 프로그램은 각 돼지에 따른 트랜잭션 결과를 출력하는 프로그램입니다.
웹 브라우저의 `http://172.16.25.78:6200/`에 접속하면 화면이 출력됩니다.

프로그램 실행을 위해 REST API SERVER와 Node-RED가 실행되어있어야 합니다.(vehicle-lifecycle 프로그램의 README.md 파일 참고)

## 앱 의존성(App Dependencies)

NodeJS를 설치한 다음 npm을 사용하여 bower를 설치합니다.

```linux-config
cd /opt/gopath/src/github.com/hyperledger/Pig-Trace-Application/packages/pig-record-monitoring
npm install
npm install -g bower
```

## 프로그램 실행 세팅(Setting up the App)

git clone 명령 행이나 터미널의 관련 디렉토리로 이동한 다음 명령을 실행하십시오.

```linux-config
bower install
```

이것은 필요한 모든 의존성을 다운로드합니다.

## 프로그램 실행(Run the App)

```linux-config
npm start
```

## 구성(Configuration)

프로그램 구성은 `config/default.json` 파일에서 확인할 수 있습니다.