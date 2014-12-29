# coding: utf-8


from fabric.api import run, settings


def run_command():
    '''
    Run command in Localhost
    '''
    HOST_STRING, PASSWD = 'guojing@localhost', 'password'
    PASSWORD_DICT = dict(HOST_STRING=PASSWD)
    with settings(host_string=HOST_STRING,
                  password=PASSWORD_DICT):
        print run_command.__doc__
        try:
            run('uname -s')
        except Exception as e:
            print e.message
        try:
            run('pwd')
        except Exception as e:
            print e.message
    return 'OK'

if __name__ == '__main__':
    run_command()
