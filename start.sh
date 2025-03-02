#!/bin/bash
nohup npm start > server.log 2>&1 &
nohup sudo caddy start > caddy.log 2>&1 &