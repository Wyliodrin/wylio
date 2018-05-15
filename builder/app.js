const commands = ['new', 'list', 'edit', 'remove', 'describe', 'parameter', 'versions', 'deploy', 'undeploy', 'init', 'build', 'push'];
const _ = require ('lodash');
module.exports = function (yargs, handler){
    yargs.command(['app', 'a'], 'Application settings.',
     (yargs) => {
        yargs.command (['new','n'],  'Creates a new application.', {
            name: {
                alias: 'n',
                type: 'string',
                desc: 'The name of the application.',
                demandOption: true
            },
            id: {
                type: 'string',
                desc: 'A unqiue fully qualified domain name.',
                demandOption: true
            },
            author: {
                alias: 'a',
                desc: 'The name of the author of the application.',
                demandOption: true,
                type: 'string'
            },
            platform: {
                alias: 'p',
                type: 'string',
                demandOption: true,
                choices: ['arm', 'x86']
            },
            privileged: {
                alias: 'prv',
                desc: 'Specifies if the application should run in a priviliged container. If set to true, it will allow the application to access all the resources of the product',
                default: false,
                type: 'boolean'
            }
        }, handler.new)
        .command (['list', 'l'], 'List all applications.', {}, handler.list)
        .command (['remove <app_id>', 'r'], 'Remove application.', {}, handler.delete)
        .command (['describe <app_id>', 'd'], 'Describe application.', {}, handler.get)
        .command ('init', 'Init application for building docker image.', {
            id: {
                alias: 'a',
                type: 'string',
                desc: 'The id of the application.'
            },
            dir: {
                alias: 'd',
                type: 'string',
                desc: 'The path to the directory where the application will be built.'
            }
        }, handler.init)
        .command ('build', 'Build docker image for application', {
            'app-version': {
                alias: 'v',
                desc: 'The number of this image version.',
                type: 'number'
            }
        }, handler.build)
        .command (['parameter', 'p'], 'Adds or removes a parameter.', 
        (yarg) => {
            yarg.command ('add', 'Adds a new parameter.', {
                name: {
                    alias: 'n',
                    desc: 'Parameter name.',
                    type: 'string',
                    demandOption: true
                },
                values: {
                    alias: 'v',
                    desc: 'Parameter values.',
                    type: 'array',
                    demandOption: true
                },
                id: {
                    alias: 'app',
                    desc: 'The application id.',
                    type: 'string',
                    demandOption: true
                }
            }, handler.addParam)
            .command ('remove', 'removes the parameter from the product', {
                name: {
                    alias: 'n',
                    desc: 'Parameter name.',
                    type: 'string',
                    demandOption: true
                },
    
                id: {
                    alias: 'app',
                    desc: 'The application id.',
                    type: 'string',
                    demandOption: true
                }
            }, handler.deleteParam)
            .check ((argv)=>{
                if (argv._[2] === 'add' || argv._[2] === 'remove')
                return true;
            throw new Error ('Invalid command.');
            })
            .help ()
            .demandCommand ();
        })
        .command ('versions <app_id>', 'List application versions.', {}, handler.versions)
        .command (['deploy', 'depl'], 'Deploy application on a cluster.', {
            id: {
                alias: 'app',
                desc: 'The id of the application to deploy.',
                demandOption: true,
                type: 'string'
            },
            'cluster-id': {
                alias: 'cluster',
                desc: 'The id of the cluster to deploy on.',
                demandOption: true,
                type: 'string'
            },
            type: {
                alias: 't',
                choices: ['beta','production','development'],
                default: 'beta',
                type: 'string'
            },
            'app-version': {
                alias: 'v',
                desc: 'The version of the application to deploy.',
                demandOption: true,
                type: 'number'
            },
            rollback: {
                alias: 'r',
                desc: 'How many versions behind to rollback.',
                default: 0,
                type: 'number'
            },
            network: {
                alias: 'n',
                choices: ['default', 'host'],
                default: 'default',
                type: 'string'
            },
            privileged: {
                alias: 'prv',
                desc: 'Specifies if the application should run in a priviliged container. If set to true, it will allow the application to access all the resources of the product',
                default: false,
                type: 'boolean'
            },
            'parameter-name': {
                desc: 'Name of the parameter used to start the application container. Requires parameter-values set.',
                type: 'string',
                demandOption: false
            },
            'parameter-values': {
                desc: 'Values of the parameter used to start the application container. Requires parameter-name set.',
                type: 'array',
                demandOption: false
            }
        }, handler.deploy)
        .command (['undeploy', 'undepl'], 'Undeploy an application from a cluster', {
            id: {
                desc: 'Id of the deployment to be undeployed',
                type: 'string',
                demandOption: true
            },
            'app-id': {
                alias: 'app',
                desc: 'The id of the application to undeploy.',
                demandOption: true,
                type: 'string'
            },
            'cluster-id': {
                alias: 'cluster',
                desc: 'The id of the cluster to undeploy from.',
                demandOption: true,
                type: 'string'
            },
            type: {
                alias: 't',
                choices: ['beta','production','development'],
                default: 'beta',
                type: 'string'
            }
        }, handler.undeploy)
        .check ((argv)=>{
            if (_.indexOf (commands, argv._[1]) != -1)
                return true;
            throw new Error ('Invalid command.');
        })
       .help ()
       .demandCommand ();
     });
    return yargs;
};