const { slashCommandBuilder, EmbedBuilder } = require("discord.js");

const { fetchForecast } = require("../requests/forecast");

const data = new slashCommandBuilder()
   .setName("astro")
   .setDescription("Replies with the astronomical information for the day!")
   .addStringOption((option) => {
      return option
         .setName("location")
         .setDescription("The location can be a city, a zip code, or a latitude and longtitude")
         .setRequired(true);
   });

async function execute(interaction) {
   await interaction.deferReply();

   const location = interaction.options.getString("location");

   try {
      const { weatherData, locationName } = await fetchForecast(location);

      const embed = new EmbedBuilder()
         .setColor(0x3f704d)
         .setTitle(`Astronomical forecast for ${locationName}`)
         .setDescription(`Using the ${units} system.`)
         .setTimestamp()
         .setFooter({
            text: "Power by the weatherapi.com API"
         });

      for (const day of weatherData) {
         embed.addFields({
            name: day.date,
            value: `🌅 Sunrise: ${day.sunriseTime}\n🌆 Sunset: ${day.sunsetTime}\n🌝 Moonrise: ${day.moonriseTime}\n🌚 Moonset: ${day.moonsetTime}`
         });
      }

      await interaction.editReply({
         embeds: [embed]
      });
   } catch (err) {
      console.error(err);

      throw new Error(`Error fetching forecast for ${locationName}`);
   }
}

module.exports = {
   data,
   execute
};
