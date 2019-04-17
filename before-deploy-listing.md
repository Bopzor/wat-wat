# Thing to do before deploy

## Table content
1. Before merge
2. Merge
3. After merge
4. Deploy
5. After deploy

## 1. Before merge
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
Fix what is needed to.  
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
When you are SURE everything is OK, test again.  
`git add <modified-file>`  
`git commit -m 'the commit message'`  
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
`git push`  
`git checkout mep`  

## 2. Merge
`git merge <branch to merge>`

## 3. After merge
Edit CHANGELOG.md file  
`git add CHANGELOG.md`  
`git commit -m 'update CHANGELOG.md'`  
Change version in package.json  
`git add package.json`  
`git commit -m 'bump version'`  
`git tag -a <version> -m 'v<version>'`  
`git push`  
`git push --tags`  

## 4. Deploy
`ssh twix`  
`source /opt/nvm/nvm.sh`  
`cd <wat-wat-directory>`  
`git status`  
`git pull origin mep`: update repository  
`export REACT_APP_API_URL=<api_url>`  
`export REACT_APP_OMDB_API_KEY=<apikey>`  
`yarn docker:build`: build docker image  
`yarn docker:run`: run docker container  

## 5. After deploy
`git push`  
`git checkout master`  
`git pull`  
`git merge mep` 
