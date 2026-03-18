cd services/auth-service
docker build -t secretpower/auth-service:v1 .
docker push secretpower/auth-service:v1

cd ../doctor-service
docker build -t secretpower/doctor-service:v1 .
docker push secretpower/doctor-service:v1

cd ../patient-service
docker build -t secretpower/patient-service:v1 .
docker push secretpower/patient-service:v1

cd ../appointment-service
docker build -t secretpower/appointment-service:v1 .
docker push secretpower/appointment-service:v1

cd ../pharmacy-service
docker build -t secretpower/pharmacy-service:v1 .
docker push secretpower/pharmacy-service:v1

cd ../lab-service
docker build -t secretpower/lab-service:v1 .
docker push secretpower/lab-service:v1

cd ../../frontend
docker build -t secretpower/healthcare-frontend:v1 .
docker push secretpower/healthcare-frontend:v1