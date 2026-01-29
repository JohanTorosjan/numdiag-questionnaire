# numdiag-questionnaire

front : http://127.0.0.1:8081/

initdb : curl -X POST http://127.0.0.1:3008/initDatabase
populate default scores : curl -X POST http://127.0.0.1:3008/populateScores

connect to db : docker exec -it numdiagcmsdb psql -U postgres -d numdiagcmsdb
