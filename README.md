# 프로젝트 설명

pig-trace-application은 돼지의 출생지부터 돼지고기로 판매되기까지의 과정을 이력으로 보여주고 실시간으로 이력을 추적할 수 있는 프로그램입니다.

1. pig-enrollment(돼지 등록) : 돼지 고기의 출생부터 도축, 포장, 판매까지의 각 단계를 처리하고 조회하는 프로그램입니다.
2. pig-record-monitoring(돼지 이력 모니터링) : Pig Process 프로그램은 각 돼지에 따른 트랜잭션 결과를 출력하는 프로그램입니다.
3. pig-blockchain-monitoring(돼지 블록체인 모니터링) : 트랜잭션의 결과를 체인 형식으로 연결시켜 출력하고, 각각의 데이터를 확인할 수 있는 프로그램입니다.

# 실행하기

## 개발 환경설정

### fabric-tools 다운로드

```linux-config
cd /opt/gopath/src/github.com/hyperledger
mkdir fabric-tools && cd fabric-tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
tar -zxvf fabric-dev-servers.tar.gz
sudo rm -rf fabric-dev-servers.tar.gz
export FABRIC_VERSION=hlfv1
./downloadFabric.sh
./startFabric.sh
./createComposerProfile.sh
```


### Hyperledger Composer 다운로드

```linux-config
cd /opt/gopath/src/github.com/hyperledger
mkdir hyperledgercomposer && cd hyperledgercomposer
curl -O https://raw.githubusercontent.com/hyperledger/composer-sample-applications/master/packages/getting-started/scripts/prereqs-ubuntu.sh
chmod u+x prereqs-ubuntu.sh
```

### Hyperledger Composer 개발 도구 설치

```linux-config
sudo npm install -g composer-cli
sudo npm install -g generator-hyperledger-composer
sudo npm install -g composer-rest-server
```


## REST API SERVER 실행

### Installation

다음과 같은 명령어로 REST API를 실행합니다.
```linux-config
# 실행중인 컨테이너 모두 종료
docker kill $(docker ps -q)

# 종료된 컨테이너 모두 삭제
docker rm $(docker ps -aq) -f

# 패브릭 실행
cd /opt/gopath/src/github.com/hyperledger/fabric-tools && ./startFabric.sh

# 실행중인 하이퍼레저 패브릭에 bna 파일 배포
cd /opt/gopath/src/github.com/hyperledger/Pig-Trace-Application/packages/pig-lifecycle/installers/hlfv1 && sudo composer network deploy -a org-acme-biznet.bna -p hlfv1 -i PeerAdmin -s randomString

# REST API를 생성 및 실행
cd /opt/gopath/src/github.com/hyperledger/Pig-Trace-Application/packages/pig-lifecycle && sudo composer-rest-server -p hlfv1 -n org-acme-biznet -i admin -s adminpw -N never
```


## 샘플 Member 추가

REST API SERVER가 실행되면 브라우저의 `http://172.16.25.78:3000/explorer` 페이지로 접속해 다음과 같은 Member를 추가해줍니다. (POST /Member 요청 실행)

```json
[
{
  "$class": "org.acme.mynetwork.Member",
  "memberId": "FARMER",
  "memberName": "농심 농장",
  "memberFlag": "F"
},
{
  "$class": "org.acme.mynetwork.Member",
  "memberId": "BUTCHERY",
  "memberName": "도드람",
  "memberFlag": "B"
},
{
  "$class": "org.acme.mynetwork.Member",
  "memberId": "PACKAGE",
  "memberName": "농심 가공",
  "memberFlag": "P"
},
{
  "$class": "org.acme.mynetwork.Member",
  "memberId": "RETAILER",
  "memberName": "메가마트",
  "memberFlag": "R"
}
]
```

## Node-RED 실행

웹소켓과의 연결을 위해 Node-RED를 실행해야합니다.

### Node-RED 설치

다음 명령을 통해 `Node-RED`를 설치합니다.

```linux-config
sudo npm install -g --unsafe-perm node-red
sudo npm install -g node-red-contrib-composer@latest
```

### Node-RED 실행

Node-RED의 설치가 완료되면 다음 명령을 통해 Node-RED를 실행합니다.
```linux-config
sudo node-red
```

웹 브라우저의 `http://172.16.25.78:1880/`에 접속하면 다음과 같이 Node-RED가 실행됩니다.

