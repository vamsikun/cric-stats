def executeSQLQuery(query:str, cursor, columnPosition:None|int=None, havingClause:None|str=None, includePosition:bool=False):
    cursor.execute(query)
    results = cursor.fetchall()
    # TODO: modify this function so that it does only the execution part
    metadata = {"columnPosition":columnPosition,"havingClause":havingClause}
    if includePosition:
        columnNames = ["pos"] + [desc[0] for desc in cursor.description]
        data = [
            dict(zip(columnNames, (idx + 1,) + row))
            for idx, row in enumerate(results)
        ]
    else:
        columnNames = [desc[0] for desc in cursor.description]
        data = [
                dict(zip(columnNames, row)) for idx,row in enumerate(results)
            ]
    return {"metadata":metadata,"data":data}

def getWherePredicate(**kwargs):
    filteredKwargs = []
    for key,value in kwargs.items():
        if value != None:
            filteredKwargs.append((key,value))
    wherePredicate = " AND ".join(f"{key}={value!r}" for key,value in filteredKwargs)
    return wherePredicate
