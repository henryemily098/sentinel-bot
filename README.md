# SELAMAT DATANG DI SENTINEL BOT

### Halaman github ini ditujukan sebagai halaman dari project Sentinel Bot. Ini cara-cara menggunakan project ini:
Pastikan anda sudah memiliki software <a href="https://www.apachefriends.org/" target="_blank">XAMPP</a> atau <a href="https://laragon.org/download" target="_blank">LARAGON</a> untuk menjalankan database Mysql secara lokal.
<div style="display=flex;">
    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/xampp-icon.png" height="50px" />
    <img src="https://copysymbol.org/wp-content/uploads/2024/08/laragon_logo1.webp" height="50px" />
</div>

<br/>

Setelah menginstall dari salah-satu kedua software tersebut, lakukan pembuatan database bernama `tubes_pbo` seperti berikut:<br/>
<img src="https://raw.githubusercontent.com/henryemily098/assets/refs/heads/main/Screenshot%202026-06-04%20154833.png" height="300px" />

### KONFIGURASI BACKEND
Anda harus membuat sebuah file bernama `.env` pada projek `backend` (langsung di root-nya). Atribut yang dibutuhkan adalah sebagai berikut:
```
OPEN_AI_APIKEY=
DISCORD_BOT_CLIENTID=
DISCORD_BOT_CLIENTSECRET=
DISCORD_BOT_CALLBACKURL=
```

`OPEN_AI_APIKEY` bisa didapatkan melalui situs <a href="https://platform.openai.com/home">OpenAI</a>, disini anda hanya perlu membuat API Key yang nanti-nya akan anda masukkan pada atribut `OPEN_AI_APIKEY`.
<img src="https://github.com/henryemily098/assets/blob/main/Screenshot%202026-06-14%20164630.png?raw=true" height="300px" /><br/>

`DISCORD_BOT_CLIENTID`, `DISCORD_BOT_CLIENTSECRET`, dan `DISCORD_BOT_CALLBACKURL` bisa didapatkan dari <a href="https://discord.com/developers/applications">Discord Developer Portal</a>, tepatnya ketika anda memilih App anda, pada halaman `OAuth2`. Sementara untuk `DISCORD_BOT_TOKEN`, bisa kalian dapat pada halaman `Bot` tepat di bawah halaman `OAuth2`.

<img src="https://github.com/henryemily098/assets/blob/main/Screenshot%202026-06-14%20163906.png?raw=true" height="300px" /><br/>
<img src="https://github.com/henryemily098/assets/blob/main/Screenshot%202026-06-14%20164349.png?raw=true" height="300px" /><br/>

### KONFIGURASI BOTEND
Anda harus membuat sebuah file bernama `.env` pada projek `botend` (langsung di root-nya). Atribut yang dibutuhkan adalah sebagai berikut:
```
TOKEN=
BASE_URL=http://localhost:3001
PORT=3002
```
Mendapatkan `TOKEN` disini sama seperti cara mendapatkan `TOKEN` untuk <b>konfigurasi backend</b>. Lalu `PORT` dan `BASE_URL` dapat menyesuaikan kebutuhan. Namun perlu diingat kalau `PORT` dan `BASE_URL` ini juga terdaftar pada `application.properties` pada `backend`, sehingga anda harus pastikan antara di `BOTEND` dan `BACKEND` kedua-nya sinkron.

### KONFIGURASI FRONTEND
Untuk yang ini, anda tidak perlu membuat file apapun. Andah hanya perlu mengatur file <a href="https://github.com/henryemily098/sentinel-bot/blob/master/frontend/src/config.json">`/frotend/src/config.json`</a>, bahkan tidak perlu diubah sama sekali:
```
{
    "baseURL": "http://localhost:3001"
}
```

## ⚠️CATATAN⚠️
Membuka projek ini terutama backend menggunakan Netbeans memerlukan beberapa konfigurasi manual tambahan seperti Project Lombok. Disarankan untuk membuka project ini menggunakan <a target="_blank" href="https://www.jetbrains.com/idea/">IntelliJ</a>.