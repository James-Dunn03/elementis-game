const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(express.static(path.join(__dirname, 'public')));

// =================== GAME DATA ===================

const SCENARIO_CARDS = require('./scenario_cards_generated.js');

const TREASURE_CARDS = [
  { id:'t1',  name:"Elixir of Behemoth",     effect:"Heals a monster for 50 HP.",                           type:"heal_monster",    value:50, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/standing-potion.png",      rarity:4, gpValue:40 },
  { id:'t2',  name:"Draught of Vital Flame",  effect:"Heals a monster for 40 HP.",                           type:"heal_monster",    value:40, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/fire-bottle.png",          rarity:3, gpValue:30 },
  { id:'t3',  name:"Siren's Brew",            effect:"Heals a monster for 30 HP.",                           type:"heal_monster",    value:30, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/delapouite/magic-potion.png",   rarity:3, gpValue:20 },
  { id:'t4',  name:"Stonefruit Salve",        effect:"Heals a monster for 20 HP.",                           type:"heal_monster",    value:20, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/delapouite/cloth-jar.png",      rarity:1, gpValue:10 },
  { id:'t5',  name:"Breeze Balm",             effect:"Heals a monster for 10 HP.",                           type:"heal_monster",    value:10, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/bottle-vapors.png",        rarity:1, gpValue:5  },
  { id:'t6',  name:"Ambrosia Vial",           effect:"Heals the player for 50 HP.",                          type:"heal_player",     value:50, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/caro-asercion/round-potion.png", rarity:4, gpValue:40 },
  { id:'t7',  name:"Sanctified Bandage",      effect:"Heals the player for 40 HP.",                          type:"heal_player",     value:40, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/delapouite/holy-water.png",     rarity:3, gpValue:30 },
  { id:'t8',  name:"Golden Nectar",           effect:"Heals the player for 30 HP.",                          type:"heal_player",     value:30, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/delapouite/honey-jar.png",      rarity:3, gpValue:20 },
  { id:'t9',  name:"Phoenix Feather",         effect:"Heals the player for 20 HP.",                          type:"heal_player",     value:20, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/heart-bottle.png",         rarity:1, gpValue:10 },
  { id:'t10', name:"Healing Crystal",         effect:"Heals the player for 10 HP.",                          type:"heal_player",     value:10, usage:"use_once", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/potion-ball.png",          rarity:1, gpValue:5  },
  { id:'t11', name:"Infernal Charm",          effect:"Boosts a Pyro attack's damage by +20.",                type:"attack_boost",    element:"Pyro",  value:20, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/lorc/flaming-trident.png",    rarity:4, gpValue:40 },
  { id:'t12', name:"Tidal Ring",              effect:"Boosts an Aqua attack's damage by +20.",               type:"attack_boost",    element:"Aqua",  value:20, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/lorc/trident.png",             rarity:4, gpValue:40 },
  { id:'t13', name:"Earthen Gauntlet",        effect:"Boosts a Terra attack's damage by +20.",               type:"attack_boost",    element:"Terra", value:20, usage:"equip", icon:"/tiles/armor.png/icons/ffffff/transparent/1x1/delapouite/gauntlet.png",       rarity:4, gpValue:40 },
  { id:'t14', name:"Sky Medallion",           effect:"Boosts an Aero attack's damage by +20.",               type:"attack_boost",    element:"Aero",  value:20, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/delapouite/winged-scepter.png", rarity:4, gpValue:40 },
  { id:'t15', name:"Titan's Armor Plate",     effect:"Increases monster HP by 50.",                          type:"hp_boost",        value:50, usage:"equip", icon:"/tiles/armor.png/icons/ffffff/transparent/1x1/delapouite/chest-armor.png",      rarity:5, gpValue:40 },
  { id:'t16', name:"Heart of the Mountain",   effect:"Increases monster HP by 40.",                          type:"hp_boost",        value:40, usage:"equip", icon:"/tiles/armor.png/icons/ffffff/transparent/1x1/delapouite/heart-armor.png",      rarity:5, gpValue:30 },
  { id:'t17', name:"Blessed Chainmail",       effect:"Increases monster HP by 30.",                          type:"hp_boost",        value:30, usage:"equip", icon:"/tiles/armor.png/icons/ffffff/transparent/1x1/willdabeast/chain-mail.png",      rarity:4, gpValue:20 },
  { id:'t18', name:"Ironhide Buckler",        effect:"Increases monster HP by 20.",                          type:"hp_boost",        value:20, usage:"equip", icon:"/tiles/armor.png/icons/ffffff/transparent/1x1/lorc/breastplate.png",            rarity:2, gpValue:10 },
  { id:'t19', name:"Oakroot Tonic",           effect:"Increases monster HP by 10.",                          type:"hp_boost",        value:10, usage:"equip", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/delapouite/waterskin.png",       rarity:1, gpValue:5  },
  { id:'t20', name:"Blade of Fate",           effect:"Add 6 to a monster's attack roll.",                    type:"roll_bonus",      value:6, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/lorc/winged-sword.png",          rarity:3, gpValue:30 },
  { id:'t21', name:"Rune-Etched Coin",        effect:"Add 5 to a monster's attack roll.",                    type:"roll_bonus",      value:5, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/lorc/crystal-wand.png",          rarity:3, gpValue:30 },
  { id:'t22', name:"Guiding Amulet",          effect:"Add 4 to a monster's attack roll.",                    type:"roll_bonus",      value:4, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/delapouite/lunar-wand.png",       rarity:3, gpValue:30 },
  { id:'t23', name:"Warrior's Whisper",       effect:"Add 3 to a monster's attack roll.",                    type:"roll_bonus",      value:3, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/delapouite/crescent-staff.png",   rarity:3, gpValue:30 },
  { id:'t24', name:"Sharpened Rune",          effect:"Add 2 to a monster's attack roll.",                    type:"roll_bonus",      value:2, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/lorc/sacrificial-dagger.png",     rarity:3, gpValue:30 },
  { id:'t25', name:"Strategist's Dice",       effect:"Add 1 to a monster's attack roll.",                    type:"roll_bonus",      value:1, usage:"equip", icon:"/tiles/weapon.png/icons/ffffff/transparent/1x1/lorc/fairy-wand.png",            rarity:3, gpValue:30 },
  { id:'t26', name:"Orb of Balance",          effect:"Removes elemental weakness from a Pyro monster.",      type:"remove_weakness", element:"Pyro",  usage:"equip", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/fizzing-flask.png",  rarity:5, gpValue:50 },
  { id:'t27', name:"Aegis of Harmony",        effect:"Removes elemental weakness from an Aqua monster.",     type:"remove_weakness", element:"Aqua",  usage:"equip", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/lorc/snow-bottle.png",    rarity:5, gpValue:50 },
  { id:'t28', name:"Gaia's Ward",             effect:"Removes elemental weakness from a Terra monster.",     type:"remove_weakness", element:"Terra", usage:"equip", icon:"/tiles/bottle.png/icons/ffffff/transparent/1x1/delapouite/covered-jar.png", rarity:5, gpValue:50 },
  { id:'t29', name:"Windshell Cloak",         effect:"Removes elemental weakness from an Aero monster.",     type:"remove_weakness", element:"Aero",  usage:"equip", icon:"/tiles/armor.png/icons/ffffff/transparent/1x1/delapouite/cape-armor.png",  rarity:5, gpValue:50 },
];

const PLAYER_ITEMS = [
  { id:'pi1',  name:"Emberglass Lantern Shard", effect:"Add 6 to a Player's attack roll.",     type:"player_roll_bonus",    value:6,  usage:"equip_to_player", icon:"/tiles/Monster tokens/dice.png",      rarity:4, gpValue:40 },
  { id:'pi2',  name:"Wayfinder's Compass",      effect:"Add 5 to a Player's attack roll.",     type:"player_roll_bonus",    value:5,  usage:"equip_to_player", icon:"/tiles/Monster tokens/dice.png",      rarity:4, gpValue:40 },
  { id:'pi3',  name:"Whisperleaf Charm",         effect:"Add 4 to a Player's attack roll.",     type:"player_roll_bonus",    value:4,  usage:"equip_to_player", icon:"/tiles/Monster tokens/dice.png",      rarity:4, gpValue:40 },
  { id:'pi4',  name:"Clockwork Cricket",         effect:"Add 3 to a Player's attack roll.",     type:"player_roll_bonus",    value:3,  usage:"equip_to_player", icon:"/tiles/Monster tokens/dice.png",      rarity:4, gpValue:40 },
  { id:'pi5',  name:"Moonthread Spool",          effect:"Add 2 to a Player's attack roll.",     type:"player_roll_bonus",    value:2,  usage:"equip_to_player", icon:"/tiles/Monster tokens/dice.png",      rarity:4, gpValue:40 },
  { id:'pi6',  name:"Echo Pebble",               effect:"Add 1 to a Player's attack roll.",     type:"player_roll_bonus",    value:1,  usage:"equip_to_player", icon:"/tiles/Monster tokens/dice.png",      rarity:4, gpValue:40 },
  { id:'pi7',  name:"Starlight Pocketwatch",     effect:"Increases Player's HP by 50.",         type:"player_hp_boost",      value:50, usage:"equip_to_player", icon:"/tiles/Monster tokens/monk-face.png", rarity:5, gpValue:70 },
  { id:'pi8',  name:"Mosskeeper's Brooch",       effect:"Increases Player's HP by 40.",         type:"player_hp_boost",      value:40, usage:"equip_to_player", icon:"/tiles/Monster tokens/monk-face.png", rarity:4, gpValue:60 },
  { id:'pi9',  name:"Veilweaver's Ribbon",       effect:"Increases Player's HP by 30.",         type:"player_hp_boost",      value:30, usage:"equip_to_player", icon:"/tiles/Monster tokens/monk-face.png", rarity:3, gpValue:50 },
  { id:'pi10', name:"Frostglass Tear",           effect:"Increases Player's HP by 20.",         type:"player_hp_boost",      value:20, usage:"equip_to_player", icon:"/tiles/Monster tokens/monk-face.png", rarity:2, gpValue:40 },
  { id:'pi11', name:"Oracle's Monocle",          effect:"Increases Player's HP by 10.",         type:"player_hp_boost",      value:10, usage:"equip_to_player", icon:"/tiles/Monster tokens/monk-face.png", rarity:1, gpValue:30 },
  { id:'pi12', name:"Ring of the First Dawn",    effect:"Increases a Player's attack by +10.",  type:"player_attack_bonus",  value:10, usage:"equip_to_player", icon:"/tiles/Monster tokens/Captain.png",   rarity:3, gpValue:40 },
  { id:'pi13', name:"Serpent's Eye Pendant",     effect:"Increases a Player's attack by +20.",  type:"player_attack_bonus",  value:20, usage:"equip_to_player", icon:"/tiles/Monster tokens/Captain.png",   rarity:4, gpValue:50 },
  { id:'pi14', name:"Bracelet of Whispering Stars", effect:"Increases a Player's attack by +30.", type:"player_attack_bonus", value:30, usage:"equip_to_player", icon:"/tiles/Monster tokens/Captain.png",  rarity:5, gpValue:60 },
];

const STARTER_MONSTERS = [
  { id:'emberling',   name:"Emberling",   element:"Pyro",  maxHp:40, equipped:[],
    attack1:{ name:"Flare Spark",  desc:"Shoots a small bolt of fire",    roll1:1, roll2:2, damage:20 },
    attack2:{ name:"Lava Sputter", desc:"Spits molten droplets",          roll1:3, roll2:4, damage:20 } },
  { id:'tidecrawler', name:"Tidecrawler", element:"Aqua", maxHp:40, equipped:[],
    attack1:{ name:"Aqua Slash",   desc:"A blade of water slices the foe", roll1:1, roll2:2, damage:20 },
    attack2:{ name:"Bubble Bomb",  desc:"A bubble that bursts on impact",  roll1:3, roll2:4, damage:20 } },
  { id:'pebbrute',    name:"Pebbrute",    element:"Terra", maxHp:40, equipped:[],
    attack1:{ name:"Rock Jab",     desc:"Strikes with a sharp stone fist", roll1:1, roll2:2, damage:20 },
    attack2:{ name:"Dust Pulse",   desc:"A concussive blast of earthy dust",roll1:3, roll2:4, damage:20 } },
  { id:'gustling',    name:"Gustling",    element:"Aero",   maxHp:40, equipped:[],
    attack1:{ name:"Whirl Peck",   desc:"Dives in a spinning wind strike", roll1:1, roll2:2, damage:20 },
    attack2:{ name:"Air Snap",     desc:"A quick air pressure burst",      roll1:3, roll2:4, damage:20 } },
];

// roll1/roll2 = specific d6 values required to hit (from Excel data)
const REGION_MONSTERS = {
  meadow: [
    { id:'guston_p',  name:"Guston",   element:"Pyro",  maxHp:10,  rarity:1, gpValue:5,  equipped:[], attack1:{name:"Blazing Claw",    roll1:1,roll2:6,damage:50}, attack2:{name:"Inferno Burst",    roll1:2,roll2:6,damage:20} },
    { id:'tidear_a',  name:"Tidear",   element:"Aero",  maxHp:10,  rarity:1, gpValue:5,  equipped:[], attack1:{name:"Gale Slash",      roll1:4,roll2:5,damage:40}, attack2:{name:"Gale Slash",       roll1:2,roll2:2,damage:30} },
    { id:'stormor_t', name:"Stormor",  element:"Terra", maxHp:10,  rarity:1, gpValue:5,  equipped:[], attack1:{name:"Quake Stomp",     roll1:1,roll2:5,damage:10}, attack2:{name:"Stone Slam",       roll1:1,roll2:2,damage:20} },
    { id:'fangus_a',  name:"Fangus",   element:"Aero",  maxHp:10,  rarity:1, gpValue:5,  equipped:[], attack1:{name:"Whirlwind Pulse", roll1:5,roll2:2,damage:50}, attack2:{name:"Sky Jab",          roll1:4,roll2:3,damage:20} },
    { id:'clawon_p',  name:"Clawon",   element:"Pyro",  maxHp:20,  rarity:1, gpValue:10, equipped:[], attack1:{name:"Blazing Claw",    roll1:6,roll2:5,damage:50}, attack2:{name:"Blazing Claw",     roll1:3,roll2:3,damage:10} },
    { id:'gustan_t',  name:"Gustan",   element:"Terra", maxHp:20,  rarity:1, gpValue:11, equipped:[], attack1:{name:"Quake Stomp",     roll1:4,roll2:4,damage:20}, attack2:{name:"Boulder Bash",     roll1:4,roll2:5,damage:30} },
    { id:'quakeus_a', name:"Quakeus",  element:"Aero",  maxHp:20,  rarity:1, gpValue:13, equipped:[], attack1:{name:"Sky Jab",         roll1:6,roll2:4,damage:30}, attack2:{name:"Gale Slash",       roll1:5,roll2:4,damage:20} },
    { id:'wingar_aq', name:"Wingar",   element:"Aqua",  maxHp:30,  rarity:1, gpValue:15, equipped:[], attack1:{name:"Aqua Lance",      roll1:5,roll2:6,damage:10}, attack2:{name:"Drench Strike",    roll1:3,roll2:4,damage:40} },
  ],
  forest: [
    { id:'clawak_p',  name:"Clawak",   element:"Pyro",  maxHp:40,  rarity:1, gpValue:20, equipped:[], attack1:{name:"Flame Spiral",    roll1:1,roll2:1,damage:20}, attack2:{name:"Blazing Claw",     roll1:5,roll2:3,damage:20} },
    { id:'tidear_t',  name:"Tidear",   element:"Terra", maxHp:40,  rarity:1, gpValue:20, equipped:[], attack1:{name:"Quake Stomp",     roll1:2,roll2:2,damage:40}, attack2:{name:"Stone Slam",       roll1:6,roll2:4,damage:20} },
    { id:'scaleon_t', name:"Scaleon",  element:"Terra", maxHp:50,  rarity:2, gpValue:25, equipped:[], attack1:{name:"Boulder Bash",    roll1:1,roll2:4,damage:50}, attack2:{name:"Stone Slam",       roll1:4,roll2:5,damage:50} },
    { id:'stormix_aq',name:"Stormix",  element:"Aqua",  maxHp:50,  rarity:2, gpValue:25, equipped:[], attack1:{name:"Drench Strike",   roll1:6,roll2:2,damage:50}, attack2:{name:"Drench Strike",    roll1:3,roll2:6,damage:50} },
    { id:'mawar_p',   name:"Mawar",    element:"Pyro",  maxHp:50,  rarity:2, gpValue:25, equipped:[], attack1:{name:"Inferno Burst",   roll1:4,roll2:6,damage:50}, attack2:{name:"Flame Spiral",     roll1:6,roll2:4,damage:40} },
    { id:'hidear_a',  name:"Hidear",   element:"Aero",  maxHp:60,  rarity:2, gpValue:30, equipped:[], attack1:{name:"Cyclone Spin",    roll1:4,roll2:1,damage:50}, attack2:{name:"Gale Slash",       roll1:4,roll2:4,damage:30} },
    { id:'clawus_aq', name:"Clawus",   element:"Aqua",  maxHp:60,  rarity:2, gpValue:30, equipped:[], attack1:{name:"Tidal Crash",     roll1:3,roll2:2,damage:10}, attack2:{name:"Tidal Crash",      roll1:5,roll2:2,damage:40} },
    { id:'hideak_p',  name:"Hideak",   element:"Pyro",  maxHp:70,  rarity:3, gpValue:35, equipped:[], attack1:{name:"Flame Spiral",    roll1:5,roll2:1,damage:20}, attack2:{name:"Scorching Ray",    roll1:3,roll2:5,damage:40} },
  ],
  misty: [
    { id:'stormor_aq',name:"Stormor",  element:"Aqua",  maxHp:80,  rarity:3, gpValue:40, equipped:[], attack1:{name:"Aqua Lance",      roll1:2,roll2:5,damage:50}, attack2:{name:"Bubble Barrage",   roll1:3,roll2:2,damage:50} },
    { id:'quakeix_a', name:"Quakeix",  element:"Aero",  maxHp:80,  rarity:3, gpValue:40, equipped:[], attack1:{name:"Cyclone Spin",    roll1:1,roll2:2,damage:30}, attack2:{name:"Gale Slash",       roll1:1,roll2:2,damage:30} },
    { id:'stormar_p', name:"Stormar",  element:"Pyro",  maxHp:80,  rarity:2, gpValue:40, equipped:[], attack1:{name:"Inferno Burst",   roll1:1,roll2:2,damage:50}, attack2:{name:"Inferno Burst",    roll1:6,roll2:6,damage:20} },
    { id:'mawor_t',   name:"Mawor",    element:"Terra", maxHp:90,  rarity:3, gpValue:45, equipped:[], attack1:{name:"Boulder Bash",    roll1:3,roll2:6,damage:10}, attack2:{name:"Stone Slam",       roll1:3,roll2:1,damage:30} },
    { id:'fangeth_aq',name:"Fangeth",  element:"Aqua",  maxHp:90,  rarity:3, gpValue:45, equipped:[], attack1:{name:"Bubble Barrage",  roll1:2,roll2:4,damage:20}, attack2:{name:"Bubble Barrage",   roll1:5,roll2:3,damage:50} },
    { id:'mawon_a',   name:"Mawon",    element:"Aero",  maxHp:90,  rarity:3, gpValue:45, equipped:[], attack1:{name:"Whirlwind Pulse", roll1:5,roll2:5,damage:50}, attack2:{name:"Whirlwind Pulse",  roll1:4,roll2:5,damage:40} },
    { id:'tideeth_aq',name:"Tideeth",  element:"Aqua",  maxHp:100, rarity:4, gpValue:50, equipped:[], attack1:{name:"Aqua Lance",      roll1:6,roll2:3,damage:10}, attack2:{name:"Tidal Crash",      roll1:2,roll2:1,damage:50} },
    { id:'hideak_t',  name:"Hideak",   element:"Terra", maxHp:100, rarity:4, gpValue:50, equipped:[], attack1:{name:"Quake Stomp",     roll1:1,roll2:6,damage:50}, attack2:{name:"Boulder Bash",     roll1:4,roll2:5,damage:10} },
  ],
  volcan: [
    { id:'hideon_aq', name:"Hideon",          element:"Aqua",  maxHp:110, rarity:5, gpValue:55, equipped:[], attack1:{name:"Aqua Lance",     roll1:5,roll2:3,damage:30}, attack2:{name:"Drench Strike",   roll1:2,roll2:2,damage:50} },
    { id:'clawix_p',  name:"Clawix",          element:"Pyro",  maxHp:110, rarity:5, gpValue:55, equipped:[], attack1:{name:"Flame Spiral",   roll1:1,roll2:4,damage:50}, attack2:{name:"Flame Spiral",    roll1:6,roll2:4,damage:20} },
    { id:'tideak_p',  name:"Tideak",          element:"Pyro",  maxHp:110, rarity:5, gpValue:55, equipped:[], attack1:{name:"Inferno Burst",  roll1:5,roll2:6,damage:30}, attack2:{name:"Inferno Burst",   roll1:5,roll2:2,damage:10} },
    { id:'wingus_aq', name:"Wingus",          element:"Aqua",  maxHp:120, rarity:5, gpValue:60, equipped:[], attack1:{name:"Bubble Barrage", roll1:4,roll2:1,damage:40}, attack2:{name:"Bubble Barrage",  roll1:3,roll2:2,damage:10} },
    { id:'behemoth',  name:"The Behemoth",    element:"Terra", maxHp:150, rarity:5, gpValue:0,  equipped:[], attack1:{name:"Boulder Bash",   roll1:4,roll2:4,damage:60}, attack2:{name:"Stone Slam",      roll1:1,roll2:1,damage:40} },
    { id:'wingdragon',name:"The Great Winged Dragon", element:"Aero", maxHp:150, rarity:5, gpValue:0, equipped:[], attack1:{name:"Cyclone Spin", roll1:1,roll2:1,damage:50}, attack2:{name:"Sky Jab", roll1:6,roll2:6,damage:50} },
    { id:'tidalserp', name:"The Tidal Serpent",      element:"Aqua", maxHp:150, rarity:5, gpValue:0, equipped:[], attack1:{name:"Drench Strike",roll1:3,roll2:3,damage:40}, attack2:{name:"Tidal Crash",roll1:6,roll2:6,damage:60} },
    { id:'flamdevil',  name:"The Flamed Devil",       element:"Pyro", maxHp:150, rarity:5, gpValue:0, equipped:[], attack1:{name:"Scorching Ray",roll1:2,roll2:2,damage:30}, attack2:{name:"Inferno Burst",roll1:5,roll2:5,damage:70} },
  ],
};

// =================== BOSS SYSTEM ===================

const GRID_COLS = 17;
const GRID_ROWS = 14;
const REGIONS = ['volcan','misty','meadow','forest'];
const REGION_SEEDS = { volcan:{col:4,row:3}, misty:{col:12,row:3}, meadow:{col:4,row:10}, forest:{col:12,row:10} };

function generateRegionMap() {
  const map = {};
  const frontiers = { volcan:[], misty:[], meadow:[], forest:[] };
  for (const [region, pos] of Object.entries(REGION_SEEDS)) {
    map[`${pos.col},${pos.row}`] = region;
    frontiers[region].push([pos.col, pos.row]);
  }
  let assigned = REGIONS.length;
  const total = GRID_COLS * GRID_ROWS;
  while (assigned < total) {
    const order = shuffle([...REGIONS]);
    let grew = false;
    for (const region of order) {
      if (assigned >= total) break;
      const expandable = [];
      for (const [fc, fr] of frontiers[region]) {
        const free = getNeighbors(fc, fr).filter(([nc, nr]) => !map[`${nc},${nr}`]);
        if (free.length) expandable.push(free);
      }
      if (!expandable.length) continue;
      const neighbors = expandable[Math.floor(Math.random() * expandable.length)];
      const [nc, nr] = neighbors[Math.floor(Math.random() * neighbors.length)];
      map[`${nc},${nr}`] = region;
      frontiers[region].push([nc, nr]);
      assigned++;
      grew = true;
    }
    if (!grew) break;
  }
  return map;
}

function findBossHexes(regionMap, startPositions) {
  const bossHexes = {};
  const forbidden = new Set((startPositions || []).map(p => `${p.col},${p.row}`));
  for (const region of REGIONS) {
    const candidates = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const key = `${col},${row}`;
        if (regionMap[key] === region && !forbidden.has(key)) candidates.push({col, row});
      }
    }
    if (candidates.length) {
      bossHexes[region] = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return bossHexes;
}

function hexDistance(c1, r1, c2, r2) {
  // Offset to cube coordinates (pointy-top, odd-r shift)
  const q1 = c1 - (r1 - (r1 & 1)) / 2, s1 = r1;
  const q2 = c2 - (r2 - (r2 & 1)) / 2, s2 = r2;
  return Math.max(Math.abs(q1 - q2), Math.abs(s1 - s2), Math.abs((-q1 - s1) - (-q2 - s2)));
}

function findStartPositions(regionMap, bossHexes, playerCount) {
  const allowedRegions = ['volcan', 'meadow', 'forest'];
  const MIN_DIST = 7; // aim for well-separated starts; fallback reduces if needed
  const forbidden = new Set(Object.values(bossHexes).map(p => `${p.col},${p.row}`));
  const candidates = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const key = `${col},${row}`;
      if (allowedRegions.includes(regionMap[key]) && !forbidden.has(key)) candidates.push({col, row});
    }
  }
  shuffle(candidates);
  // Try decreasing minimum distances until enough positions are found
  for (let minDist = MIN_DIST; minDist >= 5; minDist--) {
    const positions = [];
    for (const p of candidates) {
      if (positions.length >= playerCount) break;
      if (!positions.some(q => hexDistance(p.col, p.row, q.col, q.row) < minDist)) positions.push(p);
    }
    if (positions.length >= playerCount) return positions;
  }
  // Hard fallback: just take the first playerCount unique candidates
  return candidates.slice(0, playerCount);
}

const ELEMENT_BOOST_ID = { Pyro:'t11', Aqua:'t12', Terra:'t13', Aero:'t14' };
const ROLL_BONUS_IDS   = ['t20','t21','t22','t23','t24','t25'];

// Fixed territory guardians — thematic match between region and monster element
const TERRITORY_BOSS_ID = { volcan:'flamdevil', misty:'tidalserp', meadow:'wingdragon', forest:'behemoth' };

// Elements allowed per region for random wild encounters
const REGION_ALLOWED_ELEMENTS = {
  volcan: ['Pyro', 'Terra', 'Aero'],
  misty:  ['Aqua'],
  meadow: ['Terra'],
  forest: ['Terra', 'Aero'],
};
const BOSS_IDS = new Set(Object.values(TERRITORY_BOSS_ID));

// =================== VILLAGE SYSTEM ===================

function findVillageHexes(regionMap, forbiddenHexes) {
  const forbidden = new Set((forbiddenHexes || []).map(p => `${p.col},${p.row}`));

  const coastal = [], inland = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const key = `${c},${r}`;
      if (regionMap[key] === 'misty' || forbidden.has(key)) continue;
      const adjMisty = getNeighbors(c, r).some(([nc, nr]) => regionMap[`${nc},${nr}`] === 'misty');
      (adjMisty ? coastal : inland).push({ col: c, row: r });
    }
  }

  const villages = [];
  const usedKeys = new Set([...forbidden]);

  // 1 coastal village (adjacent to Misty Islands but not on one)
  const coastalShuffled = shuffle(coastal);
  for (const hex of coastalShuffled) {
    if (!usedKeys.has(`${hex.col},${hex.row}`)) {
      villages.push({ hex, isCoastal: true });
      usedKeys.add(`${hex.col},${hex.row}`);
      break;
    }
  }

  // 2 inland villages — spread apart (min 5 hex taxicab distance from each other)
  const inlandShuffled = shuffle(inland);
  for (const hex of inlandShuffled) {
    if (villages.filter(v => !v.isCoastal).length >= 2) break;
    const key = `${hex.col},${hex.row}`;
    if (usedKeys.has(key)) continue;
    const tooClose = villages.some(v => Math.abs(v.hex.col - hex.col) + Math.abs(v.hex.row - hex.row) < 5);
    if (tooClose) continue;
    villages.push({ hex, isCoastal: false });
    usedKeys.add(key);
  }

  return villages;
}

function pickShopItems(count) {
  const pool = [];
  [...TREASURE_CARDS, ...PLAYER_ITEMS].forEach(item => {
    const weight = 6 - (item.rarity || 1);
    for (let i = 0; i < weight; i++) pool.push(item);
  });
  const picked = [], seen = new Set();
  for (const item of shuffle(pool)) {
    if (!seen.has(item.id)) { picked.push(JSON.parse(JSON.stringify(item))); seen.add(item.id); }
    if (picked.length >= count) break;
  }
  return picked;
}

function pickTamerMonster() {
  const pool = [];
  Object.values(REGION_MONSTERS).flat()
    .filter(m => !BOSS_IDS.has(m.id))
    .forEach(m => {
      const weight = 6 - (m.rarity || 1);
      for (let i = 0; i < weight; i++) pool.push(m);
    });
  if (!pool.length) return null;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const monster = JSON.parse(JSON.stringify(template));
  monster.hp = monster.maxHp;
  return monster;
}

function createBossMonster(region) {
  // Pull the named guardian from wherever it lives in REGION_MONSTERS
  const bossId = TERRITORY_BOSS_ID[region];
  let template;
  for (const list of Object.values(REGION_MONSTERS)) {
    template = list.find(m => m.id === bossId);
    if (template) break;
  }
  const boss = JSON.parse(JSON.stringify(template));
  boss.isBoss = true;
  boss.bossRegion = region;
  boss.maxHp = boss.maxHp * 2;
  boss.hp    = boss.maxHp;
  // Random roll_bonus item (Blade of Fate → Strategist's Dice)
  const rollBonusId = ROLL_BONUS_IDS[Math.floor(Math.random() * ROLL_BONUS_IDS.length)];
  const rollBonus   = TREASURE_CARDS.find(t => t.id === rollBonusId);
  const attackBoost = TREASURE_CARDS.find(t => t.id === ELEMENT_BOOST_ID[boss.element]);
  boss.equipped = [
    JSON.parse(JSON.stringify(rollBonus)),
    JSON.parse(JSON.stringify(attackBoost)),
  ];
  return boss;
}

function getBossRegion(col, row, bossHexes) {
  return Object.entries(bossHexes).find(([, pos]) => pos.col === col && pos.row === row)?.[0] || null;
}

// =================== HELPERS ===================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function rollDice() { return Math.floor(Math.random()*6)+1; }

function normalizeEl(el) {
  return {Fire:'Pyro',Water:'Aqua',Earth:'Terra',Air:'Aero'}[el] || el;
}

function getMultiplier(attackerEl, defenderEl) {
  const a = normalizeEl(attackerEl), d = normalizeEl(defenderEl);
  if ((a==='Aqua'&&d==='Pyro')||(a==='Pyro'&&d==='Terra')||(a==='Terra'&&d==='Aero')||(a==='Aero'&&d==='Pyro')) return 2;
  if ((a==='Pyro'&&d==='Aero')||(a==='Aero'&&d==='Terra')||(a==='Terra'&&d==='Pyro')||(a==='Pyro'&&d==='Aqua')||(a==='Aqua'&&d==='Aero')) return 0.5;
  return 1;
}

function checkHit(roll, attack, monster) {
  // Each roll_bonus item adds its value as an additional success number
  const bonusRolls = (monster.equipped||[]).filter(e=>e.type==='roll_bonus').map(e=>e.value);
  return roll === attack.roll1 || roll === attack.roll2 || bonusRolls.includes(roll);
}

function calcDamage(attack, attackerMonster, defenderMonster) {
  const base = attack.damage;
  let mult = getMultiplier(attackerMonster.element, defenderMonster.element);

  // remove_weakness on the ATTACKER negates their offensive ×0.5 penalty
  if (mult < 1) {
    const attackerHasRemoval = (attackerMonster.equipped||[]).some(
      e => e.type==='remove_weakness' && normalizeEl(e.element)===normalizeEl(attackerMonster.element)
    );
    if (attackerHasRemoval) mult = 1;
  }
  // remove_weakness on the DEFENDER negates the attacker's ×2 super-effective bonus
  if (mult > 1) {
    const defenderHasRemoval = (defenderMonster.equipped||[]).some(
      e => e.type==='remove_weakness' && normalizeEl(e.element)===normalizeEl(defenderMonster.element)
    );
    if (defenderHasRemoval) mult = 1;
  }

  // attack_boost adds to base damage (before multiplier) for matching element
  const attackBoost = (attackerMonster.equipped||[])
    .filter(e => e.type==='attack_boost' && normalizeEl(e.element)===normalizeEl(attackerMonster.element))
    .reduce((s,e) => s+e.value, 0);

  return { damage: Math.round((base + attackBoost) * mult), multiplier: mult };
}

function getRegion(col, row, regionMap) {
  if (regionMap) return regionMap[`${col},${row}`] || 'meadow';
  if (col<=4&&row<=3) return 'volcan';
  if (col>=5&&row<=3) return 'misty';
  if (col<=4&&row>=4) return 'meadow';
  return 'forest';
}

function getNeighbors(col, row) {
  const dirs = row%2===0 ? [[-1,0],[1,0],[-1,-1],[0,-1],[-1,1],[0,1]] : [[-1,0],[1,0],[0,-1],[1,-1],[0,1],[1,1]];
  return dirs.map(([dc,dr])=>[col+dc,row+dr]).filter(([c,r])=>c>=0&&c<GRID_COLS&&r>=0&&r<GRID_ROWS);
}

function isAdjacent(p1, p2) {
  return getNeighbors(p1.col,p1.row).some(([c,r])=>c===p2.col&&r===p2.row);
}

const START_POS = [{col:1,row:1},{col:15,row:1},{col:1,row:12},{col:15,row:12}]; // fallback only
const PLAYER_COLORS = ['#FF6B6B','#4ECDC4','#FFD93D','#A29BFE'];

// =================== BATTLE LOGIC ===================

function resolveAttack(attackerMonster, defenderMonster, attackIdx) {
  const attack = attackIdx===0 ? attackerMonster.attack1 : attackerMonster.attack2;
  const roll = rollDice();
  const hit = checkHit(roll, attack, attackerMonster);
  let damage = 0, multiplier = 1;
  if (hit) {
    const result = calcDamage(attack, attackerMonster, defenderMonster);
    damage = result.damage;
    multiplier = result.multiplier;
  }
  return { attack: attack.name, roll, roll1: attack.roll1, roll2: attack.roll2, hit, damage, multiplier };
}

function resolveEnemyTurn(gs) {
  const battle = gs.battle;
  const player = gs.players.find(p=>p.id===battle.playerId);
  const playerMonster = player.monsters[battle.playerMonsterIdx];
  const wild = battle.wildMonster;
  const attackIdx = Math.random()<0.5 ? 0 : 1;
  const result = resolveAttack(wild, playerMonster, attackIdx);
  result.type = 'enemy';
  result.wildHp = battle.wildMonsterHp;
  if (result.hit) {
    battle.playerMonsterHp = Math.max(0, battle.playerMonsterHp - result.damage);
    playerMonster.hp = battle.playerMonsterHp;
  }
  result.playerMonsterHp = battle.playerMonsterHp;
  battle.log.push(result);

  if (battle.playerMonsterHp <= 0) {
    battle.fallenMonsterName = playerMonster.name;
    playerMonster.hp = 0;
    player.monsters.splice(battle.playerMonsterIdx, 1);
    battle.playerMonsterIdx = 0;
    if (player.monsters.length > 0) {
      battle.phase = 'defeat_select';
    } else {
      // Player fights directly with their sword
      battle.phase = 'player_fight';
      battle.playerHp = player.hp;
    }
  } else {
    battle.phase = 'player_turn';
  }
}

// =================== ROOMS ===================

const rooms = {};

function initGameState(players) {
  const regionMap = generateRegionMap();
  const villages = findVillageHexes(regionMap, []);
  const villageHexes = villages.map(v => v.hex);
  const bossHexes = findBossHexes(regionMap, villageHexes);
  const startPositions = findStartPositions(regionMap, bossHexes, players.length);
  return {
    players: players.map((p,i) => ({
      ...p,
      position: {...(startPositions[i] || START_POS[i])},
      hp: 100, maxHp: 100,
      gold: 100,
      hasShip: false,
      monsters: [],
      inventory: [],
      playerEquipped: [],
      bossesDefeated: [],
    })),
    currentTurn: 0,
    phase: 'select_monster',
    monstersSelected: 0,
    currentScenario: null,
    pendingCard: null,
    battle: null,
    isBossEncounter: false,
    regionMap,
    bossHexes,
    camps: {},
    wanderers: [],
    activeWandererIdx: -1,
    villages,
    activeVillageIdx: -1,
    villageShopItems: [],
    villageTamerMonster: null,
    turnCount: 0,
    scenarioDecks: {
      meadow: shuffle([...SCENARIO_CARDS.meadow]),
      forest: shuffle([...SCENARIO_CARDS.forest]),
      misty:  shuffle([...SCENARIO_CARDS.misty]),
      volcan: shuffle([...SCENARIO_CARDS.volcan]),
    },
    treasureDeck: shuffle([...TREASURE_CARDS]),
    log: [],
  };
}

// =================== SOCKET ===================

io.on('connection', (socket) => {
  socket.on('create_room', ({ name }) => {
    const roomId = Math.random().toString(36).slice(2,8).toUpperCase();
    const player = { id:socket.id, name, color:PLAYER_COLORS[0], isHost:true };
    rooms[roomId] = { id:roomId, players:[player], started:false, gameState:null };
    socket.join(roomId); socket.data.roomId = roomId;
    socket.emit('room_created', { roomId, player, starters:STARTER_MONSTERS });
    io.to(roomId).emit('lobby_update', rooms[roomId]);
  });

  socket.on('join_room', ({ roomId, name }) => {
    const room = rooms[roomId];
    if (!room) return socket.emit('error','Room not found');
    if (room.started) return socket.emit('error','Game already started');
    if (room.players.length>=4) return socket.emit('error','Room is full');
    const player = { id:socket.id, name, color:PLAYER_COLORS[room.players.length], isHost:false };
    room.players.push(player);
    socket.join(roomId); socket.data.roomId = roomId;
    socket.emit('room_joined', { roomId, player, starters:STARTER_MONSTERS });
    io.to(roomId).emit('lobby_update', room);
  });

  socket.on('start_game', () => {
    const room = rooms[socket.data.roomId];
    if (!room) return;
    if (!room.players.find(p=>p.id===socket.id)?.isHost) return;
    room.started = true;
    room.gameState = initGameState(room.players);
    io.to(room.id).emit('game_started', { gameState:room.gameState, starters:STARTER_MONSTERS });
  });

  socket.on('select_monster', ({ monsterId }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const player = gs.players.find(p=>p.id===socket.id);
    if (!player || player.monsters.length>0) return;
    const starter = STARTER_MONSTERS.find(m=>m.id===monsterId);
    if (!starter) return;
    const m = JSON.parse(JSON.stringify(starter));
    m.hp = m.maxHp;
    player.monsters.push(m);
    gs.monstersSelected++;
    if (gs.monstersSelected >= gs.players.length) {
      gs.phase = 'gathering';
      gs.playersReady = 0;
      gs.players.forEach(p => { p.gatheredReady = false; });
    }
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('move', ({ col, row }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='move') return;
    if (!isAdjacent(cp.position,{col,row})) return;
    // Block entry to Misty Islands without a ship
    const targetRegion = getRegion(col, row, gs.regionMap);
    if (targetRegion === 'misty' && !cp.hasShip) {
      socket.emit('move_blocked', { message: 'Thou needst a ship to sail the Misty Islands. Visit a coastal village to hire one.' });
      return;
    }
    cp.position = {col,row};
    const bossRegion = getBossRegion(col, row, gs.bossHexes);
    if (bossRegion && !cp.bossesDefeated.includes(bossRegion)) {
      gs.pendingCard = createBossMonster(bossRegion);
      gs.isBossEncounter = true;
      gs.phase = 'encounter';
      gs.log.push(`⚔️ ${cp.name} challenged the ${bossRegion} boss!`);
      io.to(room.id).emit('game_state_update', gs);
      return;
    }
    // Landing on own camp → offer rest
    const hexKey = `${col},${row}`;
    if (gs.camps[hexKey] && gs.camps[hexKey].playerId === cp.id) {
      gs.phase = 'camp_rest';
      gs.log.push(`🏕️ ${cp.name} returned to camp!`);
      io.to(room.id).emit('game_state_update', gs);
      return;
    }
    // Check for wanderer NPC on this hex
    const wIdx = gs.wanderers.findIndex(w => w.hex.col === col && w.hex.row === row);
    if (wIdx !== -1) {
      gs.activeWandererIdx = wIdx;
      gs.phase = 'wanderer_encounter';
      io.to(room.id).emit('game_state_update', gs);
      return;
    }
    // Check for village on this hex
    const vIdx = (gs.villages || []).findIndex(v => v.hex.col === col && v.hex.row === row);
    if (vIdx !== -1) {
      gs.activeVillageIdx = vIdx;
      gs.phase = 'village';
      gs.log.push(`🏘️ ${cp.name} entered the village.`);
      io.to(room.id).emit('game_state_update', gs);
      return;
    }
    // Offer camp building before drawing scenario
    gs.phase = 'camp_choice';
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('build_camp', ({ itemIndices }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'camp_choice') return;
    if (!Array.isArray(itemIndices) || itemIndices.length !== 3) return;
    const unique = [...new Set(itemIndices)];
    if (unique.length !== 3) return;
    const sorted = unique.sort((a, b) => b - a);
    if (sorted[0] >= cp.inventory.length) return;
    sorted.forEach(i => cp.inventory.splice(i, 1));
    const key = `${cp.position.col},${cp.position.row}`;
    gs.camps[key] = { playerId: cp.id, playerName: cp.name, color: cp.color };
    gs.log.push(`🏕️ ${cp.name} built a camp!`);
    endTurn(room);
  });

  socket.on('skip_camp', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'camp_choice') return;
    doDrawScenario(gs, cp, room);
  });

  socket.on('rest_camp', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'camp_rest') return;
    cp.hp = cp.maxHp;
    cp.monsters.forEach(m => { m.hp = m.maxHp; });
    gs.log.push(`🏕️ ${cp.name} rested at camp — fully healed!`);
    endTurn(room);
  });

  socket.on('retreat_encounter', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'encounter' || gs.isBossEncounter) return;
    const roll = Math.ceil(Math.random() * 6);
    if (roll >= 4) {
      gs.log.push(`🏃 ${cp.name} rolled a ${roll} and retreated successfully!`);
      io.to(room.id).emit('retreat_result', { success: true, roll });
      setTimeout(() => endTurn(room), 3000);
    } else {
      gs.log.push(`⚔️ ${cp.name} rolled a ${roll} — retreat failed! Must fight!`);
      io.to(room.id).emit('retreat_result', { success: false, roll });
    }
  });

  // ── VILLAGE HANDLERS ──

  socket.on('village_leave', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || !gs.phase.startsWith('village')) return;
    gs.activeVillageIdx = -1;
    gs.villageShopItems = [];
    gs.villageTamerMonster = null;
    gs.log.push(`${cp.name} departed the village.`);
    endTurn(room);
  });

  socket.on('village_shop_open', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village') return;
    gs.villageShopItems = pickShopItems(5);
    gs.phase = 'village_shop';
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_shop_close', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village_shop') return;
    gs.phase = 'village';
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_buy_item', ({ itemId }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village_shop') return;
    const item = gs.villageShopItems?.find(i => i.id === itemId);
    if (!item) return;
    if ((cp.gold || 0) < item.gpValue) return;
    cp.gold = (cp.gold || 0) - item.gpValue;
    cp.inventory.push(JSON.parse(JSON.stringify(item)));
    gs.log.push(`🪙 ${cp.name} bought ${item.name} for ${item.gpValue}gp.`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_sell_item', ({ itemId }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village_shop') return;
    const idx = cp.inventory.findIndex(i => i.id === itemId);
    if (idx === -1) return;
    const item = cp.inventory[idx];
    cp.inventory.splice(idx, 1);
    cp.gold = (cp.gold || 0) + (item.gpValue || 0);
    gs.log.push(`🪙 ${cp.name} sold ${item.name} for ${item.gpValue || 0}gp.`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_inn', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village') return;
    if ((cp.gold || 0) < 50) return;
    cp.gold -= 50;
    cp.hp = cp.maxHp;
    cp.monsters.forEach(m => { m.hp = m.maxHp; });
    gs.log.push(`🛏️ ${cp.name} rested at the inn — fully healed for 50gp!`);
    gs.activeVillageIdx = -1;
    endTurn(room);
  });

  socket.on('village_tamer_open', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village') return;
    gs.villageTamerMonster = pickTamerMonster();
    gs.phase = 'village_tamer';
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_tamer_close', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village_tamer') return;
    gs.phase = 'village';
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_buy_monster', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village_tamer') return;
    const monster = gs.villageTamerMonster;
    if (!monster) return;
    if ((cp.gold || 0) < monster.gpValue) return;
    if (cp.monsters.length >= 5) return;
    cp.gold -= monster.gpValue;
    const newM = JSON.parse(JSON.stringify(monster));
    newM.hp = newM.maxHp;
    cp.monsters.push(newM);
    gs.villageTamerMonster = null;
    gs.log.push(`🐉 ${cp.name} purchased ${newM.name} for ${newM.gpValue}gp.`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_sell_monster', ({ monsterIdx }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village_tamer') return;
    if (monsterIdx < 0 || monsterIdx >= cp.monsters.length) return;
    const monster = cp.monsters[monsterIdx];
    (monster.equipped || []).forEach(item => cp.inventory.push(item));
    const price = monster.gpValue || 0;
    cp.gold = (cp.gold || 0) + price;
    cp.monsters.splice(monsterIdx, 1);
    gs.log.push(`🐉 ${cp.name} sold ${monster.name} for ${price}gp.`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('village_hire_ship', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'village') return;
    const village = gs.villages[gs.activeVillageIdx];
    if (!village?.isCoastal) return;
    if ((cp.gold || 0) < 300) return;
    cp.gold -= 300;
    cp.hasShip = true;
    gs.log.push(`⚓ ${cp.name} hired a ship and crew for 300gp — the Misty Islands await!`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('wanderer_give_item', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'wanderer_encounter') return;
    const wanderer = gs.wanderers[gs.activeWandererIdx];
    if (!wanderer) return;
    const itemIdx = cp.inventory.findIndex(item => item.id === wanderer.itemId);
    if (itemIdx === -1) return;
    cp.inventory.splice(itemIdx, 1);
    gs.wanderers.splice(gs.activeWandererIdx, 1);
    gs.activeWandererIdx = -1;
    gs.phase = 'wanderer_reward';
    gs.log.push(`✨ ${cp.name} gave the wanderer their ${wanderer.itemName}!`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('wanderer_skip', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'wanderer_encounter') return;
    gs.activeWandererIdx = -1;
    gs.log.push(`${cp.name} left the sage without an offering.`);
    // Wanderer remains on the board; player cannot draw scenario or build camp here
    endTurn(room);
  });

  socket.on('wanderer_choose_reward', ({ choice }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'wanderer_reward') return;
    if (choice === 'hp_boost') {
      cp.monsters.forEach(m => { m.maxHp += 20; });
      gs.log.push(`💪 ${cp.name}'s monsters all gained +20 max HP!`);
    } else if (choice === 'full_heal') {
      cp.hp = cp.maxHp;
      cp.monsters.forEach(m => { m.hp = m.maxHp; });
      gs.log.push(`💚 ${cp.name} and their monsters were fully healed!`);
    } else if (choice === 'new_monster') {
      const eligible = Object.values(REGION_MONSTERS).flat().filter(m => m.maxHp >= 50);
      if (eligible.length && cp.monsters.length < 4) {
        const template = eligible[Math.floor(Math.random() * eligible.length)];
        const newM = JSON.parse(JSON.stringify(template));
        newM.hp = newM.maxHp;
        cp.monsters.push(newM);
        gs.log.push(`🎁 ${cp.name} received ${newM.name} from the wanderer!`);
      }
    }
    endTurn(room);
  });

  socket.on('skip_camp_rest', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase !== 'camp_rest') return;
    doDrawScenario(gs, cp, room);
  });

  socket.on('choose_option', ({ choice }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='scenario') return;
    const sc = gs.currentScenario;
    const result = sc[`result${choice}`];
    const choiceText = sc[`opt${choice}`];
    const summary = sc[`summary${choice}`];
    const hpDelta = parseInt(sc[`hp${choice}`]) || 0;
    gs.log.push(`${cp.name} chose: ${choiceText}`);
    gs.scenarioOutcome = { choiceText, summary, result, hpDelta };
    if (result==='treasure') {
      if (!gs.treasureDeck.length) gs.treasureDeck = shuffle([...TREASURE_CARDS]);
      gs.pendingCard = gs.treasureDeck.pop();
      gs.phase = 'scenario_outcome';
    } else if (result==='territory') {
      gs.phase = 'scenario_outcome';
    } else if (result==='damage') {
      cp.hp = Math.max(0, cp.hp + hpDelta);
      gs.log.push(`${cp.name} took ${Math.abs(hpDelta)} damage! HP: ${cp.hp}/${cp.maxHp}`);
      if (cp.hp <= 0) eliminatePlayer(gs, cp, room);
      gs.phase = 'scenario_outcome';
    } else if (result==='heal') {
      cp.hp = Math.min(cp.maxHp, cp.hp + hpDelta);
      gs.log.push(`${cp.name} healed ${hpDelta} HP! HP: ${cp.hp}/${cp.maxHp}`);
      gs.phase = 'scenario_outcome';
    }
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('scenario_outcome_continue', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='scenario_outcome') return;
    const outcome = gs.scenarioOutcome;
    if (outcome?.result==='treasure') {
      gs.phase = 'treasure';
    } else if (outcome?.result==='territory') {
      const region = getRegion(cp.position.col, cp.position.row, gs.regionMap);
      const monsters = REGION_MONSTERS[region].filter(m => !BOSS_IDS.has(m.id));
      const wild = JSON.parse(JSON.stringify(monsters[Math.floor(Math.random()*monsters.length)]));
      wild.hp = wild.maxHp;
      gs.pendingCard = wild;
      gs.phase = 'encounter';
      gs.log.push(`${cp.name} encountered: ${wild.name}`);
    } else {
      endTurn(room);
      return;
    }
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('use_treasure', ({ action, monsterIdx }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='treasure') return;
    const card = gs.pendingCard;
    const targetMonster = cp.monsters[monsterIdx ?? 0];
    if (action==='use' && card.usage==='use_once') {
      if (card.type==='heal_player') cp.hp = Math.min(cp.maxHp, cp.hp+card.value);
      else if (card.type==='heal_monster' && targetMonster) targetMonster.hp = Math.min(targetMonster.maxHp, targetMonster.hp+card.value);
    } else if (action==='equip' && card.usage==='equip' && targetMonster) {
      targetMonster.equipped = targetMonster.equipped||[];
      targetMonster.equipped.push(card);
      if (card.type==='hp_boost') { targetMonster.maxHp+=card.value; targetMonster.hp+=card.value; }
    } else if (action==='keep') {
      cp.inventory.push(card);
    }
    endTurn(room);
  });

  // ── BATTLE EVENTS ──

  socket.on('battle_start', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='encounter') return;
    const wild = JSON.parse(JSON.stringify(gs.pendingCard));
    wild.hp = wild.maxHp;
    const startPhase = cp.monsters.length > 0 ? 'select_monster' : 'player_fight';
    gs.battle = {
      active: true, playerId: cp.id,
      phase: startPhase,
      playerMonsterIdx: 0,
      playerMonsterHp: 0,
      playerHp: startPhase === 'player_fight' ? cp.hp : 0,
      wildMonster: wild,
      wildMonsterHp: wild.maxHp,
      playerInitRoll: null, wildInitRoll: null,
      log: [],
    };
    gs.phase = 'battle';
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('battle_select_monster', ({ idx }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const battle = gs.battle;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || battle?.phase!=='select_monster') return;
    if (idx<0 || idx>=cp.monsters.length) return;
    battle.playerMonsterIdx = idx;
    battle.playerMonsterHp = cp.monsters[idx].hp;
    // Roll initiative
    const pRoll = rollDice(), wRoll = rollDice();
    battle.playerInitRoll = pRoll; battle.wildInitRoll = wRoll;
    battle.log = [];
    const firstTurn = pRoll >= wRoll ? 'player' : 'enemy';
    battle.firstTurn = firstTurn;
    // Emit initiative phase first so client can animate the roll
    battle.phase = 'initiative';
    io.to(room.id).emit('game_state_update', gs);
    // Monster always attacks before player can choose their strike
    setTimeout(() => {
      if (!room.gameState || !room.gameState.battle) return;
      battle.phase = 'enemy_turn';
      io.to(room.id).emit('game_state_update', gs);
      setTimeout(() => {
        if (!room.gameState || !room.gameState.battle) return;
        resolveEnemyTurn(gs);
        io.to(room.id).emit('game_state_update', gs);
      }, 1200);
    }, 2600);
  });

  socket.on('battle_attack', ({ attackIdx }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const battle = gs.battle;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || battle?.phase!=='player_turn') return;
    const playerMonster = cp.monsters[battle.playerMonsterIdx];
    const result = resolveAttack(playerMonster, battle.wildMonster, attackIdx);
    result.type = 'player';
    if (result.hit) {
      battle.wildMonsterHp = Math.max(0, battle.wildMonsterHp - result.damage);
      battle.wildMonster.hp = battle.wildMonsterHp;
    }
    result.wildHp = battle.wildMonsterHp;
    result.playerMonsterHp = battle.playerMonsterHp;
    battle.log.push(result);

    if (battle.wildMonsterHp <= 0) {
      battle.phase = 'victory';
      io.to(room.id).emit('game_state_update', gs);
    } else {
      // Emit player attack first so client animates it and applies damage to enemy
      battle.phase = 'enemy_turn';
      io.to(room.id).emit('game_state_update', gs);
      // After player attack animation (~970ms), resolve enemy counter-attack
      setTimeout(() => {
        if (!room.gameState || !room.gameState.battle) return;
        resolveEnemyTurn(gs);
        io.to(room.id).emit('game_state_update', gs);
      }, 1200);
    }
  });

  socket.on('battle_capture', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || gs.battle?.phase!=='victory') return;
    if (cp.monsters.length < 5) {
      const captured = JSON.parse(JSON.stringify(gs.battle.wildMonster));
      captured.hp = captured.maxHp;
      captured.equipped = [];
      cp.monsters.push(captured);
      gs.log.push(`${cp.name} captured ${captured.name}!`);
    }
    gs.battle = null;
    endTurn(room);
  });

  socket.on('battle_take_treasure', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || gs.battle?.phase!=='victory') return;
    if (!gs.treasureDeck.length) gs.treasureDeck = shuffle([...TREASURE_CARDS]);
    gs.pendingCard = gs.treasureDeck.pop();
    gs.battle = null;
    gs.phase = 'treasure';
    gs.log.push(`${cp.name} drew a treasure card after battle!`);
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('battle_next_monster', ({ idx }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const battle = gs.battle;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || battle?.phase!=='defeat_select') return;
    if (idx<0 || idx>=cp.monsters.length) return;
    battle.playerMonsterIdx = idx;
    battle.playerMonsterHp = cp.monsters[idx].hp;
    // New initiative roll
    const pRoll = rollDice(), wRoll = rollDice();
    battle.playerInitRoll = pRoll; battle.wildInitRoll = wRoll;
    battle.log = [];
    const firstTurn = pRoll >= wRoll ? 'player' : 'enemy';
    battle.firstTurn = firstTurn;
    // Emit initiative phase first, then monster always attacks before player can choose
    battle.phase = 'initiative';
    io.to(room.id).emit('game_state_update', gs);
    setTimeout(() => {
      if (!room.gameState || !room.gameState.battle) return;
      battle.phase = 'enemy_turn';
      io.to(room.id).emit('game_state_update', gs);
      setTimeout(() => {
        if (!room.gameState || !room.gameState.battle) return;
        resolveEnemyTurn(gs);
        io.to(room.id).emit('game_state_update', gs);
      }, 1200);
    }, 2600);
  });

  socket.on('battle_player_attack', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const battle = gs.battle;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || battle?.phase!=='player_fight') return;
    const roll = rollDice();
    const rollBonus = (cp.playerEquipped || []).filter(e => e.type === 'player_roll_bonus').reduce((s, e) => s + e.value, 0);
    const attackBonus = (cp.playerEquipped || []).filter(e => e.type === 'player_attack_bonus').reduce((s, e) => s + e.value, 0);
    const effectiveRoll = roll + rollBonus;
    const hit = effectiveRoll >= 5;
    const damage = hit ? 30 + attackBonus : 0;
    if (hit) {
      battle.wildMonsterHp = Math.max(0, battle.wildMonsterHp - damage);
      battle.wildMonster.hp = battle.wildMonsterHp;
    }
    const result = { type:'player_self', attack:'Sword Strike', roll, effectiveRoll, rollBonus, hit, damage, multiplier:1, wildHp:battle.wildMonsterHp, playerHp:battle.playerHp };
    battle.log.push(result);
    if (battle.wildMonsterHp <= 0) {
      battle.phase = 'victory';
      io.to(room.id).emit('game_state_update', gs);
    } else {
      // Emit player sword strike first so client animates it
      io.to(room.id).emit('game_state_update', gs);
      // After animation, resolve enemy counter-attack
      setTimeout(() => {
        if (!room.gameState || !room.gameState.battle) return;
        const wild = battle.wildMonster;
        const aIdx = Math.random()<0.5 ? 0 : 1;
        const atk = aIdx===0 ? wild.attack1 : wild.attack2;
        const eRoll = rollDice();
        const eHit = eRoll === atk.roll1 || eRoll === atk.roll2;
        const eDamage = eHit ? atk.damage : 0;
        if (eHit) {
          battle.playerHp = Math.max(0, battle.playerHp - eDamage);
          cp.hp = battle.playerHp;
        }
        const eResult = { type:'enemy_vs_player', attack:atk.name, roll:eRoll, roll1:atk.roll1, roll2:atk.roll2, hit:eHit, damage:eDamage, multiplier:1, wildHp:battle.wildMonsterHp, playerHp:battle.playerHp };
        battle.log.push(eResult);
        if (battle.playerHp <= 0) {
          cp.hp = 0;
          battle.phase = 'player_defeated';
          eliminatePlayer(gs, cp, room);
        }
        io.to(room.id).emit('game_state_update', gs);
      }, 1200);
    }
  });

  socket.on('use_inventory_item', ({ itemId, action, monsterIdx }) => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id !== socket.id || gs.phase === 'battle') return;
    const itemIndex = cp.inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return;
    const item = cp.inventory[itemIndex];
    const monster = cp.monsters[monsterIdx ?? 0];
    if (action === 'use' && item.usage === 'use_once') {
      if (item.type === 'heal_player') cp.hp = Math.min(cp.maxHp, cp.hp + item.value);
      else if (item.type === 'heal_monster' && monster) monster.hp = Math.min(monster.maxHp, monster.hp + item.value);
      cp.inventory.splice(itemIndex, 1);
      gs.log.push(`${cp.name} used ${item.name}`);
    } else if (action === 'equip' && item.usage === 'equip' && monster) {
      monster.equipped = monster.equipped || [];
      monster.equipped.push(item);
      if (item.type === 'hp_boost') { monster.maxHp += item.value; monster.hp += item.value; }
      cp.inventory.splice(itemIndex, 1);
      gs.log.push(`${cp.name} equipped ${item.name} to ${monster.name}`);
    } else if (action === 'equip_to_player' && item.usage === 'equip_to_player') {
      cp.playerEquipped = cp.playerEquipped || [];
      cp.playerEquipped.push(item);
      if (item.type === 'player_hp_boost') { cp.maxHp += item.value; cp.hp += item.value; }
      cp.inventory.splice(itemIndex, 1);
      gs.log.push(`${cp.name} equipped ${item.name}`);
    }
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('battle_boss_claim', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle' || gs.battle?.phase!=='victory') return;
    const region = gs.battle.wildMonster?.bossRegion;
    if (region && !cp.bossesDefeated.includes(region)) {
      cp.bossesDefeated.push(region);
      gs.log.push(`🏆 ${cp.name} claimed the ${region} territory! (${cp.bossesDefeated.length}/4)`);
    }
    gs.isBossEncounter = false;
    gs.battle = null;
    if (cp.bossesDefeated.length >= 4) {
      gs.phase = 'game_won';
      gs.winner = cp.id;
      gs.winnerName = cp.name;
      gs.log.push(`🎉 ${cp.name} has defeated all 4 bosses and wins the game!`);
      io.to(room.id).emit('game_state_update', gs);
      return;
    }
    endTurn(room);
  });

  socket.on('battle_flee', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    const cp = gs.players[gs.currentTurn];
    if (cp.id!==socket.id || gs.phase!=='battle') return;
    gs.battle = null;
    gs.log.push(`${cp.name} fled from battle!`);
    endTurn(room);
  });

  socket.on('battle_retreat', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    if (gs.players[gs.currentTurn].id!==socket.id) return;
    gs.battle = null;
    endTurn(room);
  });

  socket.on('end_turn', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    if (gs.players[gs.currentTurn].id!==socket.id) return;
    endTurn(room);
  });

  socket.on('player_enter_realm', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const gs = room.gameState;
    if (gs.phase !== 'gathering') return;
    const player = gs.players.find(p => p.id === socket.id);
    if (!player || player.gatheredReady) return;
    player.gatheredReady = true;
    gs.playersReady = (gs.playersReady || 0) + 1;
    const alive = gs.players.filter(p => !p.eliminated);
    if (gs.playersReady >= alive.length) {
      gs.phase = 'move';
      gs.players.forEach(p => { delete p.gatheredReady; });
      delete gs.playersReady;
    }
    io.to(room.id).emit('game_state_update', gs);
  });

  socket.on('spectator_leave', () => {
    const room = rooms[socket.data.roomId];
    if (!room?.gameState) return;
    const p = room.gameState.players.find(p => p.id === socket.id);
    if (p) p.spectating = true;
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (!roomId||!rooms[roomId]) return;
    const room = rooms[roomId];
    room.players = room.players.filter(p=>p.id!==socket.id);
    if (room.players.length===0) { delete rooms[roomId]; return; }
    if (room.gameState) {
      room.gameState.players = room.gameState.players.filter(p=>p.id!==socket.id);
      if (room.gameState.currentTurn >= room.gameState.players.length) room.gameState.currentTurn = 0;
    }
    io.to(roomId).emit('lobby_update', room);
    if (room.gameState) io.to(roomId).emit('game_state_update', room.gameState);
  });
});

