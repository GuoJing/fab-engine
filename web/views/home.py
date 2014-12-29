# coding: utf-8

from flask import Blueprint
from flask.ext.mako import render_template

bp = Blueprint('home', __name__)


@bp.route('/home')
@bp.route('/')
def home():
    return render_template('/index.html', **locals())
