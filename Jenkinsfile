// Jenkins path for orders-api: the "keep your Jenkins" story. Run it as a
// Multibranch Pipeline on a controller connected to CloudBees Unify (plugin
// cloudbees-cbp-unify-integration); builds and JUnit results then show up on
// the cloudbees-unify-demo-kit component next to the Unify and GitHub Actions runs.
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'mkdir -p build && echo "orders-api ${BUILD_NUMBER}" > build/orders-api.txt'
      }
    }
    stage('Unit tests') {
      steps {
        echo 'orders-api unit tests (recorded results in test-reports/junit.xml)'
        // The recorded run has a known failure, so the build is UNSTABLE, not FAILED.
        junit 'test-reports/junit.xml'
      }
    }
    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'build/orders-api.txt'
      }
    }
  }
}
