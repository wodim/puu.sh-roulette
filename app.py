import string
import requests
import random
import socket
import httplib

from flask import Flask, render_template, jsonify

characters = list(string.digits) + list(string.ascii_letters)
max_tries = 20
socket.setdefaulttimeout(3)

app = Flask(__name__)

def to_id(number):
    id = []

    while number > 0:
        id.append(characters[number % len(characters)])
        number /= len(characters)

    return ''.join(id[::-1])

def from_id(id):
    str = list(id)
    output = 0

    while str:
        output += characters.index(str.pop()) * (len(characters) ** (len(id) - (len(str) + 1)))

    return output

min_puush = from_id('50000')
max_puush = from_id('7J000')

def fetch_url():
    errors = []
    tries = 0
    while tries < max_tries:
        tries += 1

        url = 'http://puu.sh/%s' % to_id(random.randint(min_puush, max_puush))
        try:
            r = requests.head(url, timeout=3)
        except (requests.exceptions.RequestException, socket.timeout, httplib.IncompleteRead):
            errors.append({'url': url, 'error': 'Request timeout, socket timeout or incomplete read'})

        if r.status_code != requests.codes.ok:
            errors.append({'url': url, 'error': 'HTTP request not OK: %d' % r.status_code})
            continue
        if r.headers.get('Content-Type') is None:
            errors.append({'url': url, 'error': 'Text attachment'})
            continue
        if not r.headers.get('content-type').startswith('image/'):
            errors.append({'url': url, 'error': 'Not an image'})
            continue

        size = round(int(r.headers.get('content-length')) / float(1024), 2)
        return {'success': True, 'image': {'url': url, 'size': size}, 'tries': tries, 'errors': errors}

    return {'success': False, 'tries': tries, 'errors': errors}

@app.route('/random/')
def get_random():
    return jsonify(fetch_url())

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=1488)
