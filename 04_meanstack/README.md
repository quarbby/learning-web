**Following**: 
Learn to Build Modern Web Apps with MEAN by Thinkster [link](https://thinkster.io/mean-stack-tutorial)

**To Run**
```
$./mongod &
$npm start
```

**Further Resources**
* [Setting up a database](https://docs.c9.io/docs/setup-a-database#mongodb)
* [Setting up MongoDB on Cloud9 Workspace](https://community.c9.io/t/setting-up-mongodb/1717)
```
$ mkdir data
$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
$ chmod a+x mongod
$ ./mongod
```
* [Repairing MongodDB](http://stackoverflow.com/questions/12831939/couldnt-connect-to-server-127-0-0-127017)
```
$sudo rm data/mongod.lock
$sudo mongod --repair
$./mongod
```