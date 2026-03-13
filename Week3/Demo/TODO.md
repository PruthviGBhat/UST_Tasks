# K8s ConfigMap + MySQL Pod Task
Status: Completed

## Steps:
- [x] 1. Create ConfigMap (configmap-app.yaml) for Spring props
- [x] 2. Create Secret (secret-db.yaml) for DB creds
- [x] 3. Create MySQL StatefulSet/Service/PVC (mysql-statefulset.yaml)
- [x] 4. Update Deployment (kubernetes-demo-deployment.yaml) with env/ConfigMap/Secret
- [ ] 5. Test: kubectl apply, verify pods/svc/logs

## Followup:
kubectl apply -f Demo/
kubectl get all
kubectl port-forward svc/monolith-app-service 8080:80
