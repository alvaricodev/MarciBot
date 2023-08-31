const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
  {
    name: 'getlastmatch',
    description: 'Get information about the last Dota 2 match played by a player.',
    options: [
      {
        name: 'account_id',
        description: 'Steam32 account ID',
        type: 3, // Type 3 represents a string (account_id)
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '9' }).setToken('MTE0Njg0NDY5NjI0MTUxMjYyNA.GkDoUf.x3ntoh4JoRI25NPtWd-gSMxO0AWY69Iqio63gc'); // Replace with your bot token

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('1146844696241512624', '1146889925443194911'), // Replace with your client ID and guild ID
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
