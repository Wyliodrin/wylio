const _ = require ('lodash');
const commands = ['init', 'run'];
module.exports = function (yargs, handler){
    yargs.command(['project', 'proj'], 'Project settings.',
     (yargs) => {
        yargs.command ('init',  'Creates a new project template.', {
            name: {
                alias: 'n',
                type: 'string',
                desc: 'The name of the project.'
            },
            'app-id':{
                alias: 'app',
                type: 'string',
                desc: 'The id of the application linked to this project.'
            },
            language: {
                type: 'string',
                choices: ['javascript', 'js', 'python', 'py']
            }
        }, handler.init)
        .command (['run <product_id>', 'r'], 'Runs the current project', {}, handler.run)
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