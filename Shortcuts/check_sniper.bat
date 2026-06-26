@echo off
title OCI Sniper Status Check
set KEY_PATH="C:\Dev\meloscribe\ssh-key-2026-05-07.key"
set SERVER_IP=152.70.23.171

echo Checking Oracle Instance Sniper status on %SERVER_IP%...
echo -------------------------------------------------------------

if not exist %KEY_PATH% (
    echo ERROR: SSH Key not found!
    echo.
    echo Path expected:
    echo   %KEY_PATH%
    echo.
    echo Please restore the SSH key file to the above location.
    echo It was likely in the un-backed-up Downloads folder of your old PC.
    echo -------------------------------------------------------------
    goto end
)

echo SSH Key found. Establishing secure connection...
ssh -i %KEY_PATH% -o StrictHostKeyChecking=accept-new -o ConnectTimeout=5 -o IdentitiesOnly=yes ubuntu@%SERVER_IP% "sudo systemctl status oci-sniper --no-pager && echo && echo --- RECENT LOGS --- && sudo journalctl -u oci-sniper -n 20 --no-pager"
echo -------------------------------------------------------------

:end
echo.
pause
