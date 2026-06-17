#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="bcd-prototypes"
SA_EMAIL="tanuh-bcd-portal@bcd-prototypes.iam.gserviceaccount.com"
GITHUB_REPO="tanuh-bcd/tanuh_website"
REGION="asia-south1"

echo "=== Phase 0: GCP Resource Provisioning ==="
echo "Project:  $PROJECT_ID"
echo "SA:       $SA_EMAIL"
echo "GH Repo:  $GITHUB_REPO"
echo ""

# ──────────────────────────────────────────────
# 0. Get the numeric project number (needed for WIF)
# ──────────────────────────────────────────────
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
echo "Project Number: $PROJECT_NUMBER"
echo ""

# ──────────────────────────────────────────────
# 1. Enable required APIs
# ──────────────────────────────────────────────
echo "=== Enabling APIs ==="
gcloud services enable \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  --project="$PROJECT_ID"
echo ""

# ──────────────────────────────────────────────
# 2. Create Secret Manager secrets
# ──────────────────────────────────────────────
echo "=== Creating Secret Manager secrets ==="
echo ""

create_secret() {
  local secret_name="$1"
  local secret_value="$2"

  if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
    echo "Secret '$secret_name' already exists, adding new version..."
  else
    echo "Creating secret '$secret_name'..."
    gcloud secrets create "$secret_name" \
      --project="$PROJECT_ID" \
      --replication-policy=user-managed \
      --locations="$REGION"
  fi

  printf '%s' "$secret_value" | \
    gcloud secrets versions add "$secret_name" \
      --project="$PROJECT_ID" \
      --data-file=-

  echo "  ✓ $secret_name"
}

create_secret "tanuh-mysql-user" "tanuh_website_builder"
create_secret "tanuh-mysql-password" 'CHANGE_ME'
create_secret "tanuh-mysql-db" "bcd_questionnaire"
create_secret "tanuh-cloud-sql-connection-name" "bcd-prototypes:asia-south1:tanuh-bcd-questionnaire-dev"
echo ""

# ──────────────────────────────────────────────
# 3. IAM roles for the VM service account
# ──────────────────────────────────────────────
echo "=== Granting IAM roles to VM service account ==="

SA_ROLES=(
  "roles/secretmanager.secretAccessor"
  "roles/cloudsql.client"
  "roles/storage.objectAdmin"
  "roles/compute.admin"
  "roles/iap.tunnelResourceAccessor"
  "roles/iam.serviceAccountUser"
)

for role in "${SA_ROLES[@]}"; do
  echo "  Granting $role..."
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="$role" \
    --condition=None \
    --quiet
done
echo ""

# ──────────────────────────────────────────────
# 4. Workload Identity Federation for GitHub Actions
# ──────────────────────────────────────────────
echo "=== Setting up Workload Identity Federation ==="

POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-provider"

if gcloud iam workload-identity-pools describe "$POOL_NAME" \
    --project="$PROJECT_ID" --location="global" &>/dev/null; then
  echo "WIF pool '$POOL_NAME' already exists."
else
  echo "Creating WIF pool '$POOL_NAME'..."
  gcloud iam workload-identity-pools create "$POOL_NAME" \
    --project="$PROJECT_ID" \
    --location="global" \
    --display-name="GitHub Actions Pool"
fi

if gcloud iam workload-identity-pools providers describe "$PROVIDER_NAME" \
    --project="$PROJECT_ID" --location="global" \
    --workload-identity-pool="$POOL_NAME" &>/dev/null; then
  echo "WIF provider '$PROVIDER_NAME' already exists."
else
  echo "Creating WIF OIDC provider '$PROVIDER_NAME'..."
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
    --project="$PROJECT_ID" \
    --location="global" \
    --workload-identity-pool="$POOL_NAME" \
    --display-name="GitHub Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-condition="assertion.repository == '${GITHUB_REPO}'"
fi
echo ""

# ──────────────────────────────────────────────
# 5. Allow GitHub Actions to impersonate the SA
# ──────────────────────────────────────────────
echo "=== Granting workloadIdentityUser to GitHub repo ==="
WIF_MEMBER="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${GITHUB_REPO}"

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="$WIF_MEMBER" \
  --quiet
echo ""

# ──────────────────────────────────────────────
# 6. Print summary
# ──────────────────────────────────────────────
WIF_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/providers/${PROVIDER_NAME}"

echo "=== Setup Complete ==="
echo ""
echo "WIF Provider (use in GitHub Actions workflow):"
echo "  $WIF_PROVIDER"
echo ""
echo "Service Account:"
echo "  $SA_EMAIL"
echo ""
echo "Secrets created:"
echo "  - tanuh-mysql-user"
echo "  - tanuh-mysql-password"
echo "  - tanuh-mysql-db"
echo "  - tanuh-cloud-sql-connection-name"
echo ""
echo "Next steps:"
echo "  1. Verify the secret values are correct (especially tanuh-mysql-password)"
echo "  2. Deploy Phase 1 code changes (Secret Manager integration)"
echo "  3. Set the WIF_PROVIDER value in .github/workflows/deploy.yml"
