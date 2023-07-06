def executeSQLQuery(query:str, cursor, columnPosition:int, havingClause:str):
    cursor.execute(query)
    players = cursor.fetchall()
    columnNames = ["pos"] + [desc[0] for desc in cursor.description]
    return {"metadata":{"columnPosition":columnPosition,"havingClause":havingClause},"data":[
        dict(zip(columnNames, (idx + 1,) + player))
        for idx, player in enumerate(players)
    ]}