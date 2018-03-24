# THINGS TO DO FOR DEPLOYED  

## TABLE CONTENT
1. [BEFORE MERGE](#before)
2. [MERGE](#merge)
3. [AFTER MERGE](#after)
4. [DEPLOY](#deploy)  

## 1. BEFORE MERGE <a name="before"></a> 
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
Fix what is needed to.  
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
When you are SURE everything is OK, test again.  
`git add <modified-file>`  
`git commit -m 'the commit message'`  
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
`git push`  
`git checkout mep`  

## 2. MERGE <a name="merge"></a> 
`git merge <branch to merge>`  

## 3. AFTER MERGE <a name="after"></a> 
Change version in package.json  
`git add package.json`  
`git commit -m 'bump version'`  
`git tag -a <version> -m 'v<version>'`  
`git push`  
`git push --tags`
  
## 4. DEPLOY <a name="deploy"></a> 
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
+ in a tmux session to detached  
    `ctrl-b`  
+ to start a new tmux session  
    `tmux`  
`source /opt/nvm/nvm.ssh`    
`NODE_ENV=production PORT=$$$$ node ./main.js`: start server    
`ctrl-b d`: press ctrl and b, realese, then press *d* to quit tmux without killing it  
