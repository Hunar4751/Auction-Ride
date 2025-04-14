from flask import Flask, render_template, request, session, redirect, jsonify
import google.oauth2.id_token
from google.auth.transport import requests as grequests

app = Flask(__name__)
app.secret_key = '123456789'

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

@app.route('/bot')
def bot():
    return render_template('bot.html')

@app.route('/')
def dashboard():
    if 'user' not in session:
        return redirect('/login')
    return render_template('home.html', user=session['user'])  # your main page

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

        return jsonify({'success': True})
    except Exception as e:
        print(e)
        return jsonify({'success': False})

@app.route('/')
def home():
    return render_template('home.html', page_style='homepage')

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
    app.run(debug=True)


