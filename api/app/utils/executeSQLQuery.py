def executeSQLQuery(query:str, cursor, filterOn:str):
    cursor.execute(query)
    players = cursor.fetchall()
    columnNames = ["pos"] + [desc[0] for desc in cursor.description]
    columnPosition = columnNames.index(filterOn)
    print(columnPosition, filterOn)
    return {"columnPosition":columnPosition,"data":[
        dict(zip(columnNames, (idx + 1,) + player))
        for idx, player in enumerate(players)
    ]}