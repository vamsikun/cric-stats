# 2023-05-17

- have used 'mongoimport' command line tool along with simple bash for loop for importing all ipl matches json files into a collection
- for some matches the "info.season" field had integer type so had to modify them using the following mondodb command

```mongodb
db.matches.updateMany({"info.season":{$type:16}},[{$set:{"info.season":{$convert:{input:"$info.season",to:2}}}}])
```

### Related Docs:

- [using mongoimport](https://stackoverflow.com/questions/19441228/insert-json-file-into-mongodb)
- [changing type of field](https://stackoverflow.com/questions/4973095/how-to-change-the-type-of-a-field)
- [$type in mongodb](https://www.mongodb.com/docs/manual/reference/operator/query/type/)
