///////////////////////////////////////////////////////////////// MADE BY xwqh modified by lxcraa \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//Ne pas toucher au code si vous ne savez pas ce que vous faites !
console.log("                                       ------.");
console.log("                                           / !");
console.log("        * * *                   * * *    /   !");
console.log("     *         *             *        */");
console.log("   *             *         *            *");
console.log("  *                *     *                *");
console.log(" *                    *                    *");
console.log("*                                           *");
console.log("*         xwqh modified by lxcraa!!         *");
console.log(" *                                        *");
console.log("  *                                      *");
console.log("    *             /                    *");
console.log("      *         /                    *");
console.log("        *     /                    *");
console.log("          * /                    *");
console.log("          /  *                 *");
console.log(" ______ /       *           *");
console.log("     `  !\\         *     *");
console.log("   `~   ]  \\          *");


const {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Database = require("simple-json-db");

const db = new Database("./data.json");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});


const clientId = "1143889541892161616"; // bot id
const guildId = "1142882836941111388"; // the guild id (Ou tu utilise le bot)
const token = "" // bot token n'oublie pas de changer le token a la dernière ligne également !

const allowedUserIds = ["1121543964772802671", "586861312231997450"]; // Tu peux ajouter plusieurs ID
const commands = [
  {
    name: "drop",
    description: "Drop codes for a user - made by xwqh modified by lxcraa",
    options: [
      {
        name: "user",
        description: "The user to send codes to - made by xwqh modified by lxcraa",
        type: 6, // USER
        required: true,
      },
      {
        name: "quantity",
        description: "The number of codes to drop - made by xwqh modified by lxcraa",
        type: 4, // INTEGER
        required: true,
      },
      {
        name: "item",
        description: "The item to drop codes for - made by xwqh modified by lxcraa",
        choices: [
          { name: "Nitro Basics", value: "nitroBasic" },
          { name: "Nitro Boosts", value: "nitroBoost" },
        ],
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: "stocks",
    description:
      "Check the stock of Nitro Basics and Nitro Boosts - made by xwqh modified by lxcraa",
  },
  {
    name: "restock",
    description:
      "Restock codes for Nitro Basics or Nitro Boosts - made by xwqh modified by lxcraa",
    options: [
      {
        name: "type",
        description: "The type of codes to restock - made by xwqh modified by lxcraa",
        type: 3, // STRING
        required: true,
        choices: [
          { name: "Nitro Basics", value: "nitroBasic" },
          { name: "Nitro Boosts", value: "nitroBoost" },
        ],
      },
      {
        name: "links",
        description: "The links to restock - made by xwqh modified by lxcraa",
        type: 3, // STRING
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands. - made by xwqh modified by lxcraa");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands. - made by xwqh modified by lxcraa");
  } catch (error) {
    console.error(error);
  }
})();

client.once("ready", () => {
  console.log(`Connecté en tant que ${client.user.tag} - made by xwqh modified by lxcraa`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, user } = interaction;
  const userId = user.id;

  if (!allowedUserIds.includes(userId)) {
    return;
    return;
  }

  if (commandName === "drop") {
    const user = options.getUser("user");
    const quantity = options.getInteger("quantity");
    const item = options.getString("item");

    if (user.bot) {
      await interaction.reply({
        content: "Les bots ne peuvent pas recevoir de codes.",
      });
      return;
    }

    if (!db.has(item)) db.set(item, []);

    const itemArray = db.get(item);
    if (itemArray.length < quantity) {
      await interaction.reply({
        content: `Pas assez de codes ${item} à distribuer.`,
      });
      return;
    }

    const codesToSend = itemArray.slice(0, quantity);
    const remainingCodes = itemArray.slice(quantity);
    db.set(item, remainingCodes);

    try {
      const codeList = codesToSend
        .map((code, index) => `${index + 1}. ${code}`)
        .join("\n");

      await user.send(`
### **__THANK YOU FOR TRUSTING xwqh modified by lxcraa$HOP!__** <:1946blackbutterflies:1118342505705001023>  

- Don't forget to vouch for active your warranty
- No warranty for autoclaimed nitro __(is impossible)__
- Make sure to read <#1114264775489232936>

<:blackcard:1113860361318314144> **Vouch Here:** <#1114264811874820096>
<:yes:1113855232657604618> Follow Vouch: +rep <seller>  ${quantity}  ${item}  +  <feedback> (optional)
<:no:1113856268411617391> Warranty Voided if not followed

Hope to see you again buying from us : ***https://discord.gg/ofadev***

|| ${codeList} ||
`);

      await interaction.reply({
        content: `A distribué ${quantity} code(s) ${item} à ${user.tag}. Les codes ont été envoyés dans un seul message.`,
      });
    } catch (error) {
      console.error(
        `Échec de l'envoi des codes ${item} à ${user.tag} :`,
        error,
      );
    }
  } else if (commandName === "stocks") {
    const nitroBasics = db.get("nitroBasic") || [];
    const nitroBoosts = db.get("nitroBoost") || [];

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("nitroBasic")
        .setLabel(`Nitro Basique(s) (${nitroBasics.length} restant(s))`)
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("nitroBoost")
        .setLabel(`Nitro Boost(s) (${nitroBoosts.length} restant(s))`)
        .setStyle("PRIMARY"),
    );

    await interaction.reply({
      content: `Nitro Basiques: ${nitroBasics.length}\nNitro Boosts: ${nitroBoosts.length}`,
      components: [row],
    });
  } else if (commandName === "restock") {
    const type = options.getString("type");
    const links = options.getString("links").split(/\s+/);

    if (type === "nitroBasic" || type === "nitroBoost") {
      const existingLinks = db.get(type) || [];
      const updatedLinks = [...existingLinks, ...links];

      db.set(type, updatedLinks);
      await interaction.reply({
        content: `Réapprovisionné ${type} avec ${links.length} lien(s).`,
      });
    } else {
      await interaction.reply({
        content: `Type de réapprovisionnement invalide. Utilisez 'nitrobasic' ou 'nitroboost'.`,
      });
    }
  }
});

client.login("");