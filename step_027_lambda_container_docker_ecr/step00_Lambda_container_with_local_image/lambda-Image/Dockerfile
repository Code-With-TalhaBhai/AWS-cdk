#From Ecr Registry
FROM public.ecr.aws/lambda/nodejs:18  

#From DockerHub
# FROM amazon/aws-lambda-nodejs:latest

COPY app.js package*.json /var/task/



RUN npm install

CMD ["app.handler"]