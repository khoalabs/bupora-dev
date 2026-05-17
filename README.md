<b>[bupora.com](https://bupora.com)</b>

## 01 Update repository (⚡ Windows PowerShell)
```bash
# ⚙️ pull remote to local
cd D:\PY\site
.venv\Scripts\activate
git init
git config user.name 'Khoa'
git config user.email 'khoalabs@gmail.com'
git branch -M main
git remote add origin git@github.com:khoalabs/bupora.git
git fetch origin
git reset --hard origin/main
deactivate
npm install
npx @tailwindcss/cli -i ./static/input.css -o ./static/style.css --watch
npx @tailwindcss/cli -i ./static/input.css -o ./static/style.css --minify (prod)

flask run

# 🚀 pull local to remote
pip freeze > requirements.txt
deactivate
git add .
git commit -m 'update'
git push --force -u origin main
Get-ChildItem -Force | Where-Object { $_.Name -ne ".venv" } | Remove-Item -Recurse -Force

# 📌 test
flask db init
flask db migrate -m "init"
flask db upgrade
$env:FLASK_APP="app.py"
flask run # python app.py
```

## 02 Initial setup (⚡ Windows PowerShell)
```bash
VS Code extension = Tailwind CSS IntelliSense
Flask + Tailwind + Postgres + Ubuntu LTS (Linode) + Gunicorn + Nginx + Certbot

https://nodejs.org/en/download
  > node-v24.11.1-x64.msi
    Terminal (powershell)
      node --version

https://git-scm.com/install/windows
	> Use Visual Studio Code as Gits default editor
	> Override the default branch name for new repositories = main
	> Git from the command line and also from 3rd-party software
	> Use bundled OpenSSH
	> Use the native Windows Secure Channel library
	> Checkout Windows-style, commit Unix-style line endings
	> Use Windows default console window
	> Fast-forward or merge
	> Git Credential Manager
	> Enable file system caching + Enable symbolic links
	Terminal (powershell)
		git --version

https://github.com/khoalabs
  Create a new repository
    > bupora
    > Choose visibility = Private
    > Add README = On
    > Add .gitignore = Python
      __pycache__/
      *.pyc
      .venv/
      .ipynb_checkpoints/
      node_modules/
    > Add license = No license
  Repo → Settings → Deploy Keys
    Worker (windows 64 bit)
      Terminal (powershell)
        ssh-keygen -t ed25519 -C "dev" > (enter lấy tên mặc định id_ed25519)
        passphrase = pass123 # Có thể dùng ssh-agent để không phải nhập lại liên tục
        cat ~/.ssh/id_ed25519.pub > (copy public key)
      > Add deploy key
        title = worker
        key = (paste public key)
        allow write access = True
    Home (windows 64 bit)
      Terminal (powershell)
        ssh-keygen -t ed25519 -C "dev" > (enter lấy tên mặc định id_ed25519)
        passphrase > (enter để bỏ trống)
        cat ~/.ssh/id_ed25519.pub > (copy public key)
      > Add deploy key
        title = home
        key = (paste public key)
        allow write access = True
    ssh -T git@github.com > yes # test kết nối

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
  Windows x86-64 | PostgreSQL Version = 18.3
    Config
      PostgreSQL Server = True
      pgAdmin 4 = False
      Stack Builder = False
      Command Line Tools = True
      Password cho user postgres = admin
      Port = 5432
      Locale = en-US
    Terminal (powershell)
      & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres # pass = pass123 | vào postgresql shell bằng user mặc định postgres (superuser)
        CREATE ROLE app LOGIN PASSWORD 'test' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION; # tạo user cho ứng dụng
        CREATE DATABASE site OWNER app; # tạo database và gán owner
        ALTER DATABASE site SET client_encoding TO 'UTF8'; # config database
        ALTER DATABASE site SET default_transaction_isolation TO 'read committed';
        ALTER DATABASE site SET timezone TO 'UTC';
        ALTER ROLE app SET timezone TO 'UTC';
        ALTER ROLE app WITH PASSWORD 'test';
        ALTER ROLE postgres WITH PASSWORD 'admin';
		DROP DATABASE app;
        \l # kiểm tra sql
        \du # xem danh sách role thật sự
        \q # thoát sql
      & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U app -d site -h localhost -W # test kết nối
        \q # thoát sql

Project Layout
  site/
  ├── app.py
  ├── config.py
  ├── requirements.txt
  ├── .gitignore
  ├── templates/
  │   ├── base.html
  │   ├── navbar.html
  │   ├── footer.html
  │   ├── index.html
  │   ├── article.html
  │   ├── collection.html
  │   ├── create.html
  │   └── update.html
  ├── static/
  │   ├── input.css ← Tailwind source
  │   ├── style.css ← Tailwind build output
  │   └── script.js
  ├── .venv/
  └── admin.ipynb # test, init db,...

Virtual environments
  git --version
  node --version

  cd D:\PY\site

  git init
  git config user.name 'Khoa'
  git config user.email 'khoalabs@gmail.com'
  git branch -M main
  git remote add origin git@github.com:khoalabs/bupora.git
  git fetch origin
  git reset --hard origin/main
  npm init -y
  npm install tailwindcss @tailwindcss/cli

  py -3 -m venv .venv
  .venv\Scripts\activate
  py -m pip install --upgrade pip
  pip install --upgrade Flask Flask-SQLAlchemy Flask-Migrate psycopg2 requests pillow
  pip freeze > requirements.txt
  deactivate

  git add .
  git commit -m 'initial'
  git push -u origin main
  Get-ChildItem -Force | Where-Object { $_.Name -ne ".venv" } | Remove-Item -Recurse -Force
```

## 03 Deloy server (🐧 Linux Bash)
```bash
🐧 Server → 🐍 Python → 📦 Clone code → 🧪 Virtualenv → 🔐 Env → 🔥 Gunicorn → ⚙️ systemd → 🌐 Nginx
  root
  ├─ cài nginx
  ├─ cài python
  ├─ cài systemd service
  │
  app
  ├─ /var/www/site
  │   ├─ app.py
  │   ├─ .venv
  │   └─ code
  │
  └─ chạy gunicorn

⚙️ Initial setup
  ssh root@SERVER_IP

  apt update # cài các package cần thiết | apt upgrade -y
  apt install python3 python3-venv python3-pip postgresql postgresql-contrib nginx git -y

  systemctl status postgresql # kiểm tra service của postgresql
  sudo -u postgres psql # vào postgresql shell bằng postgres (superuser)
    CREATE ROLE app LOGIN PASSWORD 'strongpass' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION; # tạo user
    CREATE DATABASE site OWNER app; # tạo database và gán owner
    ALTER DATABASE site SET client_encoding TO 'UTF8'; # config database
    ALTER DATABASE site SET default_transaction_isolation TO 'read committed';
    ALTER DATABASE site SET timezone TO 'UTC';
    ALTER ROLE app SET timezone TO 'UTC';
    \q # thoát sql
  psql -U app -d site -h localhost -W # test kết nối
    \q # thoát sql

  adduser app # tạo user chạy ứng dụng
  mkdir -p /var/www/site # tạo project
  chown -R app:app /var/www/site # gán quyền cho user app
  
  su - app # chuyển sang user app

  ssh-keygen -t ed25519 -C "site" -f ~/.ssh/site
    passphrase = (enter để bỏ trống)
  chmod 700 ~/.ssh # phân quyền
  chmod 600 ~/.ssh/site
  chmod 644 ~/.ssh/site.pub
  cat ~/.ssh/site.pub
    → copy public key
  
  github → repo → settings → deploy keys > add deploy key (https://github.com/khoalabs/bupora)
    title = server
    key = (paste public key)
    allow write access = False
  
  nano ~/.ssh/config # cấu hình ssh config
    Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/site
    IdentitiesOnly yes
  chmod 600 ~/.ssh/config # phân quyền
  ssh -T git@github.com > yes # test kết nối

  cd /var/www/site # vào thư mục project
  python3 -m venv .venv # tạo virtual environment
  source .venv/bin/activate # activate virtual environment
  python3 -m pip install --upgrade pip

  git init # lấy code từ gitHub
  git remote add origin git@github.com:khoalabs/bupora.git
  git fetch origin
  git reset --hard origin/main

  export SECRET_KEY="very-long-secret"
  export DATABASE_PWD="super-password"

  pip install -r requirements.txt # cài dependency Python
  pip install gunicorn
  gunicorn -w 2 -b 127.0.0.1:8000 app:app # test chạy thử

  exit # thoát về root

  nano /etc/systemd/system/site.service # tạo systemd service
    [Unit]
    Description=Gunicorn App
    After=network.target

    [Service]
    User=app
    Group=app
    WorkingDirectory=/var/www/site

    Environment="SECRET_KEY=very-secret"
    Environment="DATABASE_PWD=super-password"

    ExecStart=/var/www/site/.venv/bin/gunicorn -w 2 -b 127.0.0.1:8000 app:app

    Restart=always
    RestartSec=5

    [Install]
    WantedBy=multi-user.target

  systemctl daemon-reload # start systemd service
  systemctl start site
  systemctl enable site
  systemctl status site # kiểm tra
  systemctl restart site

  rm /etc/nginx/sites-enabled/default
  nano /etc/nginx/sites-available/site # cấu hình nginx
    server {
      listen 80;
      server_name _;

      location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
    }
  ln -s /etc/nginx/sites-available/site /etc/nginx/sites-enabled # kích hoạt site
  nginx -t # test nginx
  systemctl reload nginx # or systemctl restart nginx | truy cập http://SERVER_IP để kiểm tra

  ufw allow OpenSSH # cấu hình firewall
  ufw allow 'Nginx Full'
  ufw enable

  journalctl -u site -f # log gunicorn

  apt install certbot python3-certbot-nginx -y # chứng chỉ HTTPS
  certbot --nginx -d yourdomain.com

🚀 update project
  ssh root@SERVER_IP
  su - app # chuyển sang user app
  cd /var/www/site
  git fetch origin
  git reset --hard origin/main
  source .venv/bin/activate
  python3 -m pip install --upgrade pip
  pip install -r requirements.txt

  exit # thoát về root
  systemctl restart site # restart service
  nano /etc/nginx/sites-available/site # nếu sửa nginx
  nginx -t
  systemctl reload nginx # hoặc systemctl restart nginx
```

## 04 Design
```bash
  Color Palette (Authority Hub > Dog Breed Hub > Blue = trust, knowledge, care, authority)
    primary (#2563EB / blue-600): CTA, links, highlight, brand color
    dark (#0F172A / slate-900): heading, logo text, nav
    accent (#22C55E / green-500): success, tags, small highlight
    background (#F9FAFB / gray-50): #F9FAFB
```
