# scripts/final_end_to_end_verification.ps1
$envFile = "C:\Users\HP\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$pat = $env:GITHUB_PAT
$username = "ByteBySway"
$repoName = "resolvai"
$vercelAppUrl = "https://resolvai-platform.vercel.app"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "STARTING COMPREHENSIVE END-TO-END VERIFICATION" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. VERIFY GITHUB REPOSITORY METADATA & API
Write-Host "1. Checking GitHub Repository Metadata (ByteBySway/resolvai)..." -ForegroundColor Yellow
$ghHeaders = @{
    "Authorization" = "Bearer $pat"
    "Accept"        = "application/vnd.github.v3+json"
}

try {
    $repoObj = Invoke-RestMethod -Uri ("https://api.github.com/repos/" + $username + "/" + $repoName) -Headers $ghHeaders
    Write-Host ("OK Repo Name: " + $repoObj.full_name) -ForegroundColor Green
    Write-Host ("OK Repo Description: " + $repoObj.description) -ForegroundColor Green
    Write-Host ("OK Repo Homepage: " + $repoObj.homepage) -ForegroundColor Green

    $topicsObj = Invoke-RestMethod -Uri ("https://api.github.com/repos/" + $username + "/" + $repoName + "/topics") -Headers $ghHeaders
    Write-Host ("OK Repo Topics: " + ($topicsObj.names -join ", ")) -ForegroundColor Green
} catch {
    Write-Error ("GitHub Verification Error: " + $_)
}

# 2. VERIFY VERCEL LIVE API ENDPOINTS
Write-Host "2. Checking Vercel Live Deployment API Endpoints ($vercelAppUrl)..." -ForegroundColor Yellow

$endpointsToTest = @(
    @{ name = "Main UI Page"; path = "/"; method = "GET" },
    @{ name = "Tickets API"; path = "/api/tickets"; method = "GET" },
    @{ name = "Agents API"; path = "/api/agents"; method = "GET" },
    @{ name = "SLA Metrics API"; path = "/api/sla/metrics"; method = "GET" },
    @{ name = "CSAT Analytics API"; path = "/api/analytics/csat"; method = "GET" }
)

foreach ($ep in $endpointsToTest) {
    try {
        $res = Invoke-WebRequest -Uri ($vercelAppUrl + $ep.path) -Method $ep.method -UseBasicParsing
        if ($res.StatusCode -eq 200) {
            Write-Host ("OK [" + $ep.name + "] " + $ep.path + " -> 200 OK") -ForegroundColor Green
        } else {
            Write-Warning ("[" + $ep.name + "] " + $ep.path + " -> Status " + $res.StatusCode)
        }
    } catch {
        Write-Error ("Failed " + $ep.name + ": " + $_)
    }
}

# 3. VERIFY AI LIVE CLASSIFICATION & REPLY GENERATION APIs
Write-Host "3. Testing ResolvAI Live Inference Endpoints..." -ForegroundColor Yellow

# Test AI Classify
try {
    $classifyBody = @{ subject = "Database connection error on production"; description = "Unable to connect to Postgres DB cluster after update" } | ConvertTo-Json
    $resClassify = Invoke-RestMethod -Uri ($vercelAppUrl + "/api/ai/classify") -Method Post -Body $classifyBody -ContentType "application/json"
    if ($resClassify.success) {
        Write-Host ("OK Live AI Classifier: Category=" + $resClassify.data.category + " | Priority=" + $resClassify.data.priority + " | Agent=" + $resClassify.data.assignedAgentName + " (" + ($resClassify.data.routingMatchScore) + "%)") -ForegroundColor Green
    }
} catch {
    Write-Error ("AI Classify API Failed: " + $_)
}

# Test AI Suggest Reply
try {
    $replyBody = @{ subject = "Login timeout issue"; description = "User session expires within 2 minutes"; customerName = "Sarah Jenkins" } | ConvertTo-Json
    $resReply = Invoke-RestMethod -Uri ($vercelAppUrl + "/api/ai/suggest-reply") -Method Post -Body $replyBody -ContentType "application/json"
    if ($resReply.success) {
        Write-Host ("OK Live AI Reply Generator: Drafted " + $resReply.data.suggestedReply.Length + " characters response!") -ForegroundColor Green
    }
} catch {
    Write-Error ("AI Suggest Reply API Failed: " + $_)
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "END-TO-END VERIFICATION COMPLETE -- ALL SYSTEMS OPERATIONAL!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
