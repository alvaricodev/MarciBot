const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages, // Add this intent for sending direct messages
  ],
});

const TOKEN = 'MTE0Njg0NDY5NjI0MTUxMjYyNA.GkDoUf.x3ntoh4JoRI25NPtWd-gSMxO0AWY69Iqio63gc'; // Replace with your bot token
const OPENDOTA_API_KEY = 'https://api.opendota.com/api'; // Replace with your OpenDota API key

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Function to fetch hero name based on hero_id
async function getHeroName(heroId) {
  try {
    const response = await axios.get(`https://api.opendota.com/api/heroes`);
    const heroes = response.data;

    const hero = heroes.find((h) => h.id === heroId);

    if (hero) {
      return hero.localized_name; // Get the hero name
    } else {
      return 'Hero not found';
    }
  } catch (error) {
    console.error('An error occurred while fetching hero data:', error);
    return 'Hero not found';
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'getlastmatch') {
    const dotaAccountId = options.getString('account_id');

    // Defer the reply to the interaction
    await interaction.deferReply();

    try {
      // Fetch the last match played for the specified account
      const lastMatchResponse = await axios.get(`https://api.opendota.com/api/players/${dotaAccountId}/matches`, {
        params: {
          limit: 1,
          order: 'desc', // Order by match ID in descending order to get the last match
        },
        headers: {
          'Authorization': `Bearer ${OPENDOTA_API_KEY}`,
        },
      });

      const lastMatchData = lastMatchResponse.data[0]; // Get the first (and only) match from the response

      if (!lastMatchData) {
        await interaction.followUp('Dota 2 last match not found.');
        return;
      }

      // Extract relevant match details
      const matchId = lastMatchData.match_id;
      const win = lastMatchData.radiant_win ? 'Radiant' : 'Dire';
      const patch = lastMatchData.patch;
      const gameMode = lastMatchData.game_mode;
      const lobbyType = lastMatchData.lobby_type;
      const heroId = lastMatchData.hero_id;

      // Fetch hero name based on hero_id
      const heroName = await getHeroName(heroId);

      // Construct a message with match details
      const matchDetailsMessage = `Last Dota 2 match for account ID ${dotaAccountId}:\n` +
        `Match ID: ${matchId}\n` +
        `Win: ${win}\n` +
        `Patch: ${patch}\n` +
        `Game Mode: ${gameMode}\n` +
        `Lobby Type: ${lobbyType}\n` +
        `Hero Name: ${heroName}`;

      // Send the match details as a direct message
      await interaction.user.send(matchDetailsMessage);
      await interaction.followUp('Sent the last match details to your direct messages.');

    } catch (lastMatchError) {
      console.error(`An error occurred while fetching last match data: ${lastMatchError}`);
      await interaction.followUp('An error occurred while fetching Dota 2 last match data.');
    }
  }
});

client.login(TOKEN);
