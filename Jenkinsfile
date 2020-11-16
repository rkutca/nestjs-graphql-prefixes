#!groovy
@Library('vfz-common-ci@master') _

pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
        parallelsAlwaysFailFast()
    }

    stages {
        stage('build') {
            steps {
                script {
                    sh "npm ci"
                }
            }
        }
        stage('Test') {
            parallel {
                stage("test:lint") {
                    steps {
                        script {
                            sh "npm run lint"
                        }
                    }
                }
                // stage("test:e2e:unit:monkey") {
                //     steps {
                //         script {
                //             def args = "--network=host --ipc=host -e REDIS_HOST=localhost -e COMPANY_WS_USERNAME=test -e COMPANY_WS_PASSWORD=test -e COMPANY_WS_ENDPOINT=http://localhost:4000/?wsdl"
                        
                //             // spin off 3 containers where both share
                //             docker.image('redis:6.0.6').withRun("${args}") { c ->
                                
                //                 docker.image('redis:6.0.6').inside("${args}"){}
                                
                //                 // build our local image
                //                 // and apply the same network settings
                //                 docker.build("test:${env.BUILD_ID}", "--network=host .").inside("${args}") {

                //                     // run nestjs in the background using pm2
                //                     sh "npx pm2 --name myExampleApp start npm -- start"

                //                     // wait untill it's ready
                //                     sh "sleep 25"

                //                     // we can now run our tests
                //                     // and test the actual behavior without
                //                     sh "npm run test:e2e"

                //                     // we can now run our tests
                //                     // and test the actual behavior without
                //                     sh "npm run test"

                //                     // kill our server
                //                     sh "npx pm2 delete 0"
                //                 }
                //             }
                //         }
                //     }
                // }
                stage("test:typecheck") {
                    steps {
                        script {
                            // type check typescript
                            sh "npm run typecheck"
                        }
                    }
                }
            }
        }
        stage('deploy') {
          when {
              anyOf {
                branch 'master'
                branch 'develop'
              }
          }
          stages {
            stage('Initialize') {
                steps {
                    script {
                        dObject = load "dynamicObject.groovy"
                        aws.setKubeConfig(dObject.clusterName, dObject.roleArn)
                        dObject.CheckWorkingImage()
                    }
                }
            }
            stage('deploy:docker') {
              steps {
                  script {
                    def image = docker.build("${dObject.fullImageName}", "--network=host .")
                    docker.withRegistry("https://${dObject.imageRepo}/${dObject.imagePath}", "ecr:eu-west-1:${dObject.registryCredential}") {
                        image.push()
                    }
                  }
              }
            }
            stage("deploy:k8s"){
              steps {
                  script {
                    def list = ["api"]
                    for (item in list) {
                        aws.createOrUpdateResource(dObject, item, dObject.projectName, dObject.fqdn, dObject.fullImageName)
                    }
                  }
              }
            }
          }
        }
        // stage('test'){
        //     stages {
        //         stage("test:load"){
        //             when {
        //                 not {
        //                     branch 'master'
        //                 }
        //             }
        //             steps {
        //                 script {
        //                     sh "DEBUG=http npx artillery run --target https://api.${awsEnv}.aws.ziggo.io __load__/load-test.yml"
        //                 }
        //             }
        //         }
        //         stage("test:health"){
        //             steps {
        //                 script {
        //                     sh "sleep 20"
        //                     sh "curl -sL -w \"%{http_code}\\n\" \"https://api.${awsEnv}.aws.ziggo.io/v1/api/company/v1/health\" -o /dev/null"
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}
