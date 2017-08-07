#!/bin/bash
set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "${DIR}"

cat install.sh.in | sed 's/{{ENV}}/latest/g' > install.sh
echo "PAYLOAD:" >> install.sh
tar czf - flows.json vehicle-lifecycle-network.bna fabric-dev-servers >> install.sh

cat install.sh.in | sed 's/{{ENV}}/unstable/g' > install-unstable.sh
echo "PAYLOAD:" >> install-unstable.sh
tar czf - flows.json vehicle-lifecycle-network.bna fabric-dev-servers >> install-unstable.sh
