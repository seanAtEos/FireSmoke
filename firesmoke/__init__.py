from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_static_view('cache', 'cache', cache_max_age=3600)
    # add static view for directory containing un-tarred forecasts here
    
    config.add_route('home', '/')    
    config.add_route('forecasts', '/forecasts/{region}/{timezone}/{YYYYMMDDHH}')
    config.add_route('forecasts-redirect', '/forecasts/{region}')
    
    config.add_route('data', '/data')
    config.add_route('resources', '/resources')
    config.add_route('contact', '/contact')
    config.scan()
    return config.make_wsgi_app()
