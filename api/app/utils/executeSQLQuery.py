def executeSQLQuery(query:str, cursor, columnPosition:int):
    cursor.execute(query)
    players = cursor.fetchall()
    columnNames = ["pos"] + [desc[0] for desc in cursor.description]
    return {"columnPosition":columnPosition,"data":[
        dict(zip(columnNames, (idx + 1,) + player))
        for idx, player in enumerate(players)
    ]}