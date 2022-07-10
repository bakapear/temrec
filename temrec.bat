@echo off
node %~dp0/bin/temrec %* -o output
if NOT ["%errorlevel%"]==["0"] pause