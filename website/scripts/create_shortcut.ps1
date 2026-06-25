$shell = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktop "meloscribe website.url"
$oldShortcutPath = Join-Path $desktop "MeloScribe Website.url"

if (Test-Path $oldShortcutPath) {
    Remove-Item -Force $oldShortcutPath
}

if (Test-Path $shortcutPath) {
    Remove-Item -Force $shortcutPath
}

$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "http://localhost:5173"
$shortcut.Save()

Write-Output "Desktop shortcut created successfully at $shortcutPath"
