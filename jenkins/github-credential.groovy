// Adds or updates only the "github" credential from $GITHUB_TOKEN at startup.
// Not done in casc.yaml on purpose: a casc "credentials:" block replaces the whole
// store on every restart, which deletes the cloudbees-unify-private-key that the
// Unify "Approve in Controller" flow installs.
import com.cloudbees.plugins.credentials.CredentialsScope
import com.cloudbees.plugins.credentials.SystemCredentialsProvider
import com.cloudbees.plugins.credentials.domains.Domain
import com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl

def token = System.getenv('GITHUB_TOKEN')
if (!token) {
  println 'github-credential: GITHUB_TOKEN not set, leaving credentials unchanged'
  return
}
def owner = System.getenv('GITHUB_OWNER') ?: 'michaelvp411'
def provider = SystemCredentialsProvider.getInstance()
def store = provider.getStore()
def cred = new UsernamePasswordCredentialsImpl(CredentialsScope.GLOBAL, 'github',
    'GitHub API token for branch scans', owner, token)
def existing = provider.getCredentials().find { it.id == 'github' }
if (existing) {
  store.updateCredentials(Domain.global(), existing, cred)
} else {
  store.addCredentials(Domain.global(), cred)
}
println 'github-credential: github credential ' + (existing ? 'updated' : 'added')