### Node-RED Import Nodes

Node-RED 페이지 오른쪽 상단의 메뉴 버튼 클릭 후 `Import > Clipboard`를 클릭합니다.
다음 소스 코드를 통해 노드들을 추가합니다.

1. Main Flow

```json
[{"id":"1ed5d9e7.ea33e6","type":"inject","z":"561c9c6f.7ebdd4","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":true,"x":170,"y":560,"wires":[["2e8c1171.90ce4e"]]},{"id":"f31e8489.4ab7a8","type":"inject","z":"561c9c6f.7ebdd4","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":180,"y":602,"wires":[["518db4df.eb3f5c"]]},{"id":"8545e2ac.debad","type":"http request","z":"561c9c6f.7ebdd4","name":"setup demo","method":"POST","ret":"obj","url":"","tls":"","x":488,"y":602,"wires":[["444b349c.a8862c"]]},{"id":"444b349c.a8862c","type":"debug","z":"561c9c6f.7ebdd4","name":"","active":true,"console":"false","complete":"false","x":672,"y":602,"wires":[]},{"id":"518db4df.eb3f5c","type":"function","z":"561c9c6f.7ebdd4","name":"set msg.url","func":"msg.url = context.global.endpoint + '/SetupDemo';\nreturn msg;","outputs":1,"noerr":0,"x":327,"y":602,"wires":[["8545e2ac.debad"]]},{"id":"70c6e6bc.2e11c8","type":"inject","z":"561c9c6f.7ebdd4","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":179.5,"y":641,"wires":[["ed1dfc47.6d544"]]},{"id":"78c9f510.90a1bc","type":"http request","z":"561c9c6f.7ebdd4","name":"get orders","method":"GET","ret":"obj","url":"","tls":"","x":487.5,"y":641,"wires":[["7b487ae4.378c64"]]},{"id":"7b487ae4.378c64","type":"debug","z":"561c9c6f.7ebdd4","name":"","active":true,"console":"false","complete":"false","x":671.5,"y":641,"wires":[]},{"id":"ed1dfc47.6d544","type":"function","z":"561c9c6f.7ebdd4","name":"set msg.url","func":"msg.url = context.global.endpoint + '/Order';\nreturn msg;","outputs":1,"noerr":0,"x":326.5,"y":641,"wires":[["78c9f510.90a1bc"]]},{"id":"19cbfb4e.92f2d5","type":"inject","z":"561c9c6f.7ebdd4","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":179.5,"y":681,"wires":[["72323f95.27924"]]},{"id":"5fcd5160.ebdc4","type":"http request","z":"561c9c6f.7ebdd4","name":"get vehicles","method":"GET","ret":"obj","url":"","tls":"","x":487.5,"y":681,"wires":[["dcbb6aca.ca7278"]]},{"id":"dcbb6aca.ca7278","type":"debug","z":"561c9c6f.7ebdd4","name":"","active":true,"console":"false","complete":"false","x":671.5,"y":681,"wires":[]},{"id":"72323f95.27924","type":"function","z":"561c9c6f.7ebdd4","name":"set msg.url","func":"msg.url = context.global.endpoint + '/Vehicle';\nreturn msg;","outputs":1,"noerr":0,"x":326.5,"y":681,"wires":[["5fcd5160.ebdc4"]]},{"id":"b4a2ac4c.5049a","type":"inject","z":"561c9c6f.7ebdd4","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":178.5,"y":722,"wires":[["4867b3c2.1d003c"]]},{"id":"a1ac4fc6.67cd9","type":"http request","z":"561c9c6f.7ebdd4","name":"get transactions","method":"GET","ret":"obj","url":"","tls":"","x":496.5,"y":722,"wires":[["5365efb4.74d37"]]},{"id":"5365efb4.74d37","type":"debug","z":"561c9c6f.7ebdd4","name":"","active":true,"console":"false","complete":"false","x":670.5,"y":722,"wires":[]},{"id":"4867b3c2.1d003c","type":"function","z":"561c9c6f.7ebdd4","name":"set msg.url","func":"msg.url = context.global.endpoint + '/UpdateOrderStatus';\nreturn msg;","outputs":1,"noerr":0,"x":325.5,"y":722,"wires":[["a1ac4fc6.67cd9"]]},{"id":"4128fcf9.3194c4","type":"hyperledger-composer-in","z":"561c9c6f.7ebdd4","name":"receive event","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"whatever","actionType":"create","x":150,"y":420,"wires":[["efee163a.0321b8"]]},{"id":"e61be88c.4e7838","type":"function","z":"561c9c6f.7ebdd4","name":"REST API URL Configuration","func":"let something;\nif(msg.payload.trim()){\n    context.global.endpoint = msg.payload.trim();\n}\nelse{\n    context.global.endpoint = \"http://localhost:3000/api\";\n}\nconsole.log('What is context.global.endpoint?',context.global.endpoint);","outputs":1,"noerr":0,"x":736.5,"y":556,"wires":[[]]},{"id":"2e8c1171.90ce4e","type":"exec","z":"561c9c6f.7ebdd4","command":"echo $COMPOSER_BASE_URL","addpay":false,"append":"","useSpawn":"","timer":"","name":"Get REST API Environment Variable","x":403.5,"y":558.5,"wires":[["e61be88c.4e7838"],[],[]]},{"id":"762eb787.2cecb8","type":"websocket in","z":"561c9c6f.7ebdd4","name":"","server":"5d0c5e3e.04c06","client":"","x":160,"y":80,"wires":[["b43346fe.af37b8","3ce8b9a9.e41116"]]},{"id":"b43346fe.af37b8","type":"change","z":"561c9c6f.7ebdd4","name":"","rules":[{"t":"delete","p":"_session","pt":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":400,"y":80,"wires":[["a9cbb321.b9a6c"]]},{"id":"3ce8b9a9.e41116","type":"debug","z":"561c9c6f.7ebdd4","name":"reveived PlacePig socket msg","active":true,"console":"false","complete":"true","x":430,"y":160,"wires":[]},{"id":"a9cbb321.b9a6c","type":"switch","z":"561c9c6f.7ebdd4","name":"","property":"payload","propertyType":"msg","rules":[{"t":"eq","v":"__ping__","vt":"str"},{"t":"else"}],"checkall":"true","outputs":2,"x":590,"y":80,"wires":[["c4a2485.7ff98b8"],["39794747.89a928"]]},{"id":"c4a2485.7ff98b8","type":"function","z":"561c9c6f.7ebdd4","name":"pong","func":"msg.payload = '__pong__';\nreturn msg;","outputs":1,"noerr":0,"x":730,"y":60,"wires":[["d11ded0b.ca02c"]]},{"id":"39794747.89a928","type":"function","z":"561c9c6f.7ebdd4","name":"parse","func":"msg.payload = JSON.parse(msg.payload);\nmsg.url = context.global.endpoint + '/PlaceOrder'\nreturn msg;\n","outputs":1,"noerr":0,"x":729.1845550537109,"y":110.61310577392578,"wires":[["40430213.b68abc","993d4f57.cfb11"]]},{"id":"d11ded0b.ca02c","type":"websocket out","z":"561c9c6f.7ebdd4","name":"","server":"5d0c5e3e.04c06","client":"","x":910,"y":60,"wires":[]},{"id":"40430213.b68abc","type":"hyperledger-composer-out","z":"561c9c6f.7ebdd4","name":"submit placepig tx","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"PeerAdmin","actionType":"create","x":910,"y":100,"wires":[]},{"id":"993d4f57.cfb11","type":"debug","z":"561c9c6f.7ebdd4","name":"transaction payload","active":true,"console":"false","complete":"payload","x":920,"y":140,"wires":[]},{"id":"a9e10606.478f78","type":"websocket in","z":"561c9c6f.7ebdd4","name":"","server":"14923b88.084904","client":"","x":170,"y":260,"wires":[["50b51e8a.cc51c","8e73435.550cec"]]},{"id":"50b51e8a.cc51c","type":"change","z":"561c9c6f.7ebdd4","name":"","rules":[{"t":"delete","p":"_session","pt":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":400,"y":260,"wires":[["35228373.3e195c"]]},{"id":"8e73435.550cec","type":"debug","z":"561c9c6f.7ebdd4","name":"reveived ProcessPig socket msg","active":true,"console":"false","complete":"true","x":440,"y":340,"wires":[]},{"id":"35228373.3e195c","type":"switch","z":"561c9c6f.7ebdd4","name":"","property":"payload","propertyType":"msg","rules":[{"t":"eq","v":"__ping__","vt":"str"},{"t":"else"}],"checkall":"true","outputs":2,"x":590,"y":260,"wires":[["2ec37c0c.c93be4"],["e0009e91.cae87"]]},{"id":"2ec37c0c.c93be4","type":"function","z":"561c9c6f.7ebdd4","name":"pong","func":"msg.payload = '__pong__';\nreturn msg;","outputs":1,"noerr":0,"x":730,"y":240,"wires":[["4002c8f0.7d59b8"]]},{"id":"e0009e91.cae87","type":"function","z":"561c9c6f.7ebdd4","name":"parse","func":"msg.payload = JSON.parse(msg.payload);\nmsg.url = context.global.endpoint + '/Process'\nreturn msg;\n","outputs":1,"noerr":0,"x":729.1845550537109,"y":290.6131057739258,"wires":[["ae13646e.689178","b60ba247.dbf7d"]]},{"id":"4002c8f0.7d59b8","type":"websocket out","z":"561c9c6f.7ebdd4","name":"","server":"14923b88.084904","client":"","x":920,"y":240,"wires":[]},{"id":"ae13646e.689178","type":"hyperledger-composer-out","z":"561c9c6f.7ebdd4","name":"submit placepig tx","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"PeerAdmin","actionType":"create","x":910,"y":280,"wires":[]},{"id":"b60ba247.dbf7d","type":"debug","z":"561c9c6f.7ebdd4","name":"transaction payload","active":true,"console":"false","complete":"payload","x":920,"y":320,"wires":[]},{"id":"5dc3b5b4.16264c","type":"function","z":"561c9c6f.7ebdd4","name":"parse","func":"eventMsg = {};\neventMsg.payload = {};\neventMsg.payload.transactionId = msg.eventId.substr(0, msg.eventId.indexOf('#'));\neventMsg.payload.newOwner = msg.newOwner.memberId;\neventMsg.payload.pig = msg.pig.pigId;\neventMsg.payload.purchaseName = msg.purchaseName;\neventMsg.payload.purchaseDate = msg.purchaseDate;\neventMsg.payload.grade = msg.grade;\neventMsg.payload.passFlag = msg.passFlag;\neventMsg.payload.weight = msg.weight;\neventMsg.payload.timestamp = msg.timestamp;\nreturn eventMsg;","outputs":1,"noerr":0,"x":597,"y":420,"wires":[["d0fab70e.94da58","716f5ee3.91668"]]},{"id":"d0fab70e.94da58","type":"websocket out","z":"561c9c6f.7ebdd4","name":"","server":"14923b88.084904","client":"","x":947,"y":420,"wires":[]},{"id":"716f5ee3.91668","type":"debug","z":"561c9c6f.7ebdd4","name":"","active":true,"console":"false","complete":"payload","x":917,"y":480,"wires":[]},{"id":"efee163a.0321b8","type":"switch","z":"561c9c6f.7ebdd4","name":"","property":"$class","propertyType":"msg","rules":[{"t":"eq","v":"org.acme.mynetwork.ProcessEvent","vt":"str"}],"checkall":"false","outputs":1,"x":377,"y":420,"wires":[["5dc3b5b4.16264c"]]},{"id":"5d0c5e3e.04c06","type":"websocket-listener","z":"","path":"/ws/placepig","wholemsg":"false"},{"id":"14923b88.084904","type":"websocket-listener","z":"","path":"/ws/processpig","wholemsg":"false"}]
```

2. Query Flow

```json
[{"id":"5dbaea68.194554","type":"inject","z":"476dbc5c.81f0b4","name":"","topic":"","payload":"{\"$class\": \"org.vda.ScrapAllVehiclesByColour\", \"colour\":\"grey\"}","payloadType":"json","repeat":"","crontab":"","once":false,"x":183,"y":71,"wires":[["8271e43e.f0fe08"]]},{"id":"1118a1.a781875f","type":"debug","z":"476dbc5c.81f0b4","name":"","active":true,"console":"false","complete":"true","x":380,"y":150.25,"wires":[]},{"id":"8271e43e.f0fe08","type":"hyperledger-composer-out","z":"476dbc5c.81f0b4","name":"ScrapAllVehiclesByColour","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"whatever","actionType":"create","x":479,"y":70.75,"wires":[]},{"id":"9bcc7dac.abb2c","type":"hyperledger-composer-in","z":"476dbc5c.81f0b4","name":"EventReceived","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"whatever","actionType":"create","x":190,"y":149.75,"wires":[["1118a1.a781875f"]]}]
```