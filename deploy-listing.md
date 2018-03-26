# Thing to do before deploy

## Table content
1. Before merge  
2. Merge  
3. After merge  
4. Deploy    

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
`git add package.json`  
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
`cd /var/www/movies-list`  
`git status`  
`git pull origin mep`: update repository  
`rm -rf node_modules`: remove dependencies   
`npm install`: install dependencies  
`sh .bundle.sh "http://wat-wat.nilslayet.com"`. get output.js file  
Start server with tmux 
+ to attach an existing tmux session  
    `tmux a`    
+ to start a new tmux session  
    `tmux`  
    
`source /opt/nvm/nvm.ssh`    
`NODE_ENV=production PORT=$$$$ node ./main.js`: start server    
`ctrl-b d`: press ctrl and b, realese, then press *d* to detach the current session 
