# تست API ایجاد جلسه

# ابتدا login کنید و token بگیرید
$loginResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/token/" -Method Post -Body (@{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.access

Write-Host "Token: $token"

# حالا جلسه ایجاد کنید
$meetingData = @{
    title = "جلسه تست از PowerShell"
    description = "تست"
    meeting_date = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
    duration_minutes = 60
    location = "اتاق جلسات"
    attendee_ids = @(1, 2)
} | ConvertTo-Json

Write-Host "`nMeeting Data:"
Write-Host $meetingData

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/meetings/" -Method Post -Body $meetingData -ContentType "application/json" -Headers @{
        Authorization = "Bearer $token"
    }
    
    Write-Host "`n✅ جلسه ایجاد شد:"
    Write-Host ($response | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "`n❌ خطا:"
    Write-Host $_.Exception.Message
    Write-Host $_.Exception.Response
}
