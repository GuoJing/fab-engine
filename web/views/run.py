# coding: utf-8

import sys
import subprocess

from shelljob import proc
import eventlet
eventlet.monkey_patch()


from flask import Blueprint
from flask import Response
from flask.ext.mako import render_template

import os
PATH = os.path.dirname(os.path.realpath(__file__))
PATH = os.path.dirname(PATH)
PATH = os.path.dirname(PATH)

bp = Blueprint('run', __name__)


@bp.route('/fab/msg/<fabdir>/<fabfile>', methods=['GET', 'POST'])
def run_message(fabdir, fabfile):
    g = proc.Group()
    _path = PATH + '/fabs/%s/%s.py' % (fabdir, fabfile)
    print _path
    if not os.path.isfile(_path):
        return Response('data: done\n\n', mimetype='text/event-stream')

    cmd = [sys.executable, _path]
    # cmd = [ "bash", "-c", "for ((i=0;i<100;i=i+1)); do echo $i; sleep 1; done" ]
    p = g.run(cmd)

    def generate():
        while g.is_pending(): 
            lines = g.readlines()
            for proc, line in lines:
                yield "data:" + line + "\n\n"
        yield str("data: done\n\n")
    return Response(generate(), mimetype='text/event-stream')


@bp.route('/fab/<fabdir>/<fabfile>')
def run(fabdir, fabfile):
    return render_template('/run/index.html', **locals())
