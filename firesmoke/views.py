from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    MyModel,
    )

from config import *
from datetime import datetime, date
import forecastdt
import tarfile
import os

import colander
import deform
from pyramid.httpexceptions import HTTPFound
from datetime import datetime, tzinfo, timedelta

def find_current_date():
    """Returns current time in UTC in format of YYYYMMDDHH"""
    d = datetime.now().isoformat()
    year  = d[0:4]
    month = d[5:7]
    day   = d[8:10]
    hour  = d[11:13]
    if int(hour) < 12:
        hour = '00'
    elif 12 <  int(hour) <24:
        hour ='12'
    # return year+month+day+hour
    # returning arbitrary date due to lack of access to forecast serve
    return '2014042018'

# defines the Schema for contact form
class ContactForm(colander.MappingSchema):
    name = colander.SchemaNode(colander.String())
    email = colander.SchemaNode(colander.String())
    phone = colander.SchemaNode(colander.String()) # I think deform supports masking characters
    affilliation = colander.SchemaNode(colander.String())
    comments = colander.SchemaNode(
                colander.String(),
                validator=colander.Length(max=100),
                widget=deform.widget.TextAreaWidget(rows=10, cols=40),
                )


# class PST(tzinfo):
#         def utcoffset(self,dt):
#         # UTC-8, plus daylight savings time if in effect
#                 return timedelta(hours=-8) + self.dst(dt)
#         def dst(self, dt):
#                 # 2nd sunday in March
#                 d = datetime(dt.year, 3, 15)
#                 self.dston = d - timedelta(days=d.weekday() + 1)
#                 # 1st Sunday in November
#                 d = datetime(dt.year, 11, 8)
#                 self.dstoff = d - timedelta(days=d.weekday() + 1)
#                 if self.dston <= dt.replace(tzinfo=None) < self.dstoff:
#                         return timedelta(hours=1)
#                 else:
#                         return timedelta(0)
#         def tzname(self, dt):
#         # Western forecast in PST time
#                 return "PST"


# Make a class and make all views methods
# 
# Home view
#
@view_config(route_name='home', renderer='templates/home.jinja2')
def view_home(request):
    return {'home': False, 'Success': 'Success!'}

# 
# Forecast view
# 
@view_config(route_name='forecasts', renderer='templates/forecasts.jinja2')
def view_forecast(request):
    region  = request.matchdict['region'].capitalize()
    current_timezone = request.matchdict['timezone'] # date info
    dateYMD = request.matchdict['YYYYMMDDHH']        # date info

    opts_year     = forecastdt.find_opts_year()
    opts_month    = forecastdt.find_opts_month()
    opts_day      = forecastdt.find_opts_day()
    opts_hour     = forecastdt.find_opts_hour()
    opts_timezone = forecastdt.find_opts_timezone()

    class Schema(colander.Schema):
        year = colander.SchemaNode(
            colander.String(),
            default=date(1,1,1).today().year,
            widget=deform.widget.SelectWidget(values=opts_year)
            )
        month = colander.SchemaNode(
            colander.String(),
            default=date(1,1,1).today().ctime()[4:7].lower(),
            widget=deform.widget.SelectWidget(values=opts_month)
            )
        day = colander.SchemaNode( 
            colander.String(),
            default=date(1,1,1).today().ctime()[8:10].lower(),
            widget=deform.widget.SelectWidget(values=opts_day)
            )
        hour = colander.SchemaNode(
            colander.String(),
            widget=deform.widget.SelectWidget(values=opts_hour)
            )
        timeZone = colander.SchemaNode(
            colander.String(),
            default=current_timezone,
            widget=deform.widget.SelectWidget(values=opts_timezone)
            )
    
    schema = Schema()
    forecast_form = deform.Form(schema, buttons=('submit',))
    
    if 'submit' in request.POST:
        year = request.params.get('year')
        month =  forecastdt.month_str2num( request.params.get('month') )
        day = request.params.get('day')
        hour = request.params.get('hour')
        timezone = request.params.get('timeZone')

        return HTTPFound(location=request.route_url('forecasts', region=region, timezone=timezone, YYYYMMDDHH=year+month+day+hour))
    else:
        # determine whether date was specified or to resolve to default, and make sure date is valid!!
        try:
            int(dateYMD)
            dateYMD = find_current_date() # this here is temporary - until acces to NFS mounts
        except ValueError:
            dateYMD = find_current_date()
        
        # use config files to define easily configured values based on region and other params
        # path below on archive server (bs1, or bs2) on webserver /nfs/ (bluesky1,bluesky2) /archive/dispersion/...
        # '/Bluesky/archive/dispersion/ (canada,east,west) /...
        forecast_date = dateYMD[0:8] + '-' + dateYMD[8:10]
        file_base = 'images-' + region + '-' + forecast_date
        read_dir = read_dir_abs + region + '/'
        write_dir = write_dir_abs + file_base
        tar_file = read_dir + file_base + ext

        # Check to see if file is already extracted, if it is not, extract it
        if not os.path.exists(write_dir):
            # If write_dir is created between os.path.exists() and os.makedirs() move along
            try:
                os.makedirs(write_dir)
            except:
                pass
            # Check to see if file exists and is a tarfile
            try:
                tarfile.is_tarfile(name=tar_file)
            except:
                error = 'Error finding forecast directory in tar.gz format'
                return {'error': error, 'form': forecast_form}

            # Open tarfile object using default naming convention (eg: images-east-20140420-18.tgz)
            #    if exception occurs return error to template - informing us would be good too
            try:
                tar = tarfile.open(name=tar_file)
            except: # might want to name some exceptions here?
                tar.close()
                return {'error': 'Error extracting forecast from tar.gz format'}
            
            # Extract to cache folder
            tar.extractall(path=write_dir)

        # generate links to images to send to javascript
        files = list()
        for f in os.listdir(write_dir):
            if f.endswith(".jpg"):
                files.append(f)
        if len(files) == 0:
            return {'error': 'unable to find forecast images, please try again', 'form': 'forecast_form'}
        files = ['/cache/' + file_base + '/' + s for s in files]

        #write to .json file to allow javascript to read variables <- lower priority

        return {'region': region, 'forecast_date': dateYMD, 'error': False, 'image_set': files, "form": forecast_form}

#
# Data
#
@view_config(route_name='data', renderer='templates/data.jinja2')
def view_about(request):
    return {}

#
# Resources
#
@view_config(route_name='resources', renderer='templates/resources.jinja2')
def view_resources(request):
    return {}

#
# Contact Us
#
@view_config(route_name='contact', renderer='templates/contact.jinja2')
def view_resources(request):
    schema = ContactForm()
    myform = deform.Form(schema, buttons=('submit',))

    if 'submit' in request.POST:
        controls = request.POST.items()
        try:
            appstruc = myform.validate(controls)
        except ValidationFailure, e:
            return {'form': e, 'values': False}

        return {"form": myform, "message": "Thank you for your comments"}
    return {"form": myform }

conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to run the "initialize_FireSmoke_db" script
    to initialize your database tables.  Check your virtual 
    environment's "bin" directory for this script and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""