#!/usr/bin/env python3

"""
Fabric script to deploy the backend application to the vm.
"""

from fabric.api import env, run, local, cd, put, sudo
from os.path import isdir, exists


env.hosts = ['<username>@<ip-address>']

def do_build():
    """
    Build the backend application.
    """
    try:
        if isdir('/tmp/backend') is False:
            local("mkdir /tmp/backend")
        file_name = "/tmp/backend/build.tar.gz"
        local("tar -czvf {} backend-service/dist".format(file_name))
        return file_name
    except Exception as e:
        print("Error while building the backend application.")
        print(e)
        return None
    
def do_deploy(build_file):
    """
    Distribute the backend service to the vm.
    """
    if exists(build_file) is False:
        print("Build file not found.")
        return False
    try:
        remote_tmp_dir = "/tmp/backend"
        remote_dist_dir = "/home/<username>/backend-service"
        run("mkdir -p {}".format(remote_tmp_dir))
        run("mkdir -p {}".format(remote_dist_dir))
        run("rm -rf {}/*".format(remote_tmp_dir))
        run("rm -rf {}/*".format(remote_dist_dir))
        put(build_file, remote_tmp_dir)
        with cd(remote_tmp_dir):
            run("tar -xzvf build.tar.gz")
            run("mv dist/* {}".format(remote_dist_dir))
        run("rm -rf {}".format(remote_tmp_dir))
        return True
    except Exception as e:
        print("Error while deploying the backend application.")
        print(e)
        return False
    
def do_service():
    """
    Create a service for the backend application if it does not exist.
    """
    try:
        service_name = "node-backend"
        service_file = "/etc/systemd/system/{}.service".format(service_name)
        if exists(service_file) is False:
            service = """
            [Unit]
            Description=Node Backend Service
            After=network.target

            [Service]
            Environment=NODE_PORT=<port>
            Type=simple
            User=<username>
            WorkingDirectory=/home/<username>/backend-service
            ExecStart=/usr/bin/node /home/<username>/backend-service/index.js
            Restart=on-failure

            [Install]
            WantedBy=multi-user.target
            """
            sudo("echo '{}' > {}".format(service, service_file))
            sudo("systemctl daemon-reload")
            sudo("systemctl enable {}".format(service_name))
            sudo("systemctl start {}".format(service_name))
            sudo("systemctl status {}".format(service_name))
        else:
            sudo("systemctl restart {}".format(service_name))
            sudo("systemctl status {}".format(service_name))
        return True
    except Exception as e:
        print("Error while creating the service for the backend application.")
        print(e)
        return False

def deploy():
    """
    Deploy the backend application to the vm.
    """
    build_file = do_build()
    if build_file is not None:
        if do_deploy(build_file) is True:
            do_service()
    else:
        print("Deployment failed.")

