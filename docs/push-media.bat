@echo off
rem Copies every website video into the leadq-media repo (next to this one) and pushes it.
rem The website plays its videos from there, so this repo stays small and publishes fast.
rem Run it again whenever a video is added or replaced.
setlocal
set SITE=%~dp0..
set MEDIA=%~dp0..\..\leadq-media
cd /d "%~dp0..\.."
if not exist "%MEDIA%\.git" (
  echo Downloading the leadq-media repo...
  git clone https://github.com/LeadQTeam/leadq-media.git || goto fail
)
cd /d "%MEDIA%"
echo Copying videos...
xcopy "%SITE%\demos\*.mp4" "demos\" /S /I /Y /Q || goto fail
copy /Y "%SITE%\leadq-video.mp4" . >nul || goto fail
copy /Y "%SITE%\leadq-video-ae.mp4" . >nul || goto fail
if not exist .nojekyll type nul > .nojekyll
git add -A
git commit -m "Update website videos" || echo Nothing new to commit.
git branch -M main
echo Uploading (this can take a few minutes the first time)...
git push -u origin main || goto fail
echo.
echo DONE. The videos are on GitHub.
pause
exit /b 0
:fail
echo.
echo Something went wrong. Copy the lines above and send them to Claude.
pause
exit /b 1
