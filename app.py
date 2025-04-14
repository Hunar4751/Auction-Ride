from flask import Flask, render_template, request, session, redirect, jsonify
import requests
import google.oauth2.id_token
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from google.auth.transport import requests as grequests

app = Flask(__name__)
app.secret_key = '123456789'

# Replace with your own Google API key and Gmail credentials
API_KEY = "AIzaSyB5qUBYtuMMFUloOA5gRnpC-Br-aYaD4tc"

# ---------- Email Function ----------
def send_email(to_email, subject, body):
    sender_email = "100daysofpythong@gmail.com"
    sender_password = "tsfuizzdiojpaeka"  # Use an App Password for Gmail with 2FA

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, message.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# ---------- Routes ----------

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


@app.route('/finalbid')
def finalbid():
    carname = request.args.get('carname')
    pic = request.args.get('pic')
    timer = request.args.get('timer')
    return render_template('finalbid.html', carname=carname, pic=pic, timer=timer)






@app.route('/bot')
def bot():
    return render_template('bot.html')

@app.route('/google-login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    try:
        id_info = google.oauth2.id_token.verify_oauth2_token(
            token,
            grequests.Request(),
            '149237752978-thtrp527mbnie638lnvdtjeamqnr154e.apps.googleusercontent.com' 
        )

        session['user'] = {
            'name': id_info['name'],
            'email': id_info['email'],
            'picture': id_info.get('picture')
        }

        # Send welcome email
        send_email(
            to_email=id_info['email'],
            subject="Welcome to Auction Ride!",
            body=f"Hi {id_info['name']},\n\nThanks for logging in to Auction Ride. Enjoy the bidding experience!\n\nBest,\nAuction Ride Team"
        )

        return jsonify({'success': True})
    except Exception as e:
        print(e)
        return jsonify({'success': False})

@app.route('/')
def home():
    if 'user' not in session:
        return redirect('/login')
    return render_template('home.html', user=session['user'], page_style='homepage') 

@app.route('/realbid')
def realbid():
    return render_template('realbid.html', page_style='faq')

@app.route('/FAQ')
def faq():
    return render_template('faq.html', page_style='faq')

@app.route('/bid')
def bid():
    return render_template('bid.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  
    app.run(debug=True, host='0.0.0.0', port=port)
