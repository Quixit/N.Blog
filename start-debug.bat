start "MongoDb" "C:\Program Files\MongoDB\Server\3.4\bin\runmongod.cmd"
start "N.Blog API" cmd /c "cd api && nodemon"
start "N.Blog Client" cmd /c "cd client && npm start"
exit