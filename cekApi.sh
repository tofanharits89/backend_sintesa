#!/bin/bash

cmd_window_title="Sintesa API Status Check"

echo "Memulai cek API Backend Sintesa..."

while true; do
    status=$(curl -k -s -o /dev/null -w "%{http_code}" "https://sintesa.kemenkeu.go.id:88/status")
    echo "$(date +"%Y-%m-%d %H:%M:%S") - Status: $status"

    if [[ $status -eq 200 ]]; then
        if [[ -n $cmd_pid ]]; then
            echo "Pemanggilan API Sintesa Berhasil dengan pid $cmd_pid"
            taskkill //PID $cmd_pid //F >nul 2>&1
            echo "Closed existing nodemon process with PID $cmd_pid"
            unset cmd_pid
        else
            echo "Pemanggilan API Sintesa Berhasil"
        fi
    else
        echo "Pemanggilan API Sintesa Gagal. Mencoba kembali dalam 10 detik..."
        if [[ -z $cmd_pid ]]; then
            echo "Starting nodemon..."
            cd /c/sintesa_ssl/backend
            nodemon --max-old-space-size=4096 index.js &
            cmd_pid=$!
            echo "Started nodemon with PID $cmd_pid"
        fi
        sleep 10
    fi

    sleep 60
done
