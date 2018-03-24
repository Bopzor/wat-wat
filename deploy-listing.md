#THINGS TO DO FOR DEPLOYED:  


####1.BEFORE MERGE  
####2.MERGE  
####3.AFTER MERGE  
####4.DEPLOY  
  + START SERVER WITH TMUX


___________________________

###1.BEFORE MERGE

Test show, hide, add, delete, sort. And all other feature of wat-wat.  
Fix what is needed to.  
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
When you are SURE everything is OK, test again.  
`git add <modified-file>`  
`git commit -m 'the commit message'`  
Test show, hide, add, delete, sort. And all other feature of wat-wat.  
`git push`  
`git checkout mep`  

___________________________

###2.MERGE

`git merge <branch to merge>`


___________________________

###3.AFTER MERGE

Change version in package.json  
`git add package.json`  
`git commit -m 'bump version'`  
`git tag -a <version> -m 'v<version>'`  
`git push`  
`git push --tags`


___________________________

###4.DEPLOY

`ssh twix`  
`source /opt/nvm/nvm.sh`  
`cd /var/www/movies-list`  
`git status`  
`git pull origin mep`  
`rm -rf node_modules`  
`npm install`  
`sh .bundle.sh "http://wat-wat.nilslayet.com"`


___________________________

+ ####START SERVER WITH TWIX

    + to attach an existing tmux session  
    `tmux a`  
    + in a tmuxm sessionm to detached  
    `ctrl-b`  
    + to start a new tmux session  
    `tmux`  

`source /opt/nvm/nvm.ssh`    
`NODE_ENV=production PORT=$$$$ node ./main.js`    
`ctrl-b d`  