function spawnWanderer(gs) {
  if (gs.wanderers.length >= 3) return;
  const occupied = new Set([
    ...Object.values(gs.bossHexes).map(p => `${p.col},${p.row}`),
    ...(gs.villages || []).map(v => `${v.hex.col},${v.hex.row}`),
    ...gs.wanderers.map(w => `${w.hex.col},${w.hex.row}`),
    ...gs.players.map(p => p.position ? `${p.position.col},${p.position.row}` : ''),
  ]);
  const available = [];
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++)
      if (!occupied.has(`${c},${r}`)) available.push({ col: c, row: r });
  if (!available.length) return;
  const hex = available[Math.floor(Math.random() * available.length)];
  const requestItem = TREASURE_CARDS[Math.floor(Math.random() * TREASURE_CARDS.length)];
  gs.wanderers.push({
    id: `w_${Date.now()}`,
    hex,
    itemId: requestItem.id,
    itemName: requestItem.name,
    icon: requestItem.icon || '📦',
  });
  gs.log.push(`🧙 A wanderer appeared seeking: ${requestItem.name}`);
}

function doDrawScenario(gs, cp, room) {
  const region = getRegion(cp.position.col, cp.position.row, gs.regionMap);
  let deck = gs.scenarioDecks[region];
  if (!deck.length) { gs.scenarioDecks[region] = shuffle([...SCENARIO_CARDS[region]]); deck = gs.scenarioDecks[region]; }
  const rawCard = {...deck.pop(), region};
  const optOrder = shuffle([1,2,3,4]);
  const sc = {};
  optOrder.forEach((orig, newIdx) => {
    const n = newIdx + 1;
    sc[`opt${n}`]    = rawCard[`opt${orig}`];
    sc[`result${n}`] = rawCard[`result${orig}`];
    sc[`hp${n}`]     = rawCard[`hp${orig}`];
    sc[`summary${n}`]= rawCard[`summary${orig}`];
  });
  gs.currentScenario = {...rawCard, ...sc};
  gs.phase = 'scenario';
  gs.log.push(`${cp.name} drew a scenario card`);
  io.to(room.id).emit('game_state_update', gs);
}

