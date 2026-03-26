#!/bin/bash

set -e

# ==============================
# CONFIG (same as your runbook)
# ==============================
NS="stat"
ROOT_PWD="RootPass!123"
REPL_USER="repl"
REPL_PWD="ReplPass!123"
MASTER_HOST="mysql-0.mysql-headless.stat.svc.cluster.local"
APP_USER="appuser"
APP_PWD="AppPass123!"

echo "Namespace: $NS"

# ==============================
# FUNCTIONS
# ==============================

wait_for_pods() {
  echo "⏳ Waiting for MySQL pods..."
  kubectl -n $NS rollout status sts/mysql
}

verify_master() {
  echo "🔍 Verifying master config..."
  kubectl -n $NS exec mysql-0 -- env MYSQL_PWD="$ROOT_PWD" mysql --no-defaults -uroot -e "
    SHOW VARIABLES LIKE 'server_id';
    SHOW VARIABLES LIKE 'log_bin';
  "
}

set_replica_ids() {
  echo "⚙️ Setting replica server_id..."
  kubectl -n $NS exec mysql-1 -- mysql --no-defaults -uroot -e "SET GLOBAL server_id=101; SET GLOBAL read_only=ON;"
  kubectl -n $NS exec mysql-2 -- mysql --no-defaults -uroot -e "SET GLOBAL server_id=102; SET GLOBAL read_only=ON;"
}

create_users() {
  echo "👤 Creating replication + app users..."

  kubectl -n $NS exec mysql-0 -- env MYSQL_PWD="$ROOT_PWD" mysql --no-defaults -uroot -e "
    CREATE USER IF NOT EXISTS '$REPL_USER'@'%' IDENTIFIED BY '$REPL_PWD';
    ALTER USER '$REPL_USER'@'%' IDENTIFIED BY '$REPL_PWD';
    GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO '$REPL_USER'@'%';

    CREATE DATABASE IF NOT EXISTS appdb;
    CREATE USER IF NOT EXISTS '$APP_USER'@'%' IDENTIFIED BY '$APP_PWD';
    ALTER USER '$APP_USER'@'%' IDENTIFIED BY '$APP_PWD';
    GRANT ALL PRIVILEGES ON appdb.* TO '$APP_USER'@'%';

    FLUSH PRIVILEGES;
  "
}

configure_slaves() {
  echo "🔗 Configuring slaves..."

  for i in 1 2; do
    kubectl -n $NS exec mysql-$i -- mysql --no-defaults -uroot -e "
      STOP SLAVE;
      RESET SLAVE ALL;
      CHANGE MASTER TO
        MASTER_HOST='$MASTER_HOST',
        MASTER_USER='$REPL_USER',
        MASTER_PASSWORD='$REPL_PWD',
        MASTER_AUTO_POSITION=1;
      START SLAVE;
    "
  done
}

check_replication() {
  echo "📊 Checking replication status..."

  kubectl -n $NS exec mysql-1 -- mysql --no-defaults -uroot -e "SHOW SLAVE STATUS\G"
  kubectl -n $NS exec mysql-2 -- mysql --no-defaults -uroot -e "SHOW SLAVE STATUS\G"
}

test_replication() {
  echo "🧪 Testing replication..."

  kubectl -n $NS exec mysql-0 -- env MYSQL_PWD="$ROOT_PWD" mysql --no-defaults -uroot -e "
    CREATE DATABASE IF NOT EXISTS appdb;
    CREATE TABLE IF NOT EXISTS appdb.test_table (
      id INT AUTO_INCREMENT PRIMARY KEY,
      msg VARCHAR(255)
    );
    INSERT INTO appdb.test_table(msg) VALUES ('hello replication');
  "

  sleep 2

  kubectl -n $NS exec mysql-1 -- mysql --no-defaults -uroot -e "SELECT * FROM appdb.test_table;"
  kubectl -n $NS exec mysql-2 -- mysql --no-defaults -uroot -e "SELECT * FROM appdb.test_table;"
}

deploy_resources() {
  echo "🚀 Deploying Kubernetes resources..."
  kubectl apply -f k8s/04-services.yaml -n $NS
  kubectl apply -f k8s/05-statefulset.yaml -n $NS
  kubectl apply -f k8s/06-pv.yaml
}

deploy_gateway() {
  echo "🌐 Deploying FastAPI gateway..."

  kubectl -n $NS apply -f k8s/07-fastapi-gateway.yaml
  kubectl -n $NS set env deploy/mysql-rw-gateway DB_USER=$APP_USER DB_PASSWORD=$APP_PWD
  kubectl -n $NS rollout restart deploy/mysql-rw-gateway
  kubectl -n $NS rollout status deploy/mysql-rw-gateway
}

# ==============================
# MAIN FLOW
# ==============================

case "$1" in
  full)
    deploy_resources
    wait_for_pods
    verify_master
    set_replica_ids
    create_users
    configure_slaves
    check_replication
    test_replication
    deploy_gateway
    echo "✅ FULL SETUP COMPLETED"
    ;;

  setup)
    deploy_resources
    wait_for_pods
    ;;

  replication)
    set_replica_ids
    create_users
    configure_slaves
    check_replication
    ;;

  test)
    test_replication
    ;;

  *)
    echo "Usage:"
    echo "  ./script.sh full          # full automation"
    echo "  ./script.sh setup         # only k8s setup"
    echo "  ./script.sh replication   # only replication steps"
    echo "  ./script.sh test          # test replication"
    ;;
esac