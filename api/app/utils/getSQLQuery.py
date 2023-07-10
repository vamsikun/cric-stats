def executeSQLQuery(query:str, cursor, columnPosition:None|int=None, havingClause:None|str=None):
    cursor.execute(query)
    results = cursor.fetchall()
    # TODO: modify this function so that it does only the execution part
    if columnPosition!=None and havingClause!=None:
        columnNames = ["pos"] + [desc[0] for desc in cursor.description]
        return {"metadata":{"columnPosition":columnPosition,"havingClause":havingClause},"data":[
            dict(zip(columnNames, (idx + 1,) + row))
            for idx, row in enumerate(results)
        ]}
    elif havingClause!=None:
        columnNames = [desc[0] for desc in cursor.description]
        return {
            "metadata":{"havingClause":havingClause},
            "data": [
                dict(zip(columnNames, row)) for idx,row in enumerate(results)
            ]
        }
        

def getWherePredicate(**kwargs):
    filteredKwargs = []
    for key,value in kwargs.items():
        if value != None:
            filteredKwargs.append((key,value))
    wherePredicate = " AND ".join(f"{key}={value!r}" for key,value in filteredKwargs)
    return wherePredicate