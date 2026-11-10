FROM jenkins/jenkins:lts-jdk21
# Configured entirely by casc.yaml; skip the interactive setup wizard.
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
# Outside jenkins_home so a rebuild picks up changes (the volume would keep a stale copy).
ENV CASC_JENKINS_CONFIG=/usr/share/jenkins/casc.yaml
COPY --chown=jenkins:jenkins plugins.yaml /usr/share/jenkins/ref/plugins.yaml
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.yaml
COPY --chown=jenkins:jenkins casc.yaml /usr/share/jenkins/casc.yaml
# .override: replace the copy in jenkins_home on every start.
COPY --chown=jenkins:jenkins github-credential.groovy /usr/share/jenkins/ref/init.groovy.d/github-credential.groovy.override
