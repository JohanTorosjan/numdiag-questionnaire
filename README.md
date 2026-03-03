# numdiag-questionnaire

front : http://127.0.0.1:8081/

initdb : curl -X POST http://127.0.0.1:3008/initDatabase
populate default scores : curl -X POST http://127.0.0.1:3008/populateScores

connect to db : docker exec -it numdiagcmsdb psql -U postgres -d numdiagcmsdb

---

compose in dev :
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f : pour les logs

compose in prod :
docker-compose -f docker-compose.prod.yml up -d

03-03-26 : Branch deployed = mars-deployed

git checkout mars-deployed
git merge <branch>
git push o.. mars-deployed

sur vm: ./deployed.sh
