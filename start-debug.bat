start "N.Blog API TSC" cmd /c "cd api && tsc -watch"
start "N.Blog API" cmd /c "cd api && nodemon"
start "N.Blog Client" cmd /c "cd client && npm start"
exit
