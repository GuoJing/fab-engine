#!/usr/bin/env python
# coding: utf-8

from flask_script import Manager

from app import create_app

from gunicorn.app.wsgiapp import WSGIApplication

app = create_app()
manager = Manager(app)


@manager.command
def http(host=None, port=None, workers=None):
    """Runs the app within Gunicorn."""
    host = host or app.config.get('HTTP_HOST') or '0.0.0.0'
    port = port or app.config.get('HTTP_PORT') or 5000
    workers = workers or app.config.get('HTTP_WORKERS') or 1
    use_evalex = app.config.get('USE_EVALEX', app.debug)

    if app.debug:
        app.run(host, int(port), use_evalex=use_evalex)
    else:
        gunicorn = WSGIApplication()
        gunicorn.load_wsgiapp = lambda: app
        gunicorn.cfg.set('bind', '%s:%s' % (host, port))
        gunicorn.cfg.set('workers', workers)
        gunicorn.cfg.set('pidfile', None)
        gunicorn.cfg.set('accesslog', '-')
        gunicorn.cfg.set('errorlog', '-')
        gunicorn.chdir()
        gunicorn.run()

if __name__ == '__main__':
    manager.run()
