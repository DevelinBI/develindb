@echo off

REM The name of the file that will be created
set filename=electronfileexample.txt
REM the path where the file will be created
set filepath=c:\xampp\htdocs\develindb\data
REM the content of the file
set content=Hello, this is the content of my file created with batch
REM the full path (path+filename)
set fullpath=%filepath%%filename%

echo Sending a "JSON" String
echo {"filename":"%filename%","content":"%content%","fullpath":"%fullpath%"}

REM Text to send to stdout (data)
REM Note that you can append 2>&1 to the normal stdout
REM echo This text will be sent to my Electron Project
REM or
REM echo This text will be sent to my Electron Project 2>&1

REM Text to send to stderr (error) 1>&2
REM echo This text should ouput an error 1>&2

echo An error message passing by, nothing important :) Just ignore me 1>&2

IF EXIST %filepath%%filename% (
    echo File already exists
    EXIT /B 1
) ELSE (
    @echo Creating file in %fullpath%
    (
      echo %content%
    ) > %filepath%%filename%
)

REM Check if the file was created, if exists send code 2
REM if the file doesn't exist then send code 3 (error while creating)
IF EXIST %filepath%%filename% (
    EXIT /B 2
) ELSE (
    EXIT /B 3
)
