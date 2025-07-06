def read_commands_from_file(fpath):
    sql_commands = []
    try:
        with open(fpath, "r") as f:
            lines = f.read()

        for command in lines.split(";"):
            command = command.strip()
            if command:
                sql_commands.append(command)

        return sql_commands
    
    except Exception as e:
        print("Error while reading commands from file:", e)
        return sql_commands