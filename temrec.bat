@echo off
node bin/temrec %* -o output
if NOT ["%errorlevel%"]==["0"] pause