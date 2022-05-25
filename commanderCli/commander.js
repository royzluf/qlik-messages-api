const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../config/config.env` });
const { program } = require('commander');
const commands = require('./commands');

program.version('1.0.0').description('Command-line interface - qlik-messages)');

program.command('get-all').description('Get all messages').action(commands.getAllMessages);
program.command('get').description('Get one message by id').argument('<messageId>').action(commands.getMessageById);
program.command('create').description('Create a messsage').argument('<messageText>').action(commands.createMessage);
program.command('update').description('Update a message').arguments('<messageId>').argument('<messageText>').action(commands.updateMessage);
program.command('delete').description('Delete a message').arguments('<messageId>').action(commands.deleteMessage);

program.parse(process.argv);
