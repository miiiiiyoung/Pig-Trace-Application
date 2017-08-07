# 돼지 라이프 사이클 데모 ( Pig Lifecycle Demo )

## Installation

1. `pig-lifecycle` 패키지에서 `. / build.sh`를 실행하십시오.
이 명령은 아카이브 된 파일의 페이로드를 포함하는 `install.sh` 스크립트 (installers / hlfv1 내부에 있음)를 생성합니다.

2. `pig-lifecycle` 패키지에서 `cat installers/hlfv1/install.sh | bash` 를 실행하십시오.
그러면 각 라이프 사이클 데모 요소에 대한 여러 Docker 이미지를 시작하는 스크립트 (및 페이로드)가 실행됩니다.
이 명령을 실행하면 실행중인 다른 Docker 이미지를 해체합니다.