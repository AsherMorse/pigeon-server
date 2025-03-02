#!/bin/bash
pkill -f "node"
caddy stop > caddy.log 2>&1 &