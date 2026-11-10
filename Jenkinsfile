// Jenkins path for orders-api: the "keep your Jenkins" story. Run it as a
// Multibranch Pipeline on a controller connected to CloudBees Unify (plugin
// cloudbees-cbp-unify-integration); builds and JUnit results then show up on
// the cloudbees-unify-demo-kit component next to the Unify and GitHub Actions runs.
//
// Outcomes come from the repo itself:
//   lint error or new hardcoded secret -> FAILURE
//   failing test (tests/*.sh)          -> UNSTABLE
//   everything clean                   -> SUCCESS
pipeline {
  agent any
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '50'))
  }
  stages {
    stage('Lint') {
      steps {
        sh 'bash ci/lint.sh'
      }
    }
    stage('Build') {
      steps {
        sh 'bash ci/build.sh'
        script { currentBuild.description = "orders-api ${readFile('build/VERSION').trim()}" }
      }
    }
    stage('Unit tests') {
      steps {
        sh 'bash ci/run-tests.sh build/test-results/junit.xml'
      }
      post {
        always { junit 'build/test-results/*.xml' }
      }
    }
    stage('Security scan') {
      steps {
        sh 'bash ci/secret-scan.sh'
      }
    }
    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'build/*.tgz, build/VERSION', fingerprint: true
      }
    }
  }
}
