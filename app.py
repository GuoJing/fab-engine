# coding: utf-8

import sys

reload(sys).setdefaultencoding('utf-8')

from flask import Flask
from werkzeug.utils import import_string
from werkzeug.contrib.fixers import ProxyFix

from ext import mako

blueprints = [
    'web.views.home:bp',
    'web.views.run:bp',
]


def create_app(config=None):
    """Creates application instance."""

    app = Flask(__name__)

    app.config.from_pyfile('default.cfg')
    try:
        app.config.from_pyfile('app.cfg')
    except:
        pass
    app.config.from_object('envcfg.json.saengine')

    mako.init_app(app)
    app.template_folder = 'web/templates'

    for blueprint_qualname in blueprints:
        blueprint = import_string(blueprint_qualname)
        app.register_blueprint(blueprint)

    return app

app = create_app()
app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.run('0.0.0.0', 60002, debug=True)
