# This file sets the configuration for FireSmole.ca
# In all data structure (currently dictionaries) is the default 
# 
# For all menus and submenus added later on, they must have a 
# respective template to be rendered by the route configuration
# 
# 
# 


RUN_MODES  = ['Dispersion', 'Emissions', 'Meteorology']
REGIONS    = ['Canada', 'East', 'West']
FIRE_SRCS  = ['SF2', 'CWFIS']
MET_MODELS = ['WRF3', 'MM5']
MET_FCSTS  = ['BSC-Canada', 'BSC-East', 'BSC-West']
MET_GRIDS  = ['36km', '12km', '4km']

# main menus
MENU = [
	['forecasts', 'templates/forecasts.jinja2'],
	['data', 'templates/data.jinja2'],
	['resources', 'templates/resources.jinja2'],
]

# drop-down menus0
SUB_MENUS = {
	'forecasts':[
		('forecast_canada', 'templates/forecast_canada.jinja2'),
		('forecast_east',   'templates/forecast_east.jinja2'),
		('forecast_west',   'templates/forecast_west.jinja2'),
		('forecast_development', 'templates/forecast_development.jinja2'),
	],
	'data':[
		# currently no sub menus
	],
	'resources':[
		# currently no sub menus
	],
}

# tarfile location
ext = '.tgz'
read_dir_abs  = '/Users/shayes/Documents/BScache/BSC-archives/dispersion/' #+ region + '/'
write_dir_abs = '/Users/shayes/Projects/BlueSky/FireSmoke/firesmoke/cache/' # + file_base