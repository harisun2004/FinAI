from flask import Flask, request, jsonify
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

app = Flask(__name__)

# In-memory storage for emails 
email_database = []

# SMTP configuration for sending emails (Gmail example)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'your-email@gmail.com'
SENDER_PASSWORD = 'your-email-password'

# Function to send an email
def send_email(to, cc, bcc, subject, body):
    try:
        # Set up the SMTP server connection
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to
        if cc:
            msg['Cc'] = cc
        if bcc:
            msg['Bcc'] = bcc
        msg['Subject'] = subject


        msg.attach(MIMEText(body, 'plain'))

        # Send the email
        server.sendmail(SENDER_EMAIL, [to] + (cc.split(',') if cc else []) + (bcc.split(',') if bcc else []), msg.as_string())
        server.quit()

        email_database.append({
            'to': to,
            'cc': cc,
            'bcc': bcc,
            'subject': subject,
            'body': body,
            'date_sent': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })

        return True, "Email sent successfully"
    except Exception as e:
        return False, str(e)


# Endpoint to send an email
@app.route('/api/send-email', methods=['POST'])
def send_email_endpoint():
    data = request.get_json()

    # Extract details from the request
    to = data.get('to')
    cc = data.get('cc', '')
    bcc = data.get('bcc', '')
    subject = data.get('subject')
    body = data.get('body')

    if not to or not subject or not body:
        return jsonify({'success': False, 'message': 'Missing required fields (to, subject, or body)'}), 400

    success, message = send_email(to, cc, bcc, subject, body)

    if success:
        return jsonify({'success': True, 'message': message}), 200
    else:
        return jsonify({'success': False, 'message': message}), 500


# Endpoint to search emails
@app.route('/api/search-email', methods=['POST'])
def search_email():
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({'success': False, 'message': 'Search query is required'}), 400

    # Search through the email database
    results = [email for email in email_database if 
               query.lower() in email['subject'].lower() or 
               query.lower() in email['body'].lower() or
               query.lower() in email['to'].lower() or
               (email['cc'] and query.lower() in email['cc'].lower()) or
               (email['bcc'] and query.lower() in email['bcc'].lower())]

    return jsonify({'success': True, 'results': results}), 200


if __name__ == '__main__':
    app.run(debug=True)
