import datetime
import json

from flask import Flask, render_template, request, redirect
import pandas as pd
import requests

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def main():
  return redirect('/index')

@app.route('/index')
def index():
  return render_template('index.html')


@app.route('/nyc_current.csv')
def nyc_current():
  if STATIC_DATA_ONLY:
    resp = json.loads(open('sample_nyc.json').read())
  else:
    print "request happening."
    resp = requests.get(MTA_API_BASE.format(MTA_API_KEY)).json()
  

  info = resp['Siri']['ServiceDelivery']['VehicleMonitoringDelivery'][0]['VehicleActivity']
  return pd.DataFrame([flatten_dict('', i, {}) for i in info]).to_csv()

@app.route('/positions_at_time.csv')
def positions_at_time():
  hours = int(request.args.get('hours', 12))
  minutes = int(request.args.get('minutes', 30))
  date_for_data = datetime.date(2016, 02, 10)
  time_for_data = datetime.time(hours, minutes)
  
  datetime_for_data = datetime.datetime.combine(date_for_data, time_for_data)
  #1 minute window
  lower_bound = datetime_for_data - datetime.timedelta(seconds=120)
  upper_bound = datetime_for_data + datetime.timedelta(seconds=120)

  return archive[(archive.timestamp > lower_bound) & (archive.timestamp < upper_bound) & (~archive.latitude.isnull())].to_csv()


if __name__ == '__main__':
  app.run(port=33507, debug=True, host="0.0.0.0")