function eliminatePlayer(gs, cp, room) {
  cp.eliminated = true;
  cp.hp = 0;
  gs.log.push(`${cp.name} has fallen and is out of the game.`);
  const alive = gs.players.filter(p => !p.eliminated);
  if (alive.length === 1) {
    gs.gameOver = { winner: alive[0].name, winnerId: alive[0].id };
    gs.log.push(`${alive[0].name} is the last champion standing!`);
  } else if (alive.length === 0) {
    gs.gameOver = { winner: null, winnerId: null };
  }
}

function endTurn(room) {
  const gs = room.gameState;
  gs.turnCount = (gs.turnCount || 0) + 1;
  if (gs.turnCount % 3 === 0) spawnWanderer(gs);
  // Skip eliminated players
  let next = (gs.currentTurn + 1) % gs.players.length;
  let safety = 0;
  while (gs.players[next].eliminated && safety < gs.players.length) {
    next = (next + 1) % gs.players.length;
    safety++;
  }
  gs.currentTurn = next;
  gs.phase = 'move';
  gs.currentScenario = null;
  gs.pendingCard = null;
  gs.battle = null;
  gs.isBossEncounter = false;
  gs.activeWandererIdx = -1;
  io.to(room.id).emit('game_state_update', gs);
}

const PORT = process.env.PORT||3000;
server.listen(PORT, ()=>console.log(`\n🎮 Elemental Monsters → http://localhost:${PORT}\n`));
