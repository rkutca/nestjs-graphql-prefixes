version="v1"

REDIS_PORT='6379'
REDIS_HOST='localhost'

master = "master".equals(env.BRANCH_NAME)
develop = "develop".equals(env.BRANCH_NAME)

awsRegion = "eu-west-1"
awsIamJenkinsUser = "aws-jenkins"
tld = "aws.ziggo.io"
templatePath = "k8s"

safeBranchName = ci.safeBranchName env.BRANCH_NAME
awsEnv = master ? "prod" : "dev"
roleId = master ? "821523362326" : "537281111828"
roleArn = "arn:aws:iam::${roleId}:role/vz-${awsEnv}admin"
registryCredential = "${awsEnv}-api-role"

dockerImage = ''
imageRepo = "${roleId}.dkr.ecr.eu-west-1.amazonaws.com"
imagePath = "${awsEnv}-api/vfz-company-api"
imageTag = "${env.GIT_COMMIT}"
fullImageName = "${imagePath}:${imageTag}"
dockerRegistry = "https://${imageRepo}"
clusterName = "${awsEnv}-api"
nameSpace = "${awsEnv}-api"
projectName = "vfz-company-api"
containerPort = 3000
svcPort = 80
fullBranchName = "${projectName}-${safeBranchName}"
healthcheckuri = "api/company/${version}/health"
fqdn = "${projectName}.${clusterName}.${awsEnv}.${tld}"

def CheckWorkingImage() {
  ecrRepositoryState = sh(script: "aws ecr describe-repositories | grep ${imagePath}", returnStatus: true) == 0
  if (ecrRepositoryState) {
    println "Repository Exist";
  } else {
    sh "aws ecr create-repository --repository-name ${imagePath}"
  }
}

cpuDev = "1900m"
cpuAcc = "1900m"
cpuProd = "3800m"

memDev = "2000Mi"
memAcc = "2000Mi"
memProd = "4000Mi"

timeoutDuration = 5

map = [:]

def set(key, value) {
	map[key] = value
}

def get(key) {
	return map[key]
}

return this