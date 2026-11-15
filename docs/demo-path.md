# Suggested Demo Path

## Opening story

"In discovery, we learned that your teams already have tools they like: GitHub, Jenkins, GitLab, Jira, ServiceNow, Kubernetes, and security scanners. The problem is not that these tools are bad. The problem is that leadership lacks end-to-end visibility, release coordination is manual, and governance is inconsistent. CloudBees Unify helps connect and orchestrate the toolchain without forcing a rip-and-replace migration."

## Suggested flow

This demo spans two repos, mirroring how CloudBees Unify separates a Component from an Application:

- **Component** (this repo): CI + component deploy
- **Application** ([cb-demos/cloudbees-unify-demo-app](https://github.com/cb-demos/cloudbees-unify-demo-app)): Release Orchestration workflows + governance/evidence props

1. Show the repo structure and explain that teams can keep their existing tools.
2. Show `.github/workflows/ci.yml` as an example of existing external CI.
3. Run `.cloudbees/workflows/ci.yaml` to show a standardized CloudBees build/test/security pattern, then walk its **Evidence** tab.
4. Run `.cloudbees/workflows/deploy.yaml` to show a component deployment.
5. Switch to the **application repo** and run the staged release workflow `release-finsure-bank.yaml` end to end (governance → staging → validation → approval → production → evidence).
6. Walk the **Evidence** tab on the release run — each job publishes a governance/audit evidence item. Use the app repo's `policies/` and `mock-data/` as supporting talking points.
7. (Optional) In the Unify Workflow Composer, add a real manual approval gate where the `production-approval` step is, to show governance live.
8. Close with business outcomes: visibility, governance, orchestration, developer productivity, and preserving existing tool investments.

> Note: every workflow is self-contained and mock/echo-based, so each one runs green on its own with no clusters, secrets, or integrations. The application/release-orchestration story now lives in the separate application repo, because in CloudBees Unify an Application and a Component cannot be the same repository.
