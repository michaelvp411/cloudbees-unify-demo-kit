"""Backfill CloudBees Smart Tests with history for orders-api.

One build + test session per recent commit, timestamped one day apart, with
JUnit results derived from test-reports/junit.xml. The payments gateway retry
test flips between pass and fail so Smart Tests has a flaky test to surface.
Demo data only. Needs SMART_TESTS_TOKEN and a full git history (fetch-depth: 0).
"""
import copy
import datetime as dt
import random
import subprocess
import xml.etree.ElementTree as ET

BUILDS = 12
CLI = ["smart-tests"]
base = ET.parse("test-reports/junit.xml")
commits = subprocess.run(["git", "log", f"-{BUILDS}", "--format=%H"],
                         capture_output=True, text=True, check=True).stdout.split()[::-1]
rng = random.Random(42)
now = dt.datetime.now(dt.timezone.utc)

for i, sha in enumerate(commits):
    build = f"orders-api-1.4.{i + 1}-backfill"
    stamp = (now - dt.timedelta(days=len(commits) - i)).strftime("%Y-%m-%dT%H:%M:%S+00:00")

    tree = copy.deepcopy(base)
    for case in tree.iter("testcase"):
        case.set("time", f"{float(case.get('time')) * rng.uniform(0.7, 1.4):.3f}")
        if case.get("name") == "test_retry_on_gateway_timeout" and rng.random() < 0.5:
            case.remove(case.find("failure"))
    tree.write("seed-junit.xml", encoding="utf-8", xml_declaration=True)

    subprocess.run(CLI + ["record", "build", "--build", build, "--branch", "main",
                          "--no-commit-collection", "--commit", f"cloudbees-unify-demo-kit={sha}",
                          "--timestamp", stamp], check=True)
    session = subprocess.run(CLI + ["record", "session", "--build", build, "--test-suite", "unit",
                                    "--timestamp", stamp],
                             capture_output=True, text=True, check=True).stdout.strip()
    subprocess.run(CLI + ["record", "tests", "--session", session, "pytest", "seed-junit.xml"], check=True)
    print(f"{build} ({stamp}) recorded")
