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
cd /opt/gopath/src/github.com/hyperledger/pig-trace-application/packages/pig-lifecycle/installers/hlfv1 && sudo composer network deploy -a org-acme-biznet.bna -p hlfv1 -i PeerAdmin -s randomString

# REST API를 생성 및 실행
cd /opt/gopath/src/github.com/hyperledger/pig-trace-application/packages/pig-lifecycle && sudo composer-rest-server -p hlfv1 -n org-acme-biznet -i admin -s adminpw -N never
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
[{"id":"5ab0541e.5a3ddc","type":"inject","z":"54ec3c32.0d6c44","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":true,"x":110,"y":540,"wires":[["a0e2c7f6.f2a9c8"]]},{"id":"2a81e820.141a38","type":"inject","z":"54ec3c32.0d6c44","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":120,"y":582,"wires":[["57c1c9d9.939528"]]},{"id":"7155df41.6b177","type":"http request","z":"54ec3c32.0d6c44","name":"setup demo","method":"POST","ret":"obj","url":"","tls":"","x":428,"y":582,"wires":[["ee82e579.d75908"]]},{"id":"ee82e579.d75908","type":"debug","z":"54ec3c32.0d6c44","name":"","active":true,"console":"false","complete":"false","x":612,"y":582,"wires":[]},{"id":"57c1c9d9.939528","type":"function","z":"54ec3c32.0d6c44","name":"set msg.url","func":"msg.url = context.global.endpoint + '/SetupDemo';\nreturn msg;","outputs":1,"noerr":0,"x":267,"y":582,"wires":[["7155df41.6b177"]]},{"id":"14bcb51e.31aa5b","type":"inject","z":"54ec3c32.0d6c44","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":119.5,"y":621,"wires":[["385c6604.0e3e4a"]]},{"id":"9fb98eb4.9872b","type":"http request","z":"54ec3c32.0d6c44","name":"get orders","method":"GET","ret":"obj","url":"","tls":"","x":427.5,"y":621,"wires":[["e518a3c6.2ba9"]]},{"id":"e518a3c6.2ba9","type":"debug","z":"54ec3c32.0d6c44","name":"","active":true,"console":"false","complete":"false","x":611.5,"y":621,"wires":[]},{"id":"385c6604.0e3e4a","type":"function","z":"54ec3c32.0d6c44","name":"set msg.url","func":"msg.url = context.global.endpoint + '/Order';\nreturn msg;","outputs":1,"noerr":0,"x":266.5,"y":621,"wires":[["9fb98eb4.9872b"]]},{"id":"b268da68.49d898","type":"inject","z":"54ec3c32.0d6c44","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":119.5,"y":661,"wires":[["ed26b88a.6fc0a8"]]},{"id":"4fa33f4c.88044","type":"http request","z":"54ec3c32.0d6c44","name":"get vehicles","method":"GET","ret":"obj","url":"","tls":"","x":427.5,"y":661,"wires":[["7be863c3.4a15fc"]]},{"id":"7be863c3.4a15fc","type":"debug","z":"54ec3c32.0d6c44","name":"","active":true,"console":"false","complete":"false","x":611.5,"y":661,"wires":[]},{"id":"ed26b88a.6fc0a8","type":"function","z":"54ec3c32.0d6c44","name":"set msg.url","func":"msg.url = context.global.endpoint + '/Vehicle';\nreturn msg;","outputs":1,"noerr":0,"x":266.5,"y":661,"wires":[["4fa33f4c.88044"]]},{"id":"a8be9d92.2c3f3","type":"inject","z":"54ec3c32.0d6c44","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":118.5,"y":702,"wires":[["ac53fab4.6f4bc8"]]},{"id":"dae8f039.39e23","type":"http request","z":"54ec3c32.0d6c44","name":"get transactions","method":"GET","ret":"obj","url":"","tls":"","x":436.5,"y":702,"wires":[["e6f42e67.9914d"]]},{"id":"e6f42e67.9914d","type":"debug","z":"54ec3c32.0d6c44","name":"","active":true,"console":"false","complete":"false","x":610.5,"y":702,"wires":[]},{"id":"ac53fab4.6f4bc8","type":"function","z":"54ec3c32.0d6c44","name":"set msg.url","func":"msg.url = context.global.endpoint + '/UpdateOrderStatus';\nreturn msg;","outputs":1,"noerr":0,"x":265.5,"y":702,"wires":[["dae8f039.39e23"]]},{"id":"ed0f0268.1746b","type":"hyperledger-composer-in","z":"54ec3c32.0d6c44","name":"receive event","composerProfile":"6dad7cfd.02bda4","actionType":"create","x":90,"y":400,"wires":[["cd3b1b90.20eaf8"]]},{"id":"77939996.7a2238","type":"function","z":"54ec3c32.0d6c44","name":"REST API URL Configuration","func":"let something;\nif(msg.payload.trim()){\n    context.global.endpoint = msg.payload.trim();\n}\nelse{\n    context.global.endpoint = \"http://localhost:3000/api\";\n}\nconsole.log('What is context.global.endpoint?',context.global.endpoint);","outputs":1,"noerr":0,"x":676.5,"y":536,"wires":[[]]},{"id":"a0e2c7f6.f2a9c8","type":"exec","z":"54ec3c32.0d6c44","command":"echo $COMPOSER_BASE_URL","addpay":false,"append":"","useSpawn":"","timer":"","name":"Get REST API Environment Variable","x":343.5,"y":538.5,"wires":[["77939996.7a2238"],[],[]]},{"id":"c1914d4c.89455","type":"websocket in","z":"54ec3c32.0d6c44","name":"","server":"373a3d7b.465692","client":"","x":100,"y":60,"wires":[["2b7d4fec.851a3","f96b0e1a.88a73"]]},{"id":"2b7d4fec.851a3","type":"change","z":"54ec3c32.0d6c44","name":"","rules":[{"t":"delete","p":"_session","pt":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":60,"wires":[["229c7328.81818c"]]},{"id":"f96b0e1a.88a73","type":"debug","z":"54ec3c32.0d6c44","name":"reveived PlacePig socket msg","active":true,"console":"false","complete":"true","x":370,"y":140,"wires":[]},{"id":"229c7328.81818c","type":"switch","z":"54ec3c32.0d6c44","name":"","property":"payload","propertyType":"msg","rules":[{"t":"eq","v":"__ping__","vt":"str"},{"t":"else"}],"checkall":"true","outputs":2,"x":530,"y":60,"wires":[["7fce5ea3.575d4"],["2066da72.75cc76"]]},{"id":"7fce5ea3.575d4","type":"function","z":"54ec3c32.0d6c44","name":"pong","func":"msg.payload = '__pong__';\nreturn msg;","outputs":1,"noerr":0,"x":670,"y":40,"wires":[["aa38c455.dadff8"]]},{"id":"2066da72.75cc76","type":"function","z":"54ec3c32.0d6c44","name":"parse","func":"msg.payload = JSON.parse(msg.payload);\nmsg.url = context.global.endpoint + '/PlaceOrder'\nreturn msg;\n","outputs":1,"noerr":0,"x":669.1845550537109,"y":90.61310577392578,"wires":[["a90b62bc.f538d","9c5eb9c9.027f38"]]},{"id":"aa38c455.dadff8","type":"websocket out","z":"54ec3c32.0d6c44","name":"","server":"373a3d7b.465692","client":"","x":850,"y":40,"wires":[]},{"id":"a90b62bc.f538d","type":"hyperledger-composer-out","z":"54ec3c32.0d6c44","name":"submit placepig tx","composerProfile":"6dad7cfd.02bda4","actionType":"create","x":850,"y":80,"wires":[]},{"id":"9c5eb9c9.027f38","type":"debug","z":"54ec3c32.0d6c44","name":"transaction payload","active":true,"console":"false","complete":"payload","x":860,"y":120,"wires":[]},{"id":"1b07e432.db998c","type":"websocket in","z":"54ec3c32.0d6c44","name":"","server":"612632d3.248b8c","client":"","x":110,"y":240,"wires":[["4d99fa1f.64bbf4","74ccb67e.de3ac8"]]},{"id":"4d99fa1f.64bbf4","type":"change","z":"54ec3c32.0d6c44","name":"","rules":[{"t":"delete","p":"_session","pt":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":340,"y":240,"wires":[["97907d5e.dbdb5"]]},{"id":"74ccb67e.de3ac8","type":"debug","z":"54ec3c32.0d6c44","name":"reveived ProcessPig socket msg","active":true,"console":"false","complete":"true","x":380,"y":320,"wires":[]},{"id":"97907d5e.dbdb5","type":"switch","z":"54ec3c32.0d6c44","name":"","property":"payload","propertyType":"msg","rules":[{"t":"eq","v":"__ping__","vt":"str"},{"t":"else"}],"checkall":"true","outputs":2,"x":530,"y":240,"wires":[["ae579d0c.ea2e9"],["8ce3b708.545618"]]},{"id":"ae579d0c.ea2e9","type":"function","z":"54ec3c32.0d6c44","name":"pong","func":"msg.payload = '__pong__';\nreturn msg;","outputs":1,"noerr":0,"x":670,"y":220,"wires":[["92398c8f.7afbb"]]},{"id":"8ce3b708.545618","type":"function","z":"54ec3c32.0d6c44","name":"parse","func":"msg.payload = JSON.parse(msg.payload);\nmsg.url = context.global.endpoint + '/Process'\nreturn msg;\n","outputs":1,"noerr":0,"x":669.1845550537109,"y":270.6131057739258,"wires":[["a4a76744.c78038","170d6a17.109036"]]},{"id":"92398c8f.7afbb","type":"websocket out","z":"54ec3c32.0d6c44","name":"","server":"612632d3.248b8c","client":"","x":860,"y":220,"wires":[]},{"id":"a4a76744.c78038","type":"hyperledger-composer-out","z":"54ec3c32.0d6c44","name":"submit placepig tx","composerProfile":"6dad7cfd.02bda4","actionType":"create","x":850,"y":260,"wires":[]},{"id":"170d6a17.109036","type":"debug","z":"54ec3c32.0d6c44","name":"transaction payload","active":true,"console":"false","complete":"payload","x":860,"y":300,"wires":[]},{"id":"9da83fa2.3a621","type":"function","z":"54ec3c32.0d6c44","name":"parse","func":"eventMsg = {};\neventMsg.payload = {};\neventMsg.payload.transactionId = msg.eventId.substr(0, msg.eventId.indexOf('#'));\neventMsg.payload.class = msg.$class;\n\neventMsg.payload.newOwner = msg.newOwner.memberId;\neventMsg.payload.pig = msg.pig.pigId;\neventMsg.payload.purchaseName = msg.purchaseName;\neventMsg.payload.purchaseDate = msg.purchaseDate;\neventMsg.payload.grade = msg.grade;\neventMsg.payload.passFlag = msg.passFlag;\neventMsg.payload.weight = msg.weight;\neventMsg.payload.timestamp = msg.timestamp;\nreturn eventMsg;","outputs":1,"noerr":0,"x":537,"y":400,"wires":[["1bfcfb90.19a304","a7c05a3b.449f78"]]},{"id":"1bfcfb90.19a304","type":"websocket out","z":"54ec3c32.0d6c44","name":"","server":"612632d3.248b8c","client":"","x":887,"y":400,"wires":[]},{"id":"a7c05a3b.449f78","type":"debug","z":"54ec3c32.0d6c44","name":"","active":true,"console":"false","complete":"payload","x":857,"y":460,"wires":[]},{"id":"cd3b1b90.20eaf8","type":"switch","z":"54ec3c32.0d6c44","name":"","property":"$class","propertyType":"msg","rules":[{"t":"eq","v":"org.acme.mynetwork.ProcessEvent","vt":"str"}],"checkall":"false","outputs":1,"x":317,"y":400,"wires":[["9da83fa2.3a621"]]},{"id":"6dad7cfd.02bda4","type":"hyperledger-composer-config","z":"","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"admin","userSecret":"adminpw"},{"id":"373a3d7b.465692","type":"websocket-listener","z":"","path":"/ws/placepig","wholemsg":"false"},{"id":"612632d3.248b8c","type":"websocket-listener","z":"","path":"/ws/processpig","wholemsg":"false"}]
```

2. Query Flow

```json
[{"id":"5dbaea68.194554","type":"inject","z":"476dbc5c.81f0b4","name":"","topic":"","payload":"{\"$class\": \"org.vda.ScrapAllVehiclesByColour\", \"colour\":\"grey\"}","payloadType":"json","repeat":"","crontab":"","once":false,"x":183,"y":71,"wires":[["8271e43e.f0fe08"]]},{"id":"1118a1.a781875f","type":"debug","z":"476dbc5c.81f0b4","name":"","active":true,"console":"false","complete":"true","x":380,"y":150.25,"wires":[]},{"id":"8271e43e.f0fe08","type":"hyperledger-composer-out","z":"476dbc5c.81f0b4","name":"ScrapAllVehiclesByColour","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"whatever","actionType":"create","x":479,"y":70.75,"wires":[]},{"id":"9bcc7dac.abb2c","type":"hyperledger-composer-in","z":"476dbc5c.81f0b4","name":"EventReceived","connectionProfile":"hlfv1","businessNetworkIdentifier":"org-acme-biznet","userID":"PeerAdmin","userSecret":"whatever","actionType":"create","x":190,"y":149.75,"wires":[["1118a1.a781875f"]]}]
```