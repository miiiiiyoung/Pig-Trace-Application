# Blockchain - 돼지 블록체인 모니터링(Pig blockchain monitoring)

Pig Trade Applicaion 프로그램은 트랜잭션의 결과를 체인 형식으로 연결시켜 출력하고, 각각의 데이터를 확인할 수 있는 프로그램입니다.

프로그램 실행을 위해 REST API SERVER와 Node-RED가 실행되어있어야 합니다.(pig-lifecycle 프로그램의 README.md 파일 참고)

## 앱 의존성(App Dependencies)

NodeJS를 설치한 다음 npm을 사용하여 bower를 설치합니다.

```linux-config
npm install -g bower
```

## 프로그램 실행 세팅(Setting up the App)

git cloned 명령 행이나 터미널의 관련 디렉토리로 이동한 다음 명령을 실행하십시오.

```linux-config
npm install
bower install
```

이것은 필요한 모든 의존성을 다운로드합니다.

## 프로그램 실행(Run the App)

```linux-config
npm start
```

## 구성(Configuration)

프로그램 구성은 `config/default.json` 파일에서 확인할 수 있습니다.