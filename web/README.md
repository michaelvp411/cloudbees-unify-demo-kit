# FinSure / Horizon flags demo

A static web app for demoing CloudBees Unify feature management. One page, two brands:

| Brand | Unify flag application | Flags (namespace.flag) |
| --- | --- | --- |
| FinSure Bank | FinSure Payments Platform | `finsure.aiSpendingCoach` (AI feature), `finsure.instantTransfers` |
| Horizon Health | Horizon Patient Platform | `horizon.aiVisitSummary` (AI feature), `horizon.telehealthCheckin` |

Each brand has three personas. One per brand is a beta tester (`isBetaTester = true`).

## Run it

```bash
cd web
python3 -m http.server 8080
# open http://localhost:8080/?brand=finsure  or  ?brand=horizon
```

## Local demo mode (no setup)

Without an SDK key, the flag panel's Off / Beta testers / Everyone toggles stand in for Unify targeting.

## Live mode (flags from Unify)

1. In Unify, open Feature management → Flags, pick the application and environment, and copy the SDK key from the installation guide.
2. Click **SDK key…** in the page, paste it, and save. The key is stored in your browser only.
3. Load the page once so the SDK registers its flags. They then appear in Unify under the brand's namespace.
4. In Unify, configure each flag, e.g. a rule: `isBetaTester` is true → on, everyone else → off.
5. Switch personas in the page to show who sees what. Turn the flag off in Unify (the kill switch) and the page picks it up within 10 seconds, or click **Fetch from Unify**.

Custom properties the SDK sends: `persona`, `tier` (`standard`, `premier`, `patient`, `clinician`), `isBetaTester`.
