Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = "C:\Users\thoma\Downloads\Dev.bot\startup"
shell.Run "cmd /k startup.bat",0,True