const TOWERS = [
  { name: "初めの塔", floors: 10, enemyRows: ["front"] },
  { name: "センタワー", floors: 15, enemyRows: ["front"] },
  { name: "影の塔", floors: 10, enemyRows: ["front", "back"] },
  { name: "フォースタワー", floors: 10, enemyRows: ["front", "back"] },
  { name: "ゴノタワー", floors: 15, enemyRows: ["front", "back"] },
  { name: "シスの塔", floors: 15, enemyRows: ["front", "back"] },
  { name: "セットの塔", floors: 15, enemyRows: ["front", "back"] },
  { name: "アインの塔", floors: 15, enemyRows: ["front", "back"] },
  { name: "ニンスの塔", floors: 15, enemyRows: ["front", "back"] },
  { name: "最後の塔", floors: 10, enemyRows: ["front", "back"] }
];
const TOWER_FIRST_CLEAR_REWARDS = [
  { policyPoints: 20, gold: 300 },
  { policyPoints: 60, gold: 1200 },
  { policyPoints: 120, gold: 3000 },
  { policyPoints: 220, gold: 7000 },
  { policyPoints: 360, gold: 14000 },
  { policyPoints: 550, gold: 25000 },
  { policyPoints: 800, gold: 40000 },
  { policyPoints: 1100, gold: 65000 },
  { policyPoints: 1450, gold: 95000 },
  { policyPoints: 1850, gold: 130000 }
];
const TOWER_BOSSES = [
  { name: "塔の番人", attackType: "physical", range: 1, hp: 120, mp: 10, atk: 20, pDef: 7, mDef: 4, agi: 5, exp: 80, gold: 90 },
  { name: "ゴブリン王", attackType: "physical", range: 1, hp: 185, mp: 10, atk: 32, pDef: 8, mDef: 5, agi: 7, exp: 115, gold: 135, statusAttack: { status: "stun", chance: 0.1 } },
  { name: "影狼王", attackType: "physical", range: 1, hp: 220, mp: 12, atk: 48, pDef: 6, mDef: 9, agi: 16, exp: 160, gold: 220, statusAttack: { status: "stun", chance: 0.25 } },
  { name: "黒騎士隊長", attackType: "physical", range: 1, hp: 250, mp: 12, atk: 54, pDef: 16, mDef: 6, agi: 7, exp: 220, gold: 340, statusAttack: { status: "stun", chance: 0.15 } },
  { name: "闇司祭長", attackType: "magic", range: 3, hp: 280, mp: 18, atk: 62, pDef: 5, mDef: 28, agi: 10, exp: 300, gold: 520, statusAttack: { status: "venom", chance: 0.25 } },
  { name: "骸骨将軍", attackType: "physical", range: 1, hp: 380, mp: 14, atk: 50, pDef: 18, mDef: 10, agi: 9, exp: 410, gold: 760, statusAttack: { status: "poison", chance: 0.25 } },
  { name: "火霊王", attackType: "magic", range: 3, hp: 450, mp: 22, atk: 110, pDef: 8, mDef: 60, agi: 52, exp: 560, gold: 1080, statusAttack: { status: "stun", chance: 0.25 } },
  { name: "鉄巨人改", attackType: "physical", range: 1, hp: 660, mp: 16, atk: 82, pDef: 38, mDef: 8, agi: 4, exp: 780, gold: 1500, statusAttack: { status: "stun", chance: 0.1 } },
  { name: "ダークピッグロード", attackType: "both", range: 2, hp: 820, mp: 22, atk: 168, pDef: 30, mDef: 26, agi: 12, exp: 1050, gold: 1900, statusAttack: { status: "venom", chance: 0.28 } },
  { name: "天塔竜", attackType: "both", range: 3, hp: 1070, mp: 16, atk: 202, pDef: 50, mDef: 52, agi: 58, exp: 1480, gold: 2150, statusAttack: { status: "paralysis", chance: 0.25 } }
];
const TOTAL_FLOORS = TOWERS.reduce((sum, tower) => sum + tower.floors, 0);
const MAX_ROW_SIZE = 3;
const MAX_MEMBER_COUNT = 40;
const SAVE_KEY_PREFIX = "ai-jrpg-save-v1-slot";
const SAVE_SLOT_COUNT = 10;
const ENDING_BONUS_BASE_TURN = 60;
const TAVERN_RECRUIT_COST_BASE = 5;
const TAVERN_EXPANSION_COSTS = [20, 200];
const TAVERN_MAX_LEVEL = TAVERN_EXPANSION_COSTS.length;
const HUNTER_GUILD_BUILD_COSTS = [15, 50, 100, 150, 200, 250, 300, 350, 400, 500];
const HUNTER_GUILD_MAX_LEVEL = HUNTER_GUILD_BUILD_COSTS.length;
const THIEF_GUILD_BUILD_COSTS = [15, 50, 100, 150, 200, 250, 300, 350, 400, 500];
const THIEF_GUILD_MAX_LEVEL = THIEF_GUILD_BUILD_COSTS.length;
const MERCHANT_GUILD_BUILD_COSTS = [15, 50, 100, 150, 200, 250, 300, 350, 400, 500];
const MERCHANT_GUILD_MAX_LEVEL = MERCHANT_GUILD_BUILD_COSTS.length;
const MERCHANT_GUILD_INCOME_CAP = 30000;
const BGM_SETTING_KEY = "ai-jrpg-bgm-volume";
const BGM_DEFAULT_LEVEL = 5;
const BGM_MAX_LEVEL = 10;
const BGM_TRACKS = {
  policy: { name: "街", src: "audio/bgm/town.mp3" },
  dungeon: { name: "探索", src: "audio/bgm/dungeon.mp3" },
  dungeon6: { name: "シスの塔", src: "audio/bgm/maoudamashii-game-dangeon22.mp3" },
  battle: { name: "戦闘", src: "audio/bgm/dungeon.mp3" },
  finalBoss: { name: "ラスボス", src: "audio/bgm/maoudamashii-game-lastboss01.mp3" },
  event: { name: "イベント", src: "audio/bgm/event.mp3" },
  ending: { name: "エンディング", src: "audio/bgm/maoudamashii-game-jingle05.mp3" }
};
const PHASE_LABELS = {
  policy: "内政",
  dungeon: "探索",
  event: "イベント",
  ending: "エンディング"
};
const DIFFICULTY_LABELS = {
  normal: "ノーマル",
  hard: "ハード"
};
const ATTACK_TYPE_LABELS = {
  physical: "物理",
  magic: "魔法",
  both: "両方"
};
const JOB_SHORT_LABELS = {
  勇者: "勇",
  戦士: "戦",
  騎士: "騎",
  僧侶: "僧",
  罠師: "罠",
  狩人: "狩",
  忍者: "忍",
  商人: "商",
  魔法使い: "魔",
  内政官: "内"
};
const STATUS_EFFECTS = {
  poison: { label: "毒", damageRate: 0.1, clearsOnHeal: true },
  paralysis: { label: "麻痺", incapacitate: true, duration: 3, clearsOnHeal: true },
  stun: { label: "スタン", incapacitate: true, clearsOnTurnEnd: true },
  sleep: { label: "眠り", incapacitate: true, clearsOnDamage: true },
  venom: { label: "猛毒", damageRate: 0.3, clearsOnHeal: true }
};
const STATUS_ATTACKS = {
  ミナト: { status: "poison", chance: 0.7 },
  クロエ: { status: "stun", chance: 0.5 },
  バルク: { status: "sleep", chance: 0.3 },
  ナギ: { status: "paralysis", chance: 0.3 },
  スライム: { status: "poison", chance: 0.35 },
  こうもり: { status: "sleep", chance: 0 },
  まどうし: { status: "stun", chance: 0.2 },
  塔の番人: { status: "stun", chance: 0 },
  天塔竜: { status: "paralysis", chance: 0.25 },
  影狼: { status: "stun", chance: 0.3 },
  黒騎士: { status: "stun", chance: 0.1 },
  闇司祭: { status: "venom", chance: 0.25 },
  骸骨剣士: { status: "poison", chance: 0.2 },
  火霊: { status: "stun", chance: 0.2 },
  鉄巨人: { status: "stun", chance: 0 },
  オーク: { status: "stun", chance: 0 },
  忍者: { status: "paralysis", chance: 0.4 },
  ダークピッグ: { status: "venom", chance: 0.4 }
};
const HEAL_AP_COST = 1;
const OFFENSIVE_SPELL_AP_COST = 2;
const ASH_BOW_PIERCE_AP_COST = 2;
const KIRIKA_ARROW_RAIN_AP_COST = 2;
const INSTANT_DEATH_AP_COST = 2;
const PARTY_INSTANT_DEATH_CHANCE = 0.35;
const ENEMY_INSTANT_DEATH_CHANCE = 0.22;
const ENEMY_INSTANT_DEATH_USE_RATE = 0.35;
const BOSS_MULTI_ATTACK_RATE = 0.35;
const DARK_PIG_RANRAN_ALL_ATTACK_RATE = 0.3;
const BOSS_PIERCE_ATTACKERS = ["影狼王", "黒騎士隊長", "骸骨将軍", "鉄巨人改"];
const BOSS_ROW_ATTACKERS = ["闇司祭長"];
const BOSS_ALL_ATTACKERS = ["ダークピッグロード", "火霊王"];
const GUARANTEED_STATUS_TARGETS = ["オーク", "ダークピッグ"];
const GROWTH_ITEM_DROP_RATE = 0.03;
const FRUIT_DROP_TOWER_INDEX = 5;
const GROWTH_SEED_ITEM_KEYS = ["hp", "atk", "agi", "pDef", "mDef"];
const GROWTH_FRUIT_ITEM_KEYS = ["hpFruit", "atkFruit", "agiFruit", "pDefFruit", "mDefFruit"];
const GROWTH_ITEMS = {
  hp: { name: "いのちの種", stat: "maxHp", amount: 10, description: "最大HP +10" },
  atk: { name: "力の種", stat: "atk", amount: 4, description: "攻撃 +4" },
  agi: { name: "すばやさの種", stat: "agi", amount: 4, description: "敏捷 +4" },
  pDef: { name: "守りの種", stat: "pDef", amount: 4, description: "物防 +4" },
  mDef: { name: "魔防の種", stat: "mDef", amount: 4, description: "魔防 +4" },
  hpFruit: { name: "いのちの実", stat: "maxHp", amount: 70, description: "最大HP +70" },
  atkFruit: { name: "力の実", stat: "atk", amount: 25, description: "攻撃 +25" },
  agiFruit: { name: "すばやさの実", stat: "agi", amount: 25, description: "敏捷 +25" },
  pDefFruit: { name: "守りの実", stat: "pDef", amount: 25, description: "物防 +25" },
  mDefFruit: { name: "魔防の実", stat: "mDef", amount: 25, description: "魔防 +25" }
};
const GROWTH_ITEM_KEYS = [...GROWTH_SEED_ITEM_KEYS, ...GROWTH_FRUIT_ITEM_KEYS];
const CHARACTER_IMAGE_PATHS = {
  アルス: "assets/characters/ars.png",
  ガロン: "assets/characters/garon.png",
  ミリア: "assets/characters/miria.png",
  スプーン: "assets/characters/seneca.png",
  イモス: "assets/characters/rio.png",
  ノルン: "assets/characters/norn.png",
  エルマ: "assets/characters/elma.png",
  ダブチ: "assets/characters/dario.png",
  メモリ: "assets/characters/cyrus.png",
  フィオナ: "assets/characters/fiona.png",
  ピッポ: "assets/characters/bran.png",
  カリン: "assets/characters/yuna.png",
  セラ: "assets/characters/sera.png",
  バルド: "assets/characters/baldo.png",
  ルキア: "assets/characters/lukia.png",
  オルド: "assets/characters/oldo.png",
  ファルナ: "assets/characters/reina.png",
  ヒビノ: "assets/characters/ash.png",
  ミナト: "assets/characters/minato.png",
  クロエ: "assets/characters/chloe.png",
  キリカ: "assets/characters/kirika.png",
  バルク: "assets/characters/balk.png",
  ロビン: "assets/characters/robin.png",
  ナギ: "assets/characters/nagi.png",
  シルヴァ: "assets/characters/silva.png",
  オサフン: "assets/characters/kagerou.png",
  スズネ: "assets/characters/suzune.png",
  ハヤテ: "assets/characters/hayate.png",
  レナ: "assets/characters/rena.png",
  シグレ: "assets/characters/shigure.png",
  ジーク: "assets/characters/zeke.png",
  マルコ: "assets/characters/marco.png",
  アート: "assets/characters/eris.png",
  トーマ: "assets/characters/toma.png",
  リリア: "assets/characters/lilia.png",
  セド: "assets/characters/sed.png",
  グレン: "assets/characters/glen.png",
  ノア: "assets/characters/noa.png",
  ヴィオラ: "assets/characters/viola.png"
};
const MONSTER_IMAGE_PATHS = {
  スライム: "assets/monsters/slime.png",
  こうもり: "assets/monsters/bat.png",
  ゴブリン: "assets/monsters/goblin.png",
  ゴブリン王: "assets/monsters/goblin.png",
  まどうし: "assets/monsters/wizard.png",
  塔の番人: "assets/monsters/doll_monster.png",
  人形モンスター: "assets/monsters/doll_monster.png",
  天塔竜: "assets/monsters/sky_dragon.png",
  影狼: "assets/monsters/shadow_wolf.png",
  影狼王: "assets/monsters/shadow_wolf.png",
  黒騎士: "assets/monsters/black_knight.png",
  黒騎士隊長: "assets/monsters/black_knight.png",
  闇司祭: "assets/monsters/dark_priest.png",
  闇司祭長: "assets/monsters/dark_priest.png",
  骸骨剣士: "assets/monsters/skeleton_swordsman.png",
  骸骨将軍: "assets/monsters/skeleton_swordsman.png",
  火霊: "assets/monsters/fire_spirit.png",
  火霊王: "assets/monsters/fire_spirit.png",
  鉄巨人: "assets/monsters/iron_golem.png",
  鉄巨人改: "assets/monsters/iron_golem.png",
  オーク: "assets/monsters/orc.png",
  忍者: "assets/monsters/ninja.png",
  ダークピッグ: "assets/monsters/dark_pig.png",
  ダークピッグロード: "assets/monsters/dark_pig.png",
  闇豚らんらん: "assets/monsters/dark_pig_ranran.png"
};
const MEMBER_SPRITE_FALLBACKS = {
  狩人: "盗賊",
  罠師: "盗賊",
  忍者: "盗賊",
  商人: "盗賊",
  内政官: "僧侶"
};

const state = {
  turn: 1,
  difficulty: "normal",
  phase: "policy",
  towerIndex: 0,
  floor: 1,
  clearedFloor: 0,
  gold: 0,
  policyPoints: 0,
  tavernLevel: 0,
  hunterGuildLevel: 0,
  thiefGuildLevel: 0,
  merchantGuildLevel: 0,
  allBuildingsBuildable: false,
  inBattle: false,
  townPlace: "gate",
  activeMemberIndex: 0,
  activeActor: null,
  actionQueue: [],
  actedThisRound: [],
  preemptiveRoundPending: false,
  finalBossChainActive: false,
  ending: null,
  enemies: [],
  pendingDamageEffects: [],
  pendingSubstitutionEffects: [],
  items: createEmptyGrowthInventory(),
  members: startingMembers.map((member) => ({ ...member })),
  formation: {
    front: [],
    back: []
  },
  party: [],
  reserveMembers: recruitableMembers.map((member) => ({ ...member }))
};
state.formation.front = state.members.filter((member) => member.positionType !== "後衛").slice(0, MAX_ROW_SIZE);
state.formation.back = state.members.filter((member) => member.positionType !== "前衛" && !state.formation.front.includes(member)).slice(0, MAX_ROW_SIZE);
syncPartyFromFormation();
normalizeCombatStats(state.members);
normalizeCombatStats(state.reserveMembers);

const els = {
  openingScreen: document.querySelector("#openingScreen"),
  openingStartBtn: document.querySelector("#openingStartBtn"),
  openingHelpBtn: document.querySelector("#openingHelpBtn"),
  openingDifficultyButtons: document.querySelectorAll("[data-opening-difficulty]"),
  locationName: document.querySelector("#locationName"),
  towerProgress: document.querySelector("#towerProgress"),
  travelActions: document.querySelector("#travelActions"),
  statusBtn: document.querySelector("#statusBtn"),
  formationBtn: document.querySelector("#formationBtn"),
  itemsBtn: document.querySelector("#itemsBtn"),
  saveBtn: document.querySelector("#saveBtn"),
  loadBtn: document.querySelector("#loadBtn"),
  bgmBtn: document.querySelector("#bgmBtn"),
  helpBtn: document.querySelector("#helpBtn"),
  partyTitle: document.querySelector("#partyTitle"),
  closeStatusBtn: document.querySelector("#closeStatusBtn"),
  closeFormationBtn: document.querySelector("#closeFormationBtn"),
  closeItemsBtn: document.querySelector("#closeItemsBtn"),
  closeShopBtn: document.querySelector("#closeShopBtn"),
  closeHelpBtn: document.querySelector("#closeHelpBtn"),
  statusDialog: document.querySelector("#statusDialog"),
  formationDialog: document.querySelector("#formationDialog"),
  itemsDialog: document.querySelector("#itemsDialog"),
  shopDialog: document.querySelector("#shopDialog"),
  helpDialog: document.querySelector("#helpDialog"),
  statusContent: document.querySelector("#statusContent"),
  formationContent: document.querySelector("#formationContent"),
  itemsContent: document.querySelector("#itemsContent"),
  shopContent: document.querySelector("#shopContent"),
  helpContent: document.querySelector("#helpContent"),
  shopGold: document.querySelector("#shopGold"),
  party: document.querySelector("#party"),
  battleTitle: document.querySelector("#battleTitle"),
  gold: document.querySelector("#gold"),
  enemyArea: document.querySelector("#enemyArea"),
  commandArea: document.querySelector("#commandArea"),
  log: document.querySelector("#log")
};

els.statusBtn.addEventListener("click", openStatus);
els.openingStartBtn?.addEventListener("click", closeOpening);
els.openingHelpBtn?.addEventListener("click", openHelp);
els.openingDifficultyButtons.forEach((button) => {
  button.addEventListener("click", () => selectOpeningDifficulty(button.dataset.openingDifficulty));
});
els.closeStatusBtn.addEventListener("click", () => els.statusDialog.close());
els.formationBtn.addEventListener("click", openFormation);
els.closeFormationBtn.addEventListener("click", () => els.formationDialog.close());
els.itemsBtn.addEventListener("click", openItems);
els.closeItemsBtn.addEventListener("click", () => els.itemsDialog.close());
els.closeShopBtn.addEventListener("click", () => els.shopDialog.close());
els.helpBtn.addEventListener("click", openHelp);
els.closeHelpBtn.addEventListener("click", () => els.helpDialog.close());
els.saveBtn.addEventListener("click", openSaveSlots);
els.loadBtn.addEventListener("click", openLoadSlots);
els.bgmBtn.addEventListener("click", toggleBgm);

const bgmAudio = new Audio();
bgmAudio.loop = true;
let bgmLevel = Number(localStorage.getItem(BGM_SETTING_KEY));
if (!Number.isInteger(bgmLevel) || bgmLevel < 0 || bgmLevel > BGM_MAX_LEVEL) {
  bgmLevel = localStorage.getItem("ai-jrpg-bgm-enabled") === "on" ? BGM_DEFAULT_LEVEL : 0;
}
let missingBgmLogged = false;
let selectedGrowthItemKey = GROWTH_ITEM_KEYS[0];
let effectAudioContext = null;
bgmAudio.addEventListener("error", () => {
  if (missingBgmLogged) return;
  missingBgmLogged = true;
  addLog("BGMファイルが見つかりません。audio/bgm/ に魔王魂の音源を置いてください。");
});

function renderSprite(patternName, paletteName) {
  const fallbackPattern = paletteName === "monster" ? spritePatterns.ゴブリン : spritePatterns.勇者;
  const pattern = spritePatterns[patternName] || fallbackPattern;
  const palette = spritePalettes[paletteName];
  const width = pattern[0].length;
  const height = pattern.length;
  const pixels = pattern.flatMap((row, y) =>
    [...row].map((key, x) => {
      const color = palette[key];
      return color ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"></rect>` : "";
    })
  ).join("");

  return `
    <svg class="pixel-icon ${paletteName}-sprite" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" shape-rendering="crispEdges">
      ${pixels}
    </svg>
  `;
}

function renderMemberSprite(member) {
  const imagePath = CHARACTER_IMAGE_PATHS[member.name];
  if (imagePath) {
    return `<img class="character-portrait" src="${imagePath}" alt="" aria-hidden="true" onerror="this.replaceWith(document.createRange().createContextualFragment(renderSprite('${member.job}', 'hero')))">`;
  }
  const patternName = spritePatterns[member.name]
    ? member.name
    : MEMBER_SPRITE_FALLBACKS[member.job] || member.job;
  return renderSprite(patternName, "hero");
}

function renderMonsterSprite(enemy) {
  const monsterName = typeof enemy === "string" ? enemy : enemy.name;
  const imagePath = MONSTER_IMAGE_PATHS[monsterName];
  if (imagePath) {
    const portraitClass = monsterName === "闇豚らんらん"
      ? "monster-portrait monster-portrait-boss"
      : "monster-portrait";
    return `<img class="${portraitClass}" src="${imagePath}" alt="" aria-hidden="true" onerror="this.replaceWith(document.createRange().createContextualFragment(renderSprite('${monsterName}', 'monster')))">`;
  }
  return renderSprite(monsterName, "monster");
}

function createEmptyGrowthInventory() {
  return Object.fromEntries(GROWTH_ITEM_KEYS.map((key) => [key, 0]));
}

function currentTower() {
  return TOWERS[state.towerIndex];
}

function currentTotalFloor() {
  return TOWERS.slice(0, state.towerIndex).reduce((sum, tower) => sum + tower.floors, 0) + state.floor;
}

function isFinalTowerFloor() {
  return state.towerIndex === TOWERS.length - 1 && state.floor === currentTower().floors;
}

function towerFirstClearReward(towerIndex) {
  return TOWER_FIRST_CLEAR_REWARDS[towerIndex] || { policyPoints: 0, gold: 0 };
}

function towerBoss(towerIndex = state.towerIndex) {
  return TOWER_BOSSES[towerIndex] || TOWER_BOSSES[TOWER_BOSSES.length - 1];
}

function awardTowerFirstClearReward(towerIndex) {
  const reward = towerFirstClearReward(towerIndex);
  if (reward.policyPoints <= 0 && reward.gold <= 0) return;

  state.policyPoints += reward.policyPoints;
  state.gold += reward.gold;
  addLog(`初回踏破報酬として内政P${reward.policyPoints}、${reward.gold}Gを得た。`);
}

function renderDungeonProgress() {
  if (state.phase === "dungeon") {
    const tower = currentTower();
    const currentFloor = Math.min(state.floor, tower.floors);
    els.locationName.textContent = `${tower.name} ${currentFloor}/${tower.floors}階`;
    els.towerProgress.style.height = `${Math.max(2, (currentFloor / tower.floors) * 100)}%`;
    return;
  }

  els.locationName.textContent = `第${state.turn}T ${PHASE_LABELS[state.phase]}`;
  els.towerProgress.style.height = `${Math.max(2, (state.clearedFloor / TOTAL_FLOORS) * 100)}%`;
}

function openTowerSelect() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "tower";
  render();
}

function startDungeonExploration(towerIndex) {
  if (state.inBattle || state.phase !== "policy" || !isTowerUnlocked(towerIndex)) return;
  state.towerIndex = towerIndex;
  state.floor = 1;
  state.phase = "dungeon";
  state.townPlace = "gate";
  state.enemies = [];
  addLog(`第${state.turn}ターンの探索を始めた。${currentTower().name}1階から登る。`);
  render();
}

function isTowerUnlocked(towerIndex) {
  if (towerIndex === 0) return true;
  const requiredClearedFloor = TOWERS.slice(0, towerIndex).reduce((sum, tower) => sum + tower.floors, 0);
  return state.clearedFloor >= requiredClearedFloor;
}

function climbDungeonFloor() {
  if (state.inBattle || state.phase !== "dungeon") return;
  if (state.clearedFloor >= TOTAL_FLOORS) {
    addLog("すべての塔は踏破済みだ。街へ帰ろう。");
    render();
    return;
  }
  state.enemies = [];
  addLog(`${currentTower().name}${state.floor}階へ登った。`);
  startBattle(state.floor === currentTower().floors);
}

function returnFromDungeon() {
  if (state.inBattle || state.phase !== "dungeon") return;
  state.phase = "event";
  state.enemies = [];
  addLog("街へ帰還した。探索ターンを終え、イベントターンへ進む。");
  render();
}

function openShop() {
  if (state.inBattle || state.phase !== "policy") return;
  renderShop();
  if (!els.shopDialog.open) els.shopDialog.showModal();
  addLog("武器防具屋に入った。");
}

function openTavern() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "tavern";
  addLog("酒場に入った。");
  render();
}

function openBuilding() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "building";
  addLog("建築計画を確認した。");
  render();
}

function returnTownGate() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "gate";
  render();
}

function selectOpeningDifficulty(difficulty) {
  if (!DIFFICULTY_LABELS[difficulty]) return;
  state.difficulty = difficulty;
  updateOpeningDifficultyButtons();
}

function updateOpeningDifficultyButtons() {
  els.openingDifficultyButtons.forEach((button) => {
    const selected = button.dataset.openingDifficulty === state.difficulty;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

function closeOpening() {
  addLog(`難易度: ${difficultyLabel()}で開始。`);
  els.openingScreen?.classList.add("hidden");
  render();
}

function difficultyLabel() {
  return DIFFICULTY_LABELS[state.difficulty] || DIFFICULTY_LABELS.normal;
}

function isHardMode() {
  return state.difficulty === "hard";
}

function clearPolicyPointBonus(clearTurn) {
  const turn = Number.isFinite(Number(clearTurn)) ? Number(clearTurn) : state.turn;
  return Math.pow(ENDING_BONUS_BASE_TURN - turn, 2);
}

function completeGame() {
  const clearTurn = state.turn;
  const bonusPolicyPoints = clearPolicyPointBonus(clearTurn);

  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.actedThisRound = [];
  state.preemptiveRoundPending = false;
  state.finalBossChainActive = false;
  state.phase = "ending";
  state.townPlace = "gate";
  state.clearedFloor = TOTAL_FLOORS;
  state.enemies = [];
  state.pendingDamageEffects = [];
  state.pendingSubstitutionEffects = [];
  state.ending = {
    clearTurn,
    difficulty: state.difficulty,
    bonusPolicyPoints
  };

  addLog("闇豚らんらんを倒した！ こうして平和は訪れた。", "tower-clear-log");
  addLog("遊んでくれてありがとうございました。");
  addLog(`クリアターン: ${clearTurn} / 難易度: ${difficultyLabel()}`);
  addLog(`やり直し時の初期内政Pは${bonusPolicyPoints}になる。`);
  playTowerClearFanfare();
  render();
}

function resetMemberToLevelOne(member, removeJoinFloor = false) {
  const template = actorTemplate(member);
  const resetMember = cloneData(template || member);
  if (removeJoinFloor) delete resetMember.joinFloor;

  resetMember.level = 1;
  resetMember.exp = 0;
  resetMember.hp = resetMember.maxHp;
  resetMember.mp = resetMember.maxMp;
  resetMember.statusEffects = {};
  return resetMember;
}

function resetOpeningFormation() {
  state.formation.front = state.members
    .filter((member) => member.positionType !== "後衛")
    .slice(0, MAX_ROW_SIZE);
  state.formation.back = state.members
    .filter((member) => member.positionType !== "前衛" && !state.formation.front.includes(member))
    .slice(0, MAX_ROW_SIZE);
  syncPartyFromFormation();
}

function restartWithClearBonus() {
  if (state.phase !== "ending") return;

  const ending = state.ending || {
    clearTurn: state.turn,
    difficulty: state.difficulty,
    bonusPolicyPoints: clearPolicyPointBonus(state.turn)
  };

  state.turn = 1;
  state.difficulty = DIFFICULTY_LABELS[ending.difficulty] ? ending.difficulty : state.difficulty;
  state.phase = "policy";
  state.towerIndex = 0;
  state.floor = 1;
  state.clearedFloor = 0;
  state.gold = 0;
  state.policyPoints = ending.bonusPolicyPoints;
  state.tavernLevel = 0;
  state.hunterGuildLevel = 0;
  state.thiefGuildLevel = 0;
  state.merchantGuildLevel = 0;
  state.allBuildingsBuildable = true;
  state.inBattle = false;
  state.townPlace = "gate";
  state.activeMemberIndex = 0;
  state.activeActor = null;
  state.actionQueue = [];
  state.actedThisRound = [];
  state.preemptiveRoundPending = false;
  state.finalBossChainActive = false;
  state.ending = null;
  state.enemies = [];
  state.pendingDamageEffects = [];
  state.pendingSubstitutionEffects = [];
  state.items = createEmptyGrowthInventory();
  state.members = startingMembers.map((member) => resetMemberToLevelOne(member, true));
  state.reserveMembers = recruitableMembers.map((member) => resetMemberToLevelOne(member));

  normalizeAttackRanges(state.members);
  normalizeAttackRanges(state.reserveMembers);
  normalizeMpValues(state.members);
  normalizeMpValues(state.reserveMembers);
  normalizeCombatStats(state.members);
  normalizeCombatStats(state.reserveMembers);
  resetOpeningFormation();
  fullHeal();

  els.log.innerHTML = "";
  addLog(`クリア特典で最初からやり直した。初期内政Pは${state.policyPoints}。`);
  addLog("仲間はアルスとガロンの2人に戻り、建築はすべて最初から建築可能になった。");
  render();
}

function finishEventTurn() {
  if (state.inBattle || state.phase !== "event") return;

  resolveEvent();

  state.turn += 1;
  startPolicyTurn();
  render();
}

function startPolicyTurn() {
  state.phase = "policy";
  state.townPlace = "gate";
  fullHeal();

  const gainedPoints = totalPolicyPower();
  state.policyPoints += gainedPoints;
  addLog(`第${state.turn}ターン内政開始。内政Pが${gainedPoints}増えた。`);
}

function upgradeEquipment(kind, memberIndex) {
  const member = state.members[memberIndex];
  if (!member) return;

  const nextGrade = nextEquipmentGrade(member, kind);
  if (!nextGrade) {
    addLog(`${member.name}の${equipmentKindLabel(kind)}はこれ以上強化できない。`);
    render();
    return;
  }
  if (state.gold < nextGrade.price) {
    addLog("ゴールドが足りない。");
    render();
    return;
  }

  applyEquipmentUpgrade(member, kind);
  addLog(`${member.name}の${equipmentKindLabel(kind)}を${nextGrade.name}製に強化した。`);
  render();
}

function equipmentKindLabel(kind) {
  return kind === "weapon" ? "武器" : "防具";
}

function equipmentKeys(kind) {
  const gradeKey = kind === "weapon" ? "weaponGrade" : "armorGrade";
  const bonusKey = kind === "weapon" ? "weaponAtk" : "armorDef";
  const baseKey = kind === "weapon" ? "weaponBase" : "armorBase";
  const equipKey = kind;
  return { gradeKey, bonusKey, baseKey, equipKey };
}

function equipmentGrade(member, kind) {
  const { gradeKey } = equipmentKeys(kind);
  const grade = Number(member?.[gradeKey]);
  if (!Number.isFinite(grade)) return 0;
  return Math.max(0, Math.min(equipmentGrades.length - 1, Math.floor(grade)));
}

function nextEquipmentGrade(member, kind) {
  return equipmentGrades[equipmentGrade(member, kind) + 1] || null;
}

function applyEquipmentUpgrade(member, kind) {
  normalizeCombatStats([member]);

  const { gradeKey, bonusKey, baseKey, equipKey } = equipmentKeys(kind);
  const currentGrade = equipmentGrade(member, kind);
  const nextGrade = equipmentGrades[currentGrade + 1];
  if (!nextGrade || state.gold < nextGrade.price) return null;

  const nextBonus = kind === "weapon" ? nextGrade.atk : nextGrade.def;
  state.gold -= nextGrade.price;
  if (kind === "weapon") {
    member.atk = member.atk - member[bonusKey] + nextBonus;
  } else {
    member.pDef = member.pDef - member[bonusKey] + nextBonus;
    member.mDef = member.mDef - member[bonusKey] + nextBonus;
  }
  member[bonusKey] = nextBonus;
  member[gradeKey] = currentGrade + 1;
  member[equipKey] = `${nextGrade.name}の${member[baseKey]}`;

  return { member, kind, grade: nextGrade, price: nextGrade.price };
}

function bulkUpgradeKinds(scope) {
  return scope === "all" ? ["weapon", "armor"] : [scope];
}

function bulkUpgradeScopeLabel(scope) {
  if (scope === "weapon") return "武器一括";
  if (scope === "armor") return "防具一括";
  return "全装備一括";
}

function bulkEquipmentTargetGrade(kinds) {
  const upgradeableGrades = state.members.flatMap((member) =>
    kinds
      .map((kind) => equipmentGrade(member, kind))
      .filter((grade) => grade < equipmentGrades.length - 1)
  );
  if (upgradeableGrades.length === 0) return null;
  return Math.min(...upgradeableGrades) + 1;
}

function bulkEquipmentUpgradePlan(scope) {
  const kinds = bulkUpgradeKinds(scope);
  const targetGrade = bulkEquipmentTargetGrade(kinds);
  if (targetGrade === null) return { targetGrade: null, entries: [], totalCost: 0 };

  const entries = [];
  state.members.forEach((member) => {
    kinds.forEach((kind) => {
      if (equipmentGrade(member, kind) < targetGrade) {
        const nextGrade = nextEquipmentGrade(member, kind);
        if (nextGrade) entries.push({ member, kind, nextGrade });
      }
    });
  });
  const totalCost = entries.reduce((sum, entry) => sum + entry.nextGrade.price, 0);
  return { targetGrade, entries, totalCost };
}

function bulkUpgradeEquipment(scope) {
  const plan = bulkEquipmentUpgradePlan(scope);
  if (plan.targetGrade === null) {
    addLog(`${bulkUpgradeScopeLabel(scope)}できる装備はない。`);
    render();
    return;
  }

  const targetGrade = equipmentGrades[plan.targetGrade];
  const results = [];
  plan.entries.forEach(({ member, kind }) => {
    const result = applyEquipmentUpgrade(member, kind);
    if (result) results.push(result);
  });

  if (results.length === 0) {
    addLog(`${targetGrade.name}製への一括購入は、所持金が足りない。`);
    render();
    return;
  }

  const spent = results.reduce((sum, result) => sum + result.price, 0);
  const weapons = results.filter((result) => result.kind === "weapon").length;
  const armors = results.filter((result) => result.kind === "armor").length;
  const breakdown = [
    weapons > 0 ? `武器${weapons}人` : "",
    armors > 0 ? `防具${armors}人` : ""
  ].filter(Boolean).join("、");
  addLog(`${bulkUpgradeScopeLabel(scope)}で${targetGrade.name}製へ強化した。${breakdown}、${spent}G。`);
  render();
}

function fullHeal() {
  state.members.forEach((member) => {
    member.hp = member.maxHp;
    member.mp = member.maxMp;
    clearAllStatuses(member);
  });
}

function totalPolicyPower() {
  return state.members.reduce((sum, member) => sum + (member.policy || 0), 0);
}

function syncPartyFromFormation() {
  state.party = [...state.formation.front, ...state.formation.back];
  normalizeAttackRanges(state.party);
  normalizeMpValues(state.party);
  normalizeCombatStats(state.party);
}

function canPlaceInRow(member, row) {
  return member.positionType === "両方" || (row === "front" ? member.positionType === "前衛" : member.positionType === "後衛");
}

function getMemberRow(member) {
  if (state.formation.front.includes(member)) return "front";
  if (state.formation.back.includes(member)) return "back";
  return null;
}

function takeRandomMembers(members, count) {
  const pool = [...members];
  const selected = [];
  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}

function rowLabel(row) {
  return row === "front" ? "前衛" : "後衛";
}

function rowSubstitutionCandidates(row) {
  return state.members.filter((member) =>
    !getMemberRow(member)
      && member.hp > 0
      && canPlaceInRow(member, row)
  );
}

function autoSubstituteDefeatedMembersInRow(row) {
  if (!state.inBattle) return 0;

  const defeatedMembers = state.formation[row].filter((member) => member.hp <= 0);
  if (defeatedMembers.length === 0) return 0;

  const candidates = rowSubstitutionCandidates(row);
  if (candidates.length === 0) return 0;

  const replacements = takeRandomMembers(
    candidates,
    Math.min(defeatedMembers.length, candidates.length)
  );
  const pairs = [];
  let replacementIndex = 0;
  state.formation[row] = state.formation[row].map((member) => {
    if (member.hp > 0 || replacementIndex >= replacements.length) return member;
    const replacement = replacements[replacementIndex];
    replacementIndex += 1;
    pairs.push({ defeated: member, replacement });
    return replacement;
  });
  syncPartyFromFormation();
  state.pendingSubstitutionEffects.push(...pairs);
  pairs.forEach(({ defeated, replacement }) => {
    addLog(`${defeated.name}が倒れたため、控えの${replacement.name}が${rowLabel(row)}に入った。`);
  });
  return pairs.length;
}

function autoSubstituteDefeatedPartyMembers() {
  return autoSubstituteDefeatedMembersInRow("front")
    + autoSubstituteDefeatedMembersInRow("back");
}

function attackRange(actor) {
  const range = Number(actor?.range);
  return Number.isFinite(range) ? range : defaultAttackRange(actor);
}

function defaultAttackRange(actor) {
  if (!actor) return 1;
  if (actor.name === "天塔竜") return 3;

  const templates = characterTemplates();
  const template = templates.find((entry) => entry.name === actor.name)
    || templates.find((entry) => entry.job && entry.job === actor.job);
  return Number(template?.range) || 1;
}

function defaultMaxMp(actor) {
  if (!actor) return 0;
  if (actor.name === "天塔竜") return 16;

  const templates = characterTemplates();
  const template = templates.find((entry) => entry.name === actor.name)
    || templates.find((entry) => entry.job && entry.job === actor.job);
  return Math.max(0, Number(template?.maxMp ?? template?.mp ?? 0) || 0);
}

function characterTemplates() {
  return [
    ...startingMembers,
    ...recruitableMembers,
    ...tavernExpansionMembers,
    ...tavernSecondExpansionMembers,
    ...hunterGuildMembers,
    ...thiefGuildMembers,
    ...merchantGuildMembers,
    ...monsters,
    ...TOWER_BOSSES
  ];
}

function actorTemplate(actor) {
  if (!actor) return null;
  const templates = characterTemplates();
  return templates.find((entry) => entry.name === actor.name)
    || templates.find((entry) => entry.job && entry.job === actor.job)
    || null;
}

function defaultAttackType(actor) {
  if (actor?.name === "天塔竜") return "both";
  return actorTemplate(actor)?.attackType || "physical";
}

function defaultDefenseValue(actor, key) {
  if (!actor) return 0;
  if (Number.isFinite(Number(actor[key]))) return Math.max(0, Number(actor[key]));
  if (actor.name === "天塔竜") return key === "pDef" ? 10 : 12;
  if (Number.isFinite(Number(actor.def))) return Math.max(0, Number(actor.def));
  const template = actorTemplate(actor);
  return Math.max(0, Number(template?.[key] ?? template?.def ?? actor.def ?? 0) || 0);
}

function normalizeAttackRanges(actors) {
  actors.forEach((actor) => {
    if (!Number.isFinite(Number(actor.range))) {
      actor.range = defaultAttackRange(actor);
    }
  });
}

function normalizeMpValues(actors) {
  actors.forEach((actor) => {
    if (!Number.isFinite(Number(actor.maxMp))) {
      actor.maxMp = defaultMaxMp(actor);
    }
    if (!Number.isFinite(Number(actor.mp))) {
      actor.mp = actor.maxMp;
    }
  });
}

function normalizeCombatStats(actors) {
  actors.forEach((actor) => {
    if (!actor) return;
    normalizeStatusEffects(actor);
    if (!["physical", "magic", "both"].includes(actor.attackType)) {
      actor.attackType = defaultAttackType(actor);
    }
    if (!Number.isFinite(Number(actor.pDef))) {
      actor.pDef = defaultDefenseValue(actor, "pDef");
    }
    if (!Number.isFinite(Number(actor.mDef))) {
      actor.mDef = defaultDefenseValue(actor, "mDef");
    }
    if (!actor.normalAttackPattern) {
      actor.normalAttackPattern = ["ノルン", "オルド", "ロビン", "シルヴァ"].includes(actor.name) ? "pierce-column" : "single";
    }
    if (!actor.spellPattern) {
      actor.spellPattern = actor.name === "スプーン"
        ? "row"
        : actor.name === "メモリ"
        ? "pierce-column"
        : actor.name === "ルキア"
        ? "all"
        : "single";
    }
    if (!actor.spellName) {
      if (actor.name === "スプーン") actor.spellName = "フレイム";
      if (actor.name === "メモリ") actor.spellName = "ファイア";
      if (actor.name === "ルキア") actor.spellName = "メティオ";
    }
    if (actor.name === "ルキア") {
      actor.spellPattern = "all";
      actor.spellName = "メティオ";
    }
  });
}

function attackTypeLabel(actor) {
  normalizeCombatStats([actor]);
  return ATTACK_TYPE_LABELS[actor.attackType] || ATTACK_TYPE_LABELS.physical;
}

function jobShortLabel(member) {
  return JOB_SHORT_LABELS[member?.job] || String(member?.job || "?").slice(0, 1);
}

function renderMemberMeta(member, details) {
  return `
    <span class="member-meta">
      <span class="member-job-symbol">${jobShortLabel(member)}</span>
      <span>${details}</span>
    </span>
  `;
}

function normalizeStatusEffects(actor) {
  if (!actor) return {};
  if (!actor.statusEffects || typeof actor.statusEffects !== "object" || Array.isArray(actor.statusEffects)) {
    actor.statusEffects = {};
  }

  Object.keys(actor.statusEffects).forEach((key) => {
    if (!STATUS_EFFECTS[key]) {
      delete actor.statusEffects[key];
    }
  });

  if (actor.statusEffects.paralysis) {
    const turns = Number(actor.statusEffects.paralysis.turns);
    actor.statusEffects.paralysis = {
      turns: Number.isFinite(turns) && turns > 0
        ? Math.ceil(turns)
        : STATUS_EFFECTS.paralysis.duration
    };
  }

  return actor.statusEffects;
}

function activeStatusKeys(actor) {
  const statusEffects = normalizeStatusEffects(actor);
  return Object.keys(STATUS_EFFECTS).filter((key) => Boolean(statusEffects[key]));
}

function hasStatus(actor, status) {
  return Boolean(normalizeStatusEffects(actor)[status]);
}

function statusLabel(status, actor = null) {
  const label = STATUS_EFFECTS[status]?.label || status;
  if (status !== "paralysis" || !actor) return label;
  const turns = normalizeStatusEffects(actor).paralysis?.turns;
  return Number.isFinite(turns) ? `${label}${turns}` : label;
}

function statusSummary(actor) {
  const labels = activeStatusKeys(actor).map((status) => statusLabel(status, actor));
  return labels.length > 0 ? labels.join("・") : "なし";
}

function renderStatusBadges(actor) {
  const badges = activeStatusKeys(actor)
    .map((status) => `<span class="status-badge status-${status}">${statusLabel(status, actor)}</span>`)
    .join("");
  return badges ? `<div class="status-badges">${badges}</div>` : "";
}

function clearStatus(actor, status, shouldLog = false) {
  const statusEffects = normalizeStatusEffects(actor);
  if (!statusEffects[status]) return false;
  delete statusEffects[status];
  if (shouldLog) {
    addLog(`${actor.name}の${STATUS_EFFECTS[status].label}が治った。`);
  }
  return true;
}

function clearAllStatuses(actor) {
  if (!actor) return;
  actor.statusEffects = {};
}

function clearBattleStatuses() {
  [...state.members, ...state.enemies].forEach(clearAllStatuses);
}

function clearStatusesOnHeal(actor) {
  activeStatusKeys(actor).forEach((status) => {
    if (STATUS_EFFECTS[status].clearsOnHeal) {
      clearStatus(actor, status, true);
    }
  });
}

function applyStatus(actor, status) {
  if (!actor || actor.hp <= 0 || !STATUS_EFFECTS[status]) return false;
  const statusEffects = normalizeStatusEffects(actor);

  if (status === "poison" && statusEffects.venom) return false;
  if (status === "venom") clearStatus(actor, "poison");

  const alreadyHadStatus = Boolean(statusEffects[status]);
  statusEffects[status] = status === "paralysis"
    ? { turns: STATUS_EFFECTS.paralysis.duration }
    : true;

  if (!alreadyHadStatus) {
    addLog(`${actor.name}は${STATUS_EFFECTS[status].label}になった。`);
  }
  return true;
}

function statusAttackForActor(actor) {
  return actor?.statusAttack || STATUS_ATTACKS[actor?.name] || null;
}

function tryApplyAttackStatus(attacker, defender) {
  const statusAttack = statusAttackForActor(attacker);
  if (!statusAttack || !defender || defender.hp <= 0) return;
  const chance = GUARANTEED_STATUS_TARGETS.includes(defender.name) ? 1 : statusAttack.chance;
  if (Math.random() >= chance) return;
  applyStatus(defender, statusAttack.status);
}

function healActor(actor, amount) {
  if (!actor || actor.hp <= 0 || amount <= 0) return 0;
  const previousHp = actor.hp;
  actor.hp = Math.min(actor.maxHp, actor.hp + amount);
  const healed = actor.hp - previousHp;
  if (healed > 0) {
    clearStatusesOnHeal(actor);
  }
  return healed;
}

function turnStartStatusDamage(actor) {
  const status = hasStatus(actor, "venom")
    ? "venom"
    : hasStatus(actor, "poison")
    ? "poison"
    : null;
  if (!status) return;

  const damage = Math.max(1, Math.floor(actor.maxHp * STATUS_EFFECTS[status].damageRate));
  dealDamage(actor, damage);
  addLog(`${actor.name}は${STATUS_EFFECTS[status].label}で${damage}ダメージ。`);
  if (state.members.includes(actor)) {
    autoSubstituteDefeatedPartyMembers();
  }
}

function skipActorForStatus(actor) {
  const blockingStatuses = ["stun", "paralysis", "sleep"].filter((status) => hasStatus(actor, status));
  if (blockingStatuses.length === 0) return false;

  const labels = blockingStatuses.map((status) => STATUS_EFFECTS[status].label).join("・");
  addLog(`${actor.name}は${labels}で動けない。`);

  if (hasStatus(actor, "stun")) {
    clearStatus(actor, "stun", true);
  }
  if (hasStatus(actor, "paralysis")) {
    const paralysis = normalizeStatusEffects(actor).paralysis;
    paralysis.turns -= 1;
    if (paralysis.turns <= 0) {
      clearStatus(actor, "paralysis", true);
    }
  }

  return true;
}

function processActorTurnStart(actor) {
  turnStartStatusDamage(actor);
  if (actor.hp <= 0) return false;
  return !skipActorForStatus(actor);
}

function livingActorsInRow(actors, row, rowOf) {
  return actors.filter((actor) => actor.hp > 0 && rowOf(actor) === row);
}

function livingPartyMembersInRow(row) {
  return state.formation[row].filter((member) => member.hp > 0);
}

function memberColumn(member) {
  const row = getMemberRow(member);
  return row ? state.formation[row].indexOf(member) : -1;
}

function canTargetByRange(attacker, attackerRow, target, defenders, rowOfTarget) {
  const range = attackRange(attacker);
  if (range >= 3) return true;

  const targetRow = rowOfTarget(target) || "front";
  const hasFrontDefender = livingActorsInRow(defenders, "front", rowOfTarget).length > 0;

  if (range <= 1) {
    return attackerRow === "front" && (targetRow === "front" || !hasFrontDefender);
  }

  if (attackerRow === "front") return true;
  return targetRow === "front" || !hasFrontDefender;
}

function reachableTargets(attacker, attackerRow, defenders, rowOfTarget) {
  return defenders.filter((target) =>
    target.hp > 0 && canTargetByRange(attacker, attackerRow, target, defenders, rowOfTarget)
  );
}

function rowOfEnemy(enemy) {
  return enemy.row || "front";
}

function moveEnemyBackRowToFrontIfFrontCleared() {
  if (!state.inBattle) return 0;

  const hasLivingFrontEnemy = state.enemies.some((enemy) =>
    enemy.hp > 0 && rowOfEnemy(enemy) === "front"
  );
  if (hasLivingFrontEnemy) return 0;

  const movingEnemies = state.enemies.filter((enemy) =>
    enemy.hp > 0 && rowOfEnemy(enemy) === "back"
  );
  if (movingEnemies.length === 0) return 0;

  movingEnemies.forEach((enemy) => {
    if (!Number.isFinite(Number(enemy.column))) {
      enemy.column = enemyColumn(enemy);
    }
    enemy.row = "front";
  });
  addLog("敵の後列が前列へ出てきた。");
  return movingEnemies.length;
}

function enemyColumn(enemy) {
  const column = Number(enemy?.column);
  if (Number.isFinite(column)) {
    return Math.max(0, Math.min(MAX_ROW_SIZE - 1, Math.floor(column)));
  }

  const row = rowOfEnemy(enemy);
  return state.enemies
    .filter((entry) => rowOfEnemy(entry) === row)
    .indexOf(enemy);
}

function normalAttackPattern(member) {
  if (["ノルン", "オルド", "ロビン", "シルヴァ"].includes(member?.name)) return "pierce-column";
  return member?.normalAttackPattern || "single";
}

function normalAttackLabel(member) {
  return normalAttackPattern(member) === "pierce-column" ? "貫通" : "攻撃";
}

function normalAttackTargets(member, primaryTarget) {
  if (!primaryTarget || primaryTarget.hp <= 0) return [];
  if (normalAttackPattern(member) !== "pierce-column") return [primaryTarget];

  return livingEnemiesInColumn(primaryTarget);
}

function canUseBowPierce(member) {
  return member?.name === "ヒビノ";
}

function bowPierceTargets(primaryTarget) {
  if (!primaryTarget || primaryTarget.hp <= 0) return [];
  return livingEnemiesInColumn(primaryTarget);
}

function canUseArrowRain(member) {
  return member?.name === "キリカ" || member?.name === "シルヴァ";
}

function arrowRainTargets() {
  return state.enemies.filter((enemy) => enemy.hp > 0);
}

function canUseInstantDeath(actor) {
  return actor?.job === "忍者" || actor?.name === "忍者";
}

function instantDeathChance(attacker, target) {
  if (GUARANTEED_STATUS_TARGETS.includes(target?.name)) return 1;
  if (target?.isBoss) return 0;
  return attacker?.name === "忍者" ? ENEMY_INSTANT_DEATH_CHANCE : PARTY_INSTANT_DEATH_CHANCE;
}

function performInstantDeathAttack(attacker, target) {
  const chance = instantDeathChance(attacker, target);
  if (chance > 0 && Math.random() < chance) {
    const damage = target.hp;
    dealDamage(target, damage);
    return { killed: true, bossImmune: false, damage };
  }

  const damage = calculateDamage(attacker.atk, target, attacker);
  dealDamage(target, damage);
  return { killed: false, bossImmune: target?.isBoss && chance === 0, damage };
}

function instantDeathResultText(target, result) {
  if (result.killed) return `${target.name}を一撃で倒した`;
  if (result.bossImmune) return `${target.name}には即死が効かず、${result.damage}ダメージ`;
  return `${target.name}には決まらず、${result.damage}ダメージ`;
}

function livingEnemiesInColumn(primaryTarget) {
  const column = enemyColumn(primaryTarget);
  return state.enemies.filter((enemy) =>
    enemy.hp > 0 && enemyColumn(enemy) === column
  );
}

function livingPartyMembersInColumn(primaryTarget) {
  const row = getMemberRow(primaryTarget);
  const column = memberColumn(primaryTarget);
  if (!row || column < 0) return [];
  if (row === "back") return [primaryTarget].filter((member) => member.hp > 0);

  return [state.formation.front[column], state.formation.back[column]]
    .filter((member) => member && member.hp > 0);
}

function spellPattern(member) {
  return member?.spellPattern || "single";
}

function spellName(member) {
  return member?.spellName || "ファイア";
}

function spellButtonLabel(member) {
  return member?.spellName || "魔法";
}

function healApCost(member) {
  if (member?.name === "エルマ") return 0;
  if (member?.name === "セラ") return 2;
  return HEAL_AP_COST;
}

function healAmount(member) {
  return member?.name === "エルマ"
    ? Math.max(1, Number(member.atk) || 0)
    : 18 + Number(member.atk) * 3;
}

function isGroupHeal(member) {
  return member?.name === "セラ";
}

function spellTargets(member, primaryTarget) {
  if (!primaryTarget || primaryTarget.hp <= 0) return [];
  if (spellPattern(member) === "all") return state.enemies.filter((enemy) => enemy.hp > 0);
  if (spellPattern(member) === "pierce-column") return livingEnemiesInColumn(primaryTarget);
  if (spellPattern(member) !== "row") return [primaryTarget];

  const row = rowOfEnemy(primaryTarget);
  return state.enemies.filter((enemy) =>
    enemy.hp > 0 && rowOfEnemy(enemy) === row
  );
}

function activePartyReachableEnemies(member) {
  return reachableTargets(member, getMemberRow(member), state.enemies, rowOfEnemy);
}

function placeMemberInFormation(member) {
  const preferredRows = member.positionType === "後衛" ? ["back"] : member.positionType === "前衛" ? ["front"] : ["front", "back"];
  for (const row of preferredRows) {
    if (state.formation[row].length < MAX_ROW_SIZE) {
      state.formation[row].push(member);
      syncPartyFromFormation();
      return row;
    }
  }
  return null;
}

function startBattle(isBoss) {
  state.inBattle = true;
  state.finalBossChainActive = false;
  if (els.statusDialog.open) els.statusDialog.close();
  state.enemies = createEnemies(isBoss);
  state.pendingDamageEffects = [];
  state.pendingSubstitutionEffects = [];
  state.actedThisRound = [];
  state.preemptiveRoundPending = Math.random() < preemptiveAttackRate();
  addLog(isBoss ? `${state.enemies[0]?.name || "最上階の主"}が立ちはだかった！` : "魔物があらわれた！");
  if (state.preemptiveRoundPending) {
    addLog("先制攻撃！ 初回ラウンドは敵が動けない。");
  }
  autoSubstituteDefeatedPartyMembers();
  startActionRound();
  advanceBattleTurn();
  render();
}

function createEnemies(isBoss) {
  const rows = enemyRowsForCurrentTower();
  if (isBoss) {
    return [makeEnemy(towerBoss(), "front", true, 0)];
  }

  const maxEnemies = rows.length * MAX_ROW_SIZE;
  const maxRoll = rows.length > 1 ? maxEnemies : (currentTotalFloor() > 12 ? 3 : 2);
  const count = Math.min(maxEnemies, 1 + Math.floor(Math.random() * maxRoll));
  return Array.from({ length: count }, (_, enemySlot) => {
    const index = Math.min(monsters.length - 1, Math.floor(currentTotalFloor() / 10) + Math.floor(Math.random() * 2));
    const row = rows[Math.min(rows.length - 1, Math.floor(enemySlot / MAX_ROW_SIZE))] || "front";
    return makeEnemy(monsters[index], row, false, enemySlot % MAX_ROW_SIZE);
  });
}

function createDarkPigFinalBattleEnemies() {
  const boss = makeEnemy({
    name: "闇豚らんらん",
    attackType: "both",
    range: 3,
    hp: 2250,
    mp: 24,
    atk: 168,
    pDef: 54,
    mDef: 48,
    agi: 36,
    exp: 2600,
    gold: 4200,
    statusAttack: { status: "venom", chance: 0.50 }
  }, "back", true, 0);
  const guards = Array.from({ length: 5 }, (_, index) => makeEnemy({
    name: "ダークピッグ",
    attackType: "both",
    range: 2,
    hp: 155,
    mp: 16,
    atk: 130,
    pDef: 22,
    mDef: 20,
    agi: 10,
    exp: 310,
    gold: 520,
    statusAttack: { status: "venom", chance: 0.2 }
  }, index < 3 ? "front" : "back", false, index < 3 ? index : index - 2));
  return [boss, ...guards];
}

function startDarkPigFinalBattle() {
  state.finalBossChainActive = true;
  state.inBattle = true;
  state.activeActor = null;
  state.actionQueue = [];
  state.actedThisRound = [];
  state.pendingDamageEffects = [];
  state.pendingSubstitutionEffects = [];
  state.preemptiveRoundPending = false;
  state.enemies = createDarkPigFinalBattleEnemies();
  addLog("天塔竜が崩れ落ちた。だが、塔の闇はまだ晴れない。");
  addLog("闇豚らんらんがダークピッグ5体を連れて現れた！");
  autoSubstituteDefeatedPartyMembers();
  startActionRound();
  advanceBattleTurn();
  render();
}

function enemyRowsForCurrentTower() {
  return currentTower().enemyRows || ["front", "back"];
}

function makeEnemy(template, row = "front", isBoss = false, column = 0) {
  const scale = 1 + Math.floor(currentTotalFloor() / 8) * 0.18;
  const maxHp = Math.round(template.hp * scale);
  const maxMp = Math.max(0, Math.round(Number(template.mp || template.maxMp || 0) * scale));
  return {
    ...template,
    isBoss,
    row,
    column,
    range: attackRange(template),
    attackType: template.attackType || defaultAttackType(template),
    maxHp,
    hp: maxHp,
    maxMp,
    mp: maxMp,
    atk: Math.round(template.atk * scale),
    pDef: Math.round(defaultDefenseValue(template, "pDef") * scale),
    mDef: Math.round(defaultDefenseValue(template, "mDef") * scale),
    agi: Math.max(1, Math.round(template.agi * scale))
  };
}

function performAction(kind, targetIndex) {
  if (!state.inBattle || state.activeActor?.type !== "party") return;

  const member = state.activeActor.actor;
  if (!member || member.hp <= 0) return;

  const reachableEnemies = activePartyReachableEnemies(member);
  const enemyTarget = Number.isInteger(targetIndex)
    ? state.enemies[targetIndex]
    : reachableEnemies[0];
  if ((kind === "attack" || kind === "spell" || kind === "bow-pierce" || kind === "arrow-rain" || kind === "instant-death") && (!enemyTarget || enemyTarget.hp <= 0)) {
    addLog("攻撃する相手を選べない。");
    render();
    return;
  }
  if ((kind === "attack" || kind === "spell" || kind === "bow-pierce" || kind === "instant-death") && !reachableEnemies.includes(enemyTarget)) {
    addLog(`${member.name}の射程では届かない。`);
    render();
    return;
  }
  const allyTarget = kind === "heal"
    ? Number.isInteger(targetIndex)
      ? state.members[targetIndex]
      : mostWoundedAlly()
    : null;
  const allyTargets = kind === "heal" && isGroupHeal(member)
    ? state.party.filter((target) => target.hp > 0)
    : allyTarget
    ? [allyTarget]
    : [];
  if (kind === "heal" && (
    allyTargets.length === 0
      || allyTargets.some((target) => !state.party.includes(target) || target.hp <= 0)
  )) {
    addLog("回復する相手を選べない。");
    render();
    return;
  }

  if (kind === "wait") {
    addLog(`${member.name}は待機した。`);
  }

  if (kind === "attack") {
    const targets = normalAttackTargets(member, enemyTarget);
    const results = targets.map((target) => {
      const damage = calculateDamage(member.atk, target, member);
      dealDamage(target, damage);
      return `${target.name}に${damage}ダメージ`;
    });
    spendAttackMp(member);
    const attackLabel = normalAttackLabel(member);
    addLog(`${member.name}の${attackLabel}。${results.join("、")}。`);
    targets.forEach((target) => tryApplyAttackStatus(member, target));
  }

  if (kind === "bow-pierce") {
    if (!canUseBowPierce(member)) {
      addLog(`${member.name}は弓貫通を使えない。`);
      render();
      return;
    } else if (member.mp < ASH_BOW_PIERCE_AP_COST) {
      addLog(`${member.name}はAPが足りない。`);
      render();
      return;
    } else {
      const targets = bowPierceTargets(enemyTarget);
      const results = targets.map((target) => {
        const damage = calculateDamage(member.atk * 2, target, member);
        dealDamage(target, damage);
        return `${target.name}に${damage}ダメージ`;
      });
      member.mp -= ASH_BOW_PIERCE_AP_COST;
      addLog(`${member.name}の弓貫通。${results.join("、")}。`);
    }
  }

  if (kind === "arrow-rain") {
    if (!canUseArrowRain(member)) {
      addLog(`${member.name}はアローレインを使えない。`);
      render();
      return;
    } else if (member.mp < KIRIKA_ARROW_RAIN_AP_COST) {
      addLog(`${member.name}はAPが足りない。`);
      render();
      return;
    } else {
      const targets = arrowRainTargets();
      const results = targets.map((target) => {
        const damage = calculateDamage(member.atk, target, member);
        dealDamage(target, damage);
        return `${target.name}に${damage}ダメージ`;
      });
      member.mp -= KIRIKA_ARROW_RAIN_AP_COST;
      addLog(`${member.name}のアローレイン。${results.join("、")}。`);
    }
  }

  if (kind === "instant-death") {
    if (!canUseInstantDeath(member)) {
      addLog(`${member.name}は即死攻撃を使えない。`);
      render();
      return;
    } else if (member.mp < INSTANT_DEATH_AP_COST) {
      addLog(`${member.name}はAPが足りない。`);
      render();
      return;
    } else {
      member.mp -= INSTANT_DEATH_AP_COST;
      const result = performInstantDeathAttack(member, enemyTarget);
      addLog(`${member.name}の即死攻撃。${instantDeathResultText(enemyTarget, result)}。`);
    }
  }

  if (kind === "heal") {
    const cost = healApCost(member);
    if (member.mp < cost) {
      addLog(`${member.name}はAPが足りない。`);
      render();
      return;
    } else {
      member.mp -= cost;
      const amount = healAmount(member);
      const healedResults = allyTargets.map((target) => ({
        target,
        healed: healActor(target, amount)
      }));
      if (isGroupHeal(member)) {
        const totalHealed = healedResults.reduce((sum, result) => sum + result.healed, 0);
        addLog(`${member.name}は全体ヒールを唱えた。全員のHPが合計${totalHealed}回復。`);
      } else {
        addLog(`${member.name}はヒールを唱えた。${allyTarget.name}のHPが${healedResults[0].healed}回復。`);
      }
    }
  }

  if (kind === "spell") {
    if (member.mp < OFFENSIVE_SPELL_AP_COST) {
      addLog(`${member.name}はAPが足りない。`);
      render();
      return;
    } else {
      const targets = spellTargets(member, enemyTarget);
      const results = targets.map((target) => {
        const damage = calculateDamage((member.atk * 3) >> 1, target, member, "magic");
        dealDamage(target, damage);
        return `${target.name}に${damage}ダメージ`;
      });
      member.mp -= OFFENSIVE_SPELL_AP_COST;
      addLog(`${member.name}は${spellName(member)}を唱えた。${results.join("、")}。`);
    }
  }

  if (allEnemiesDefeated()) {
    winBattle();
    return;
  }

  markActorActed(state.activeActor);
  advanceBattleTurn();
  render();
}

function startActionRound() {
  const skipEnemies = state.preemptiveRoundPending;
  state.actedThisRound = [];
  state.actionQueue = [
    ...state.party.filter((member) => member.hp > 0).map((member) => makeActionEntry("party", member)),
    ...(skipEnemies ? [] : state.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => makeActionEntry("enemy", enemy)))
  ].sort((a, b) => b.order - a.order);
  addLog(skipEnemies ? "先制攻撃の行動順が決まった。" : "敏捷順の行動順が決まった。");
  state.preemptiveRoundPending = false;
}

function makeActionEntry(type, actor) {
  return {
    type,
    actor,
    order: actor.agi * (0.8 + Math.random() * 0.4)
  };
}

function advanceBattleTurn() {
  while (state.inBattle) {
    if (allEnemiesDefeated()) {
      winBattle();
      return;
    }
    moveEnemyBackRowToFrontIfFrontCleared();
    autoSubstituteDefeatedPartyMembers();
    if (state.party.every((member) => member.hp <= 0)) {
      loseBattle();
      return;
    }
    if (state.actionQueue.length === 0) {
      startActionRound();
    }

    const entry = state.actionQueue.shift();
    if (!entry || !canActorAct(entry)) continue;
    if (!processActorTurnStart(entry.actor)) {
      markActorActed(entry);
      continue;
    }

    state.activeActor = entry;
    if (entry.type === "party") {
      state.activeMemberIndex = state.party.indexOf(entry.actor);
      return;
    }

    enemyAct(entry.actor);
    markActorActed(entry);
  }
}

function canActorAct(entry) {
  if (entry.actor.hp <= 0) return false;
  if (entry.type === "party") return state.party.includes(entry.actor);
  return state.enemies.includes(entry.actor);
}

function bossMultiAttackKind(enemy) {
  if (!enemy.isBoss) return null;
  if (enemy.name === "闇豚らんらん") {
    return Math.random() < DARK_PIG_RANRAN_ALL_ATTACK_RATE ? "all" : null;
  }
  if (Math.random() >= BOSS_MULTI_ATTACK_RATE) return null;
  if (BOSS_PIERCE_ATTACKERS.includes(enemy.name)) return "pierce";
  if (BOSS_ROW_ATTACKERS.includes(enemy.name)) return "row";
  if (BOSS_ALL_ATTACKERS.includes(enemy.name)) return "all";
  return null;
}

function bossMultiAttackTargets(enemy, primaryTarget, kind) {
  if (kind === "pierce") {
    return livingPartyMembersInColumn(primaryTarget);
  }
  if (kind === "row") {
    const rows = ["front", "back"].filter((row) => livingPartyMembersInRow(row).length > 0);
    const row = rows[Math.floor(Math.random() * rows.length)];
    return row ? livingPartyMembersInRow(row) : [];
  }
  if (kind === "all") {
    return state.party.filter((member) => member.hp > 0);
  }
  return [];
}

function bossMultiAttackLabel(kind) {
  if (kind === "pierce") return "貫通攻撃";
  if (kind === "row") return "列攻撃";
  if (kind === "all") return "全体攻撃";
  return "攻撃";
}

function dealEnemyAttackToTargets(enemy, targets, damageMultiplier = 1) {
  const results = targets.map((target) => {
    const baseDamage = calculateDamage(enemy.atk, target, enemy);
    const damage = Math.max(1, Math.floor(baseDamage * damageMultiplier));
    dealDamage(target, damage);
    return `${target.name}に${damage}ダメージ`;
  });
  spendAttackMp(enemy);
  return results;
}

function tryBossMultiAttack(enemy, primaryTarget) {
  const kind = bossMultiAttackKind(enemy);
  if (!kind) return false;

  const targets = bossMultiAttackTargets(enemy, primaryTarget, kind);
  if (targets.length === 0) return false;

  const damageMultiplier = kind === "all" ? 0.5 : 1;
  const results = dealEnemyAttackToTargets(enemy, targets, damageMultiplier);
  addLog(`${enemy.name}の${bossMultiAttackLabel(kind)}。${results.join("、")}。`);
  targets.forEach((target) => tryApplyAttackStatus(enemy, target));
  autoSubstituteDefeatedPartyMembers();
  return true;
}

function enemyAct(enemy) {
  const targets = reachableTargets(enemy, rowOfEnemy(enemy), state.party, getMemberRow);
  if (targets.length === 0) {
    addLog(`${enemy.name}は射程内に攻撃できる相手がいない。`);
    return;
  }

  const target = targets[Math.floor(Math.random() * targets.length)];
  if (tryBossMultiAttack(enemy, target)) return;

  if (
    canUseInstantDeath(enemy)
      && enemy.mp >= INSTANT_DEATH_AP_COST
      && Math.random() < ENEMY_INSTANT_DEATH_USE_RATE
  ) {
    enemy.mp -= INSTANT_DEATH_AP_COST;
    const result = performInstantDeathAttack(enemy, target);
    addLog(`${enemy.name}の即死攻撃。${instantDeathResultText(target, result)}。`);
    autoSubstituteDefeatedPartyMembers();
    return;
  }

  const damage = calculateDamage(enemy.atk, target, enemy);
  spendAttackMp(enemy);
  dealDamage(target, damage);
  addLog(`${enemy.name}の攻撃。${target.name}に${damage}ダメージ。`);
  tryApplyAttackStatus(enemy, target);
  autoSubstituteDefeatedPartyMembers();
}

function spendAttackMp(actor) {
  if (!Number.isFinite(Number(actor?.mp)) || actor.mp <= 0) return;
  actor.mp = Math.max(0, actor.mp - 1);
}

function isMpDepleted(actor) {
  return Number.isFinite(Number(actor?.mp)) && actor.mp <= 0;
}

function applyDamageModifiers(damage, attacker, defender) {
  let modifiedDamage = Math.max(1, Math.floor(damage));
  if (isMpDepleted(attacker)) {
    modifiedDamage = Math.max(1, Math.floor(modifiedDamage / 3));
  }
  if (isMpDepleted(defender)) {
    modifiedDamage *= 10;
  }
  return modifiedDamage;
}

function defenseForAttack(attacker, defender, forcedAttackType = null) {
  normalizeCombatStats([attacker, defender]);
  const attackType = forcedAttackType || attacker.attackType;
  if (attackType === "magic") return defender.mDef;
  if (attackType === "both") return Math.min(defender.pDef, defender.mDef);
  return defender.pDef;
}

function calculateDamage(atk, defender, attacker, forcedAttackType = null) {
  const def = defenseForAttack(attacker, defender, forcedAttackType);
  const baseDamage = Math.max(1, atk - Math.floor(def / 2) + Math.floor(Math.random() * 5));
  return applyDamageModifiers(baseDamage, attacker, defender);
}

function dealDamage(target, damage) {
  const previousHp = target.hp;
  target.hp = Math.max(0, target.hp - damage);
  if (target.hp > 0 && target.hp < previousHp) {
    clearStatus(target, "sleep", true);
  }
  queueDamageEffect(target, damage);
}

function queueDamageEffect(target, damage) {
  if (!target || damage <= 0) return;

  const partyIndex = memberIndex(target);
  if (partyIndex >= 0) {
    state.pendingDamageEffects.push({ side: "party", index: partyIndex, amount: damage });
    return;
  }

  const enemyIndex = state.enemies.indexOf(target);
  if (enemyIndex >= 0) {
    state.pendingDamageEffects.push({ side: "enemy", index: enemyIndex, amount: damage });
  }
}

function nextLivingPartyIndex(start) {
  for (let offset = 0; offset < state.party.length; offset += 1) {
    const index = (start + offset) % state.party.length;
    if (state.party[index].hp > 0) return index;
  }
  return -1;
}

function mostWoundedAlly() {
  return state.party
    .filter((member) => member.hp > 0)
    .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
}

function allEnemiesDefeated() {
  return state.enemies.every((enemy) => enemy.hp <= 0);
}

function isDarkPigFinalBattleVictory() {
  return state.finalBossChainActive
    && state.enemies.some((enemy) => enemy.name === "闇豚らんらん");
}

function winBattle() {
  const exp = state.enemies.reduce((sum, enemy) => sum + enemy.exp, 0);
  const gold = state.enemies.reduce((sum, enemy) => sum + enemy.gold, 0);
  const droppedItems = rollGrowthItemDrops(state.enemies);
  const battleTotalFloor = currentTotalFloor();
  const clearsDarkPigFinalBattle = isDarkPigFinalBattleVictory();
  const startsDarkPigFinalBattle = isFinalTowerFloor()
    && state.clearedFloor < battleTotalFloor
    && !state.finalBossChainActive
    && state.enemies.some((enemy) => enemy.name === "天塔竜" || enemy.name === "天空竜");
  const isTowerFirstClear = !startsDarkPigFinalBattle
    && state.floor === currentTower().floors
    && state.clearedFloor < battleTotalFloor;
  const towerClearAnnouncement = isTowerFirstClear
    ? isFinalTowerFloor()
      ? `【完全打開】${currentTower().name}を打開！ 十の塔を包む闇がほどけた。`
      : `【塔打開】${currentTower().name}を打開！ 次の塔への道が開いた。`
    : "";
  state.gold += gold;
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.actedThisRound = [];
  state.preemptiveRoundPending = false;
  clearBattleStatuses();
  state.enemies = [];
  if (!startsDarkPigFinalBattle) {
    state.clearedFloor = Math.max(state.clearedFloor, battleTotalFloor);
  }

  addLog(`勝利！ 経験値${exp}、${gold}Gを手に入れた。`);
  droppedItems.forEach((itemKey) => {
    addLog(`${GROWTH_ITEMS[itemKey].name}を手に入れた。`);
  });
  awardBattleExperience(exp);
  if (startsDarkPigFinalBattle) {
    startDarkPigFinalBattle();
    return;
  }
  if (clearsDarkPigFinalBattle) {
    completeGame();
    return;
  }
  state.finalBossChainActive = false;
  if (isTowerFirstClear) {
    awardTowerFirstClearReward(state.towerIndex);
  }

  if (isFinalTowerFloor()) {
    addLog(`${currentTower().name}を踏破した。すべての塔に静けさが戻った。`);
  } else if (state.floor === currentTower().floors) {
    const clearedTowerName = currentTower().name;
    const nextTower = TOWERS[state.towerIndex + 1];
    addLog(`${clearedTowerName}を踏破した。次は${nextTower.name}へ向かえる。`);
    if (state.towerIndex === 0) {
      addLog("建築で盗賊ギルドを建てられるようになった。");
    }
    if (state.towerIndex === 1) {
      addLog("建築で狩人ギルドを建てられるようになった。");
    }
    if (state.towerIndex === 2) {
      addLog("建築で商人ギルドを建てられるようになった。");
    }
  } else {
    state.floor += 1;
    addLog(`${currentTower().name}${state.floor}階へ進めるようになった。帰るまでは探索ターンが続く。`);
    render();
    return;
  }

  state.phase = "event";
  state.townPlace = "gate";
  addLog("探索ターンを終え、イベントターンへ進む。");
  if (towerClearAnnouncement) {
    playTowerClearFanfare();
    addLog(towerClearAnnouncement, "tower-clear-log");
  }
  render();
}

function rollGrowthItemDrops(enemies) {
  const itemKeys = growthItemDropKeys();
  return enemies
    .filter((enemy) => !enemy.isBoss)
    .flatMap(() => {
      if (Math.random() >= growthItemDropRate()) return [];
      const itemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
      state.items[itemKey] = (state.items[itemKey] || 0) + 1;
      return [itemKey];
    });
}

function growthItemDropKeys() {
  return state.towerIndex >= FRUIT_DROP_TOWER_INDEX
    ? GROWTH_FRUIT_ITEM_KEYS
    : GROWTH_SEED_ITEM_KEYS;
}

function growthItemDropRate() {
  return GROWTH_ITEM_DROP_RATE + state.hunterGuildLevel * 0.01;
}

function formatPercent(rate) {
  return `${Math.round(rate * 100)}%`;
}

function preemptiveAttackRate() {
  return state.thiefGuildLevel * 0.07;
}

function merchantGuildIncomeRate() {
  return state.merchantGuildLevel * 0.1;
}

function awardBattleExperience(exp) {
  const partyMembers = new Set(state.party);
  const reserveExp = Math.floor(exp / 2);
  state.party.forEach((member) => gainExp(member, exp));

  const benchMembers = state.members.filter((member) => !partyMembers.has(member));
  if (benchMembers.length === 0 || reserveExp <= 0) return;

  addLog(`待機中の仲間は経験値${reserveExp}を得た。`);
  benchMembers.forEach((member) => gainExp(member, reserveExp));
}

function availableTavernMembers() {
  return state.reserveMembers
    .map((member, reserveIndex) => ({ member, reserveIndex }))
    .filter(({ member }) => canAppearInTavern(member));
}

function canAppearInTavern(member) {
  if (member.job === "盗賊") return state.thiefGuildLevel > 0;
  return true;
}

function addTavernMembersUpToLevel(level = state.tavernLevel) {
  const knownNames = new Set([...state.members, ...state.reserveMembers].map((member) => member.name));
  const tavernMembers = [
    ...tavernExpansionMembers.map((member) => ({ ...member, tavernLevel: 1 })),
    ...tavernSecondExpansionMembers.map((member) => ({ ...member, tavernLevel: 2 }))
  ];
  const newMembers = tavernMembers
    .filter((member) => member.tavernLevel <= level)
    .filter((member) => !knownNames.has(member.name))
    .map(cloneData);

  normalizeAttackRanges(newMembers);
  normalizeMpValues(newMembers);
  normalizeCombatStats(newMembers);
  state.reserveMembers.push(...newMembers);
  return newMembers.length;
}

function addHunterGuildMembersUpToLevel(level = state.hunterGuildLevel) {
  const knownNames = new Set([...state.members, ...state.reserveMembers].map((member) => member.name));
  const newMembers = hunterGuildMembers
    .filter((member) => member.guildLevel <= level && !knownNames.has(member.name))
    .map(cloneData);

  normalizeAttackRanges(newMembers);
  normalizeMpValues(newMembers);
  normalizeCombatStats(newMembers);
  state.reserveMembers.push(...newMembers);
  return newMembers.length;
}

function addThiefGuildMembersUpToLevel(level = state.thiefGuildLevel) {
  const knownNames = new Set([...state.members, ...state.reserveMembers].map((member) => member.name));
  const newMembers = thiefGuildMembers
    .filter((member) => member.guildLevel <= level && !knownNames.has(member.name))
    .map(cloneData);

  normalizeAttackRanges(newMembers);
  normalizeMpValues(newMembers);
  normalizeCombatStats(newMembers);
  state.reserveMembers.push(...newMembers);
  return newMembers.length;
}

function addMerchantGuildMembersUpToLevel(level = state.merchantGuildLevel) {
  const knownNames = new Set([...state.members, ...state.reserveMembers].map((member) => member.name));
  const newMembers = merchantGuildMembers
    .filter((member) => member.guildLevel <= level && !knownNames.has(member.name))
    .map(cloneData);

  normalizeAttackRanges(newMembers);
  normalizeMpValues(newMembers);
  normalizeCombatStats(newMembers);
  state.reserveMembers.push(...newMembers);
  return newMembers.length;
}

function expandTavern() {
  if (state.inBattle || state.phase !== "policy" || state.townPlace !== "building") return;
  if (state.tavernLevel >= TAVERN_MAX_LEVEL) {
    addLog("酒場は最大まで拡張済みだ。");
    render();
    return;
  }

  const cost = tavernNextCost();
  if (state.policyPoints < cost) {
    addLog("内政Pが足りない。");
    render();
    return;
  }

  state.policyPoints -= cost;
  state.tavernLevel += 1;
  const addedCount = addTavernMembersUpToLevel();
  addLog(`酒場を拡張した。Lv${state.tavernLevel}になり、新しい仲間候補が${addedCount}人集まった。`);
  render();
}

function tavernNextCost() {
  return TAVERN_EXPANSION_COSTS[state.tavernLevel] ?? null;
}

function hunterGuildUnlockFloor() {
  return TOWERS[0].floors + TOWERS[1].floors;
}

function thiefGuildUnlockFloor() {
  return TOWERS[0].floors;
}

function merchantGuildUnlockFloor() {
  return TOWERS[0].floors + TOWERS[1].floors + TOWERS[2].floors;
}

function isThiefGuildUnlocked() {
  return state.allBuildingsBuildable || state.clearedFloor >= thiefGuildUnlockFloor();
}

function thiefGuildNextCost() {
  return THIEF_GUILD_BUILD_COSTS[state.thiefGuildLevel] ?? null;
}

function upgradeThiefGuild() {
  if (state.inBattle || state.phase !== "policy" || state.townPlace !== "building") return;
  if (!isThiefGuildUnlocked()) {
    addLog("盗賊ギルドは1番目の塔を踏破すると建築できる。");
    render();
    return;
  }
  if (state.thiefGuildLevel >= THIEF_GUILD_MAX_LEVEL) {
    addLog("盗賊ギルドは最大Lvだ。");
    render();
    return;
  }

  const cost = thiefGuildNextCost();
  if (state.policyPoints < cost) {
    addLog("内政Pが足りない。");
    render();
    return;
  }

  state.policyPoints -= cost;
  state.thiefGuildLevel += 1;
  const addedCount = addThiefGuildMembersUpToLevel();
  const verb = state.thiefGuildLevel === 1 ? "建築" : "増築";
  addLog(`盗賊ギルドを${verb}した。Lv${state.thiefGuildLevel}になり、先制攻撃率は${formatPercent(preemptiveAttackRate())}になった。`);
  if (addedCount > 0) {
    addLog(`酒場に新しい人材が${addedCount}人集まった。`);
  }
  render();
}

function isMerchantGuildUnlocked() {
  return state.allBuildingsBuildable || state.clearedFloor >= merchantGuildUnlockFloor();
}

function merchantGuildNextCost() {
  return MERCHANT_GUILD_BUILD_COSTS[state.merchantGuildLevel] ?? null;
}

function upgradeMerchantGuild() {
  if (state.inBattle || state.phase !== "policy" || state.townPlace !== "building") return;
  if (!isMerchantGuildUnlocked()) {
    addLog("商人ギルドは3番目の塔を踏破すると建築できる。");
    render();
    return;
  }
  if (state.merchantGuildLevel >= MERCHANT_GUILD_MAX_LEVEL) {
    addLog("商人ギルドは最大Lvだ。");
    render();
    return;
  }

  const cost = merchantGuildNextCost();
  if (state.policyPoints < cost) {
    addLog("内政Pが足りない。");
    render();
    return;
  }

  state.policyPoints -= cost;
  state.merchantGuildLevel += 1;
  const addedCount = addMerchantGuildMembersUpToLevel();
  const verb = state.merchantGuildLevel === 1 ? "建築" : "増築";
  addLog(`商人ギルドを${verb}した。Lv${state.merchantGuildLevel}になり、イベント収入は所持金の${formatPercent(merchantGuildIncomeRate())}、最大${MERCHANT_GUILD_INCOME_CAP}Gになった。`);
  if (addedCount > 0) {
    addLog(`酒場に新しい人材が${addedCount}人集まった。`);
  }
  render();
}

function isHunterGuildUnlocked() {
  return state.allBuildingsBuildable || state.clearedFloor >= hunterGuildUnlockFloor();
}

function hunterGuildNextCost() {
  return HUNTER_GUILD_BUILD_COSTS[state.hunterGuildLevel] ?? null;
}

function upgradeHunterGuild() {
  if (state.inBattle || state.phase !== "policy" || state.townPlace !== "building") return;
  if (!isHunterGuildUnlocked()) {
    addLog("狩人ギルドは2番目の塔を踏破すると建築できる。");
    render();
    return;
  }
  if (state.hunterGuildLevel >= HUNTER_GUILD_MAX_LEVEL) {
    addLog("狩人ギルドは最大Lvだ。");
    render();
    return;
  }

  const cost = hunterGuildNextCost();
  if (state.policyPoints < cost) {
    addLog("内政Pが足りない。");
    render();
    return;
  }

  state.policyPoints -= cost;
  state.hunterGuildLevel += 1;
  const addedCount = addHunterGuildMembersUpToLevel();
  const verb = state.hunterGuildLevel === 1 ? "建築" : "増築";
  addLog(`狩人ギルドを${verb}した。Lv${state.hunterGuildLevel}になり、アイテムドロップ率は${formatPercent(growthItemDropRate())}になった。`);
  if (addedCount > 0) {
    addLog(`酒場に新しい人材が${addedCount}人集まった。`);
  }
  render();
}

function tavernRecruitCost(member) {
  return Number.isFinite(Number(member?.recruitCost))
    ? Number(member.recruitCost)
    : TAVERN_RECRUIT_COST_BASE + Math.max(0, (member.policy || 0) - 2);
}

function recruitMemberFromTavern(reserveIndex) {
  if (state.inBattle || state.phase !== "policy" || state.townPlace !== "tavern") return;
  if (state.members.length >= MAX_MEMBER_COUNT) {
    addLog("仲間はこれ以上増やせない。");
    render();
    return;
  }

  const member = state.reserveMembers[reserveIndex];
  if (!member) {
    addLog("その仲間は酒場にいない。");
    render();
    return;
  }

  const cost = tavernRecruitCost(member);
  if (state.policyPoints < cost) {
    addLog("内政Pが足りない。");
    render();
    return;
  }

  const [recruitedMember] = state.reserveMembers.splice(reserveIndex, 1);
  delete recruitedMember.joinFloor;
  state.policyPoints -= cost;
  prepareRecruit(recruitedMember);
  state.members.push(recruitedMember);
  placeMemberInFormation(recruitedMember);
  addLog(`酒場で${cost}内政Pを使い、${recruitedMember.name}が仲間になった！`);
  render();
}

function prepareRecruit(member) {
  member.level = 1;
  member.exp = 0;
  member.hp = member.maxHp;
  member.mp = member.maxMp;
}

function gainExp(member, exp) {
  normalizeCombatStats([member]);
  if (!isHardMode() && member.hp <= 0) member.hp = 1;
  member.exp += exp;

  while (member.exp >= member.level * 22) {
    member.exp -= member.level * 22;
    member.level += 1;
    const growth = member.growth || DEFAULT_GROWTH;
    member.maxHp += rollGrowth(growth.hp);
    member.maxMp += rollGrowth(growth.mp);
    member.atk += rollGrowth(growth.atk);
    member.pDef += rollGrowth(growth.pDef ?? growth.def);
    member.mDef += rollGrowth(growth.mDef ?? growth.def);
    member.agi += rollGrowth(growth.agi);
    addLog(`${member.name}はレベル${member.level}に上がった！`);
  }
}

function rollGrowth(value) {
  if (Array.isArray(value)) {
    const [min, max] = value;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  return value || 0;
}

function loseBattle() {
  const lostGold = Math.ceil(state.gold / 2);
  state.gold = Math.floor(state.gold / 2);
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.actedThisRound = [];
  state.preemptiveRoundPending = false;
  state.finalBossChainActive = false;
  state.phase = "event";
  state.townPlace = "gate";
  clearBattleStatuses();
  state.enemies = [];
  addLog(`全滅した。所持Gを${lostGold}G失い、イベントターンへ移行した。`);
  render();
}

function resolveEvent() {
  grantMerchantGuildIncome();
  const event = Math.floor(Math.random() * 3);
  if (event === 0) {
    const foundGold = 15 + currentTotalFloor() * 2;
    state.gold += foundGold;
    addLog(`イベントターン。商隊の護衛を手伝い、${foundGold}Gを得た。`);
    return;
  }
  if (event === 1) {
    state.party.forEach((member) => {
      healActor(member, 8 + currentTotalFloor());
    });
    addLog("イベントターン。旅の治療師に出会い、全員のHPが少し回復した。");
    return;
  }
  addLog("イベントターン。街道は静かだった。次の探索に備える。");
}

function grantMerchantGuildIncome() {
  if (state.merchantGuildLevel <= 0 || state.gold <= 0) return;
  const income = Math.min(MERCHANT_GUILD_INCOME_CAP, Math.floor(state.gold * merchantGuildIncomeRate()));
  if (income <= 0) return;
  state.gold += income;
  addLog(`商人ギルドの利益で${income}Gを得た。`);
}

function openStatus() {
  if (state.inBattle) return;
  renderStatus();
  els.statusDialog.showModal();
}

function openItems() {
  if (state.inBattle) return;
  renderItems();
  els.itemsDialog.showModal();
}

function openFormation() {
  renderFormation();
  els.formationDialog.showModal();
}

function openHelp() {
  renderHelp();
  els.helpDialog.showModal();
}

function renderHelp() {
  els.helpContent.innerHTML = `
    <section class="help-section">
      <h3>目的</h3>
      <p>内政で仲間と装備を整え、塔を登って最上階のボスを倒す。十の塔を踏破し、最後に闇豚らんらんを倒せばクリア。</p>
    </section>

    <section class="help-section">
      <h3>画面の見方</h3>
      <ul>
        <li>左は進行。ターン、塔の階層、探索や帰還ボタンを見る。</li>
        <li>上は仲間。前衛、後衛、HP、AP、行動ボタンを見る。</li>
        <li>下はメイン画面。街、敵、コマンド、戦闘ログを見る。</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>ターンの流れ</h3>
      <ol>
        <li>内政ターンで酒場、建築、装備、編成を整える。</li>
        <li>探索へ出て、塔を登る。帰るまで探索ターンは続く。</li>
        <li>探索を終えるとイベントが起き、次の内政ターンへ進む。</li>
      </ol>
    </section>

    <section class="help-section">
      <h3>内政でできること</h3>
      <ul>
        <li>酒場: 内政Pを使って仲間を増やす。</li>
        <li>建築: 酒場やギルドを増やし、仲間候補や探索補助を増やす。</li>
        <li>武器防具屋: ゴールドで全員の装備を強化する。</li>
        <li>編成: 前衛と後衛に最大3人ずつ配置する。</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>ステータス画面</h3>
      <ul>
        <li>戦闘中以外に開ける。仲間全員の能力を一覧できる。</li>
        <li>HPは体力、APは魔法や回復や特殊行動で使う力。</li>
        <li>配置と射程を見ると、前衛向きか後衛向きか判断しやすい。</li>
        <li>属性は物理、魔法、両方。敵の防御との相性に関係する。</li>
        <li>敏捷は行動順、内政は内政P、経験値は次のLvまでの目安。</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>戦闘の基本</h3>
      <ul>
        <li>敏捷が高いほど先に行動しやすい。</li>
        <li>射程1は前衛向き、射程2以上は後衛からも攻撃しやすい。</li>
        <li>APは魔法、回復、特殊行動で使う。待機すると消費せずにターンを進める。</li>
        <li>敵の前衛が残っていると、後衛へ届きにくい攻撃がある。</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>仲間と役割</h3>
      <ul>
        <li>戦士や騎士は前衛で受ける役。</li>
        <li>魔法使いは後衛から魔法で複数の敵を狙う役。</li>
        <li>僧侶は回復役。勇者も攻撃と回復を両方こなせる。</li>
        <li>狩人、罠師、盗賊、忍者、商人、内政官は建築で増える仲間。</li>
      </ul>
    </section>

    <section class="help-section">
      <h3>強くなる方法</h3>
      <ul>
        <li>塔で戦うと経験値とゴールドを得る。</li>
        <li>装備をまとめて強化すると、次の塔を突破しやすくなる。</li>
        <li>種や実は道具から使える。足りない能力を補うのに便利。</li>
        <li>倒れやすい時は編成、装備、帰るタイミングを見直す。</li>
      </ul>
    </section>
  `;
}

function removeFromFormation(memberIndex) {
  const member = state.members[memberIndex];
  if (!member) return;

  const row = getMemberRow(member);
  if (!row) return;
  if (state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member) {
    addLog(`${member.name}は行動中なので編成から外せない。`);
    renderFormation();
    return;
  }
  if (state.party.length <= 1) {
    addLog("編成には最低1人が必要だ。");
    renderFormation();
    return;
  }

  state.formation[row] = state.formation[row].filter((ally) => ally !== member);
  syncPartyFromFormation();
  addLog(`${member.name}を編成から外した。`);
  normalizeActiveMember();
  render();
  renderFormation();
}

function moveMemberToBench(memberIndex) {
  removeFromFormation(memberIndex);
}

function placeFormationMember(memberIndex, row) {
  const member = state.members[memberIndex];
  if (!member) return;

  if (!canPlaceInRow(member, row)) {
    addLog(`${member.name}は${row === "front" ? "前衛" : "後衛"}に配置できない。`);
    renderFormation();
    return;
  }
  if (state.formation[row].length >= MAX_ROW_SIZE) {
    addLog(`${row === "front" ? "前衛" : "後衛"}は最大${MAX_ROW_SIZE}人までだ。`);
    renderFormation();
    return;
  }

  const currentRow = getMemberRow(member);
  if (currentRow) {
    state.formation[currentRow] = state.formation[currentRow].filter((ally) => ally !== member);
  }
  state.formation[row].push(member);
  syncPartyFromFormation();
  addLog(`${member.name}を${row === "front" ? "前衛" : "後衛"}に配置した。`);
  normalizeActiveMember();
  render();
  renderFormation();
}

function replaceFormationSlot(row, oldMember, newMember) {
  const index = state.formation[row].indexOf(oldMember);
  if (index < 0) return false;
  state.formation[row][index] = newMember;
  return true;
}

function finishFormationSwap(member, target) {
  syncPartyFromFormation();
  addLog(`${member.name}と${target.name}を入れ替えた。`);
  normalizeActiveMember();
  render();
  renderFormation();
}

function swapFormationMembers(memberIndex, targetIndex) {
  const member = state.members[memberIndex];
  const target = state.members[targetIndex];
  if (!member || !target || member === target) return;

  const memberRow = getMemberRow(member);
  const targetRow = getMemberRow(target);
  if (!memberRow && !targetRow) return;

  if (memberRow && targetRow) {
    if (!canPlaceInRow(member, targetRow)) {
      addLog(`${member.name}は${rowLabel(targetRow)}に配置できない。`);
      renderFormation();
      return;
    }
    if (!canPlaceInRow(target, memberRow)) {
      addLog(`${target.name}は${rowLabel(memberRow)}に配置できない。`);
      renderFormation();
      return;
    }

    if (memberRow === targetRow) {
      const rowMembers = state.formation[memberRow];
      const memberSlot = rowMembers.indexOf(member);
      const targetSlot = rowMembers.indexOf(target);
      if (memberSlot < 0 || targetSlot < 0) return;
      rowMembers[memberSlot] = target;
      rowMembers[targetSlot] = member;
      finishFormationSwap(member, target);
      return;
    }

    const memberSlot = state.formation[memberRow].indexOf(member);
    const targetSlot = state.formation[targetRow].indexOf(target);
    if (memberSlot < 0 || targetSlot < 0) return;
    state.formation[memberRow][memberSlot] = target;
    state.formation[targetRow][targetSlot] = member;
    finishFormationSwap(member, target);
    return;
  }

  const row = memberRow || targetRow;
  const enteringMember = memberRow ? target : member;
  const leavingMember = memberRow ? member : target;
  if (!canPlaceInRow(enteringMember, row)) {
    addLog(`${enteringMember.name}は${rowLabel(row)}に配置できない。`);
    renderFormation();
    return;
  }
  if (state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === leavingMember) {
    addLog(`${leavingMember.name}は行動中なので控えと入れ替えられない。`);
    renderFormation();
    return;
  }
  if (!replaceFormationSlot(row, leavingMember, enteringMember)) return;
  finishFormationSwap(member, target);
}

function handleFormationDrop(memberIndex, target) {
  if (target === "bench") {
    moveMemberToBench(memberIndex);
    return;
  }
  placeFormationMember(memberIndex, target);
}

function handleFormationMemberDrop(memberIndex, targetIndex) {
  swapFormationMembers(memberIndex, targetIndex);
}

function draggedFormationMemberIndex(event) {
  const value = event.dataTransfer.getData("text/plain");
  if (value === "") return -1;
  const index = Number(value);
  return Number.isInteger(index) ? index : -1;
}

function clearFormationDragOver() {
  els.formationContent.querySelectorAll(".drag-over").forEach((element) => {
    element.classList.remove("drag-over");
  });
}

function normalizeActiveMember() {
  if (state.party.length === 0) return;
  if (state.activeMemberIndex >= state.party.length) {
    state.activeMemberIndex = 0;
  }
  if (state.inBattle && state.party[state.activeMemberIndex]?.hp <= 0) {
    const nextIndex = nextLivingPartyIndex(0);
    if (nextIndex === -1) {
      loseBattle();
      return;
    }
    state.activeMemberIndex = nextIndex;
  }
  if (state.inBattle && state.activeActor?.type === "party" && !state.party.includes(state.activeActor.actor)) {
    state.activeActor = null;
    advanceBattleTurn();
  }
}

function addLog(message, className = "") {
  const line = document.createElement("p");
  line.textContent = message;
  if (className) line.className = className;
  els.log.prepend(line);
}

function currentBgmTrack() {
  if (state.inBattle && state.enemies.some((enemy) => enemy.name === "闇豚らんらん")) {
    return BGM_TRACKS.finalBoss;
  }
  if (state.towerIndex >= 5 && (state.phase === "dungeon" || state.inBattle)) {
    return BGM_TRACKS.dungeon6;
  }
  if (state.inBattle) return BGM_TRACKS.battle;
  return BGM_TRACKS[state.phase] || BGM_TRACKS.policy;
}

function toggleBgm() {
  bgmLevel = (bgmLevel + 1) % (BGM_MAX_LEVEL + 1);
  localStorage.setItem(BGM_SETTING_KEY, String(bgmLevel));
  updateBgm();
}

function updateBgm() {
  els.bgmBtn.textContent = `BGM ${bgmLevel}`;
  bgmAudio.volume = bgmLevel / BGM_MAX_LEVEL;
  if (bgmLevel === 0) {
    bgmAudio.pause();
    return;
  }

  const track = currentBgmTrack();
  if (!bgmAudio.src.endsWith(track.src)) {
    bgmAudio.src = track.src;
  }
  bgmAudio.play().catch(() => {
    els.bgmBtn.textContent = `BGM ${bgmLevel} START`;
  });
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function memberIndex(member) {
  return state.members.indexOf(member);
}

function serializeActionEntry(entry) {
  if (!entry) return null;
  const index = entry.type === "party" ? memberIndex(entry.actor) : state.enemies.indexOf(entry.actor);
  if (index < 0) return null;
  return { type: entry.type, index, order: entry.order };
}

function deserializeActionEntry(entry) {
  if (!entry) return null;
  const actor = entry.type === "party" ? state.members[entry.index] : state.enemies[entry.index];
  if (!actor) return null;
  return { type: entry.type, actor, order: entry.order };
}

function actionKey(type, actor) {
  const index = type === "party" ? memberIndex(actor) : state.enemies.indexOf(actor);
  return index >= 0 ? `${type}:${index}` : null;
}

function actionKeyFromEntry(entry) {
  if (!entry) return null;
  return actionKey(entry.type, entry.actor);
}

function markActorActed(entry) {
  const key = actionKeyFromEntry(entry);
  if (!key || state.actedThisRound.includes(key)) return;
  state.actedThisRound.push(key);
}

function hasActedThisRound(type, actor) {
  const key = actionKey(type, actor);
  return Boolean(key && state.actedThisRound.includes(key));
}

function canSaveGame() {
  return state.phase === "policy" && !state.inBattle;
}

function saveSlotKey(slot) {
  return `${SAVE_KEY_PREFIX}-${slot}`;
}

function readSaveSlot(slot) {
  const rawSave = localStorage.getItem(saveSlotKey(slot));
  if (!rawSave) return null;
  try {
    return JSON.parse(rawSave);
  } catch (error) {
    return null;
  }
}

function buildSavePayload(slot) {
  return {
    version: 1,
    slot,
    savedAt: new Date().toLocaleString("ja-JP"),
    summary: `第${state.turn}T ${PHASE_LABELS[state.phase]} / ${difficultyLabel()} / ${state.gold}G / 仲間${state.members.length}人${state.allBuildingsBuildable ? " / 全建築可" : ""}`,
    turn: state.turn,
    difficulty: state.difficulty,
    phase: state.phase,
    towerIndex: state.towerIndex,
    floor: state.floor,
    clearedFloor: state.clearedFloor,
    gold: state.gold,
    policyPoints: state.policyPoints,
    tavernLevel: state.tavernLevel,
    hunterGuildLevel: state.hunterGuildLevel,
    thiefGuildLevel: state.thiefGuildLevel,
    merchantGuildLevel: state.merchantGuildLevel,
    allBuildingsBuildable: state.allBuildingsBuildable,
    inBattle: state.inBattle,
    finalBossChainActive: state.finalBossChainActive,
    townPlace: state.townPlace,
    activeMemberIndex: state.activeMemberIndex,
    activeActor: serializeActionEntry(state.activeActor),
    actionQueue: state.actionQueue.map(serializeActionEntry).filter(Boolean),
    actedThisRound: [...state.actedThisRound],
    enemies: cloneData(state.enemies),
    items: cloneData(state.items),
    members: cloneData(state.members),
    reserveMembers: cloneData(state.reserveMembers),
    formation: {
      front: state.formation.front.map(memberIndex).filter((index) => index >= 0),
      back: state.formation.back.map(memberIndex).filter((index) => index >= 0)
    },
    logs: [...els.log.querySelectorAll("p")].slice(0, 40).map((line) => line.textContent)
  };
}

function applySavePayload(payload) {
  if (!payload || payload.version !== 1) throw new Error("Unsupported save data");

  state.turn = payload.turn;
  state.difficulty = DIFFICULTY_LABELS[payload.difficulty] ? payload.difficulty : "normal";
  state.phase = payload.phase;
  state.towerIndex = payload.towerIndex;
  state.floor = payload.floor;
  state.clearedFloor = payload.clearedFloor;
  state.gold = payload.gold;
  state.policyPoints = payload.policyPoints;
  state.tavernLevel = Math.min(
    TAVERN_MAX_LEVEL,
    Math.max(0, Number(payload.tavernLevel) || (payload.tavernExpanded ? 1 : 0))
  );
  state.hunterGuildLevel = Math.min(HUNTER_GUILD_MAX_LEVEL, Math.max(0, Number(payload.hunterGuildLevel) || 0));
  state.thiefGuildLevel = Math.min(THIEF_GUILD_MAX_LEVEL, Math.max(0, Number(payload.thiefGuildLevel) || 0));
  state.merchantGuildLevel = Math.min(MERCHANT_GUILD_MAX_LEVEL, Math.max(0, Number(payload.merchantGuildLevel) || 0));
  state.allBuildingsBuildable = Boolean(payload.allBuildingsBuildable);
  state.inBattle = payload.inBattle;
  state.finalBossChainActive = state.inBattle && Boolean(payload.finalBossChainActive);
  state.townPlace = payload.townPlace === "shop" ? "gate" : payload.townPlace;
  state.activeMemberIndex = payload.activeMemberIndex || 0;
  state.members = cloneData(payload.members || []);
  state.reserveMembers = cloneData(payload.reserveMembers || []);
  state.enemies = cloneData(payload.enemies || []);
  state.pendingDamageEffects = [];
  state.pendingSubstitutionEffects = [];
  state.preemptiveRoundPending = false;
  state.items = {
    ...createEmptyGrowthInventory(),
    ...(payload.items || {})
  };
  normalizeAttackRanges(state.members);
  normalizeAttackRanges(state.reserveMembers);
  normalizeAttackRanges(state.enemies);
  normalizeMpValues(state.members);
  normalizeMpValues(state.reserveMembers);
  normalizeMpValues(state.enemies);
  normalizeCombatStats(state.members);
  normalizeCombatStats(state.reserveMembers);
  normalizeCombatStats(state.enemies);
  addTavernMembersUpToLevel();
  addHunterGuildMembersUpToLevel();
  addThiefGuildMembersUpToLevel();
  addMerchantGuildMembersUpToLevel();
  state.formation.front = (payload.formation?.front || [])
    .map((index) => state.members[index])
    .filter(Boolean)
    .slice(0, MAX_ROW_SIZE);
  state.formation.back = (payload.formation?.back || [])
    .map((index) => state.members[index])
    .filter(Boolean)
    .slice(0, MAX_ROW_SIZE);
  syncPartyFromFormation();
  state.actionQueue = (payload.actionQueue || []).map(deserializeActionEntry).filter(Boolean);
  state.activeActor = deserializeActionEntry(payload.activeActor);
  state.actedThisRound = Array.isArray(payload.actedThisRound) ? payload.actedThisRound : [];
  if (state.inBattle && !state.activeActor) {
    advanceBattleTurn();
  }
  normalizeActiveMember();

  els.log.innerHTML = "";
  (payload.logs || []).slice().reverse().forEach(addLog);
}

function openSaveSlots() {
  if (!canSaveGame()) {
    addLog("セーブは内政ターンの街でだけできます。");
    return;
  }
  renderSaveSlots("save");
}

function openLoadSlots() {
  renderSaveSlots("load");
}

function renderSaveSlots(mode) {
  els.battleTitle.textContent = mode === "save" ? "セーブ" : "ロード";
  els.enemyArea.innerHTML = Array.from({ length: SAVE_SLOT_COUNT }, (_, index) => {
    const slot = index + 1;
    const payload = readSaveSlot(slot);
    const disabled = mode === "load" && !payload;
    return `
      <article class="enemy-card save-slot-card">
        <div class="name-line"><span>スロット ${slot}</span><span>${payload ? payload.savedAt : "空き"}</span></div>
        <div class="stat-line">${payload ? payload.summary : "保存データなし"}</div>
        <div class="shop-buyers">
          <button type="button" data-save-slot="${slot}" data-save-mode="${mode}" ${disabled ? "disabled" : ""}>
            ${mode === "save" ? "ここにセーブ" : "ロード"}
          </button>
        </div>
      </article>
    `;
  }).join("");
  els.commandArea.innerHTML = `<button type="button" data-save-cancel>戻る</button>`;
  els.enemyArea.querySelectorAll("[data-save-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const slot = Number(button.dataset.saveSlot);
      if (button.dataset.saveMode === "save") saveGame(slot);
      if (button.dataset.saveMode === "load") loadGame(slot);
    });
  });
  els.commandArea.querySelector("[data-save-cancel]").addEventListener("click", render);
}

function saveGame(slot) {
  if (!canSaveGame()) {
    addLog("セーブは内政ターンの街でだけできます。");
    return;
  }
  try {
    localStorage.setItem(saveSlotKey(slot), JSON.stringify(buildSavePayload(slot)));
    addLog(`スロット${slot}にセーブしました。`);
    renderSaveSlots("save");
  } catch (error) {
    addLog("セーブに失敗しました。");
  }
}

function loadGame(slot) {
  const payload = readSaveSlot(slot);
  if (!payload) {
    addLog(`スロット${slot}にセーブデータがありません。`);
    return;
  }

  try {
    applySavePayload(payload);
    addLog(`スロット${slot}からロードしました。`);
    if (els.statusDialog.open) renderStatus();
    if (els.formationDialog.open) renderFormation();
    render();
  } catch (error) {
    addLog("ロードに失敗しました。");
  }
}

function render() {
  renderDungeonProgress();
  els.gold.textContent = `${state.gold} G / 内政P ${state.policyPoints}`;
  els.statusBtn.disabled = state.inBattle;
  els.itemsBtn.disabled = state.inBattle;
  els.itemsBtn.textContent = `道具 ${totalGrowthItemCount()}`;
  els.saveBtn.disabled = !canSaveGame();
  els.partyTitle.textContent = `前衛${state.formation.front.length} / 後衛${state.formation.back.length} / 仲間${state.members.length}人`;

  renderTravelActions();
  renderParty();
  renderBattleWithEnemyRows();
  playPendingDamageEffects();
  if (els.statusDialog.open) renderStatus();
  if (els.formationDialog.open) renderFormation();
  if (els.itemsDialog.open) {
    if (state.inBattle) {
      els.itemsDialog.close();
    } else {
      renderItems();
    }
  }
  if (els.shopDialog.open) {
    if (state.phase === "policy" && !state.inBattle) {
      renderShop();
    } else {
      els.shopDialog.close();
    }
  }
  updateBgm();
}

function renderTravelActions() {
  if (state.inBattle) {
    els.travelActions.innerHTML = `
      <button type="button" disabled>探索中</button>
      <button type="button" disabled>戦闘中</button>
    `;
    return;
  }

  if (state.phase === "policy") {
    els.travelActions.innerHTML = `
      <button type="button" data-town="tower">探索へ</button>
      <button type="button" data-town="shop">武器防具屋</button>
      <button type="button" data-town="tavern">酒場</button>
      <button type="button" data-town="building">建築</button>
    `;
    els.travelActions.querySelector('[data-town="tower"]').addEventListener("click", openTowerSelect);
    els.travelActions.querySelector('[data-town="shop"]').addEventListener("click", openShop);
    els.travelActions.querySelector('[data-town="tavern"]').addEventListener("click", openTavern);
    els.travelActions.querySelector('[data-town="building"]').addEventListener("click", openBuilding);
    return;
  }

  if (state.phase === "event") {
    els.travelActions.innerHTML = `
      <button type="button" data-event="finish">イベント処理</button>
      <button type="button" disabled>次は内政</button>
    `;
    els.travelActions.querySelector('[data-event="finish"]').addEventListener("click", finishEventTurn);
    return;
  }

  if (state.phase === "ending") {
    els.travelActions.innerHTML = `
      <button type="button" disabled>クリア</button>
      <button type="button" data-ending-restart>最初から</button>
    `;
    els.travelActions.querySelector("[data-ending-restart]").addEventListener("click", restartWithClearBonus);
    return;
  }

  els.travelActions.innerHTML = `
    <button type="button" data-dungeon="climb" ${state.clearedFloor >= TOTAL_FLOORS ? "disabled" : ""}>登る</button>
    <button type="button" data-dungeon="return">帰る</button>
  `;
  els.travelActions.querySelector('[data-dungeon="climb"]').addEventListener("click", climbDungeonFloor);
  els.travelActions.querySelector('[data-dungeon="return"]').addEventListener("click", returnFromDungeon);
}

function renderParty() {
  els.party.innerHTML = `
    ${renderPartyRow("前衛", state.formation.front)}
    ${renderPartyRow("後衛", state.formation.back)}
  `;
  els.party.querySelectorAll("[data-party-action]").forEach((button) => {
    const targetIndex = button.dataset.ally === undefined ? undefined : Number(button.dataset.ally);
    button.addEventListener("click", () => performAction(button.dataset.partyAction, targetIndex));
  });
  state.pendingSubstitutionEffects = [];
}

function renderPartyRow(label, members) {
  return `
    <section class="party-row">
      <div class="party-row-title">${label}</div>
      <div class="party-row-grid">
        ${members.map(renderPartyMemberCard).join("") || `<div class="empty-slot">空き</div>`}
      </div>
    </section>
  `;
}

function renderPartyMemberCard(member) {
    const index = memberIndex(member);
    const active = state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member;
    const acted = state.inBattle && hasActedThisRound("party", member);
    const substitutionEffect = state.pendingSubstitutionEffects.find((effect) => effect.replacement === member);
    const activeMember = state.activeActor?.type === "party" ? state.activeActor.actor : null;
    const isHealButtonTarget = activeMember && isGroupHeal(activeMember)
      ? member === activeMember
      : state.party.includes(member);
    const canTargetHeal = state.inBattle
      && activeMember
      && (activeMember.job === "僧侶" || activeMember.job === "勇者")
      && isHealButtonTarget
      && member.hp > 0;
    const healButtonLabel = activeMember && isGroupHeal(activeMember) ? "全体回復" : "回復";
    const memberActionButtons = [
      active ? `<button type="button" data-party-action="wait">待機</button>` : "",
      canTargetHeal ? `<button type="button" data-party-action="heal" data-ally="${index}" ${activeMember.mp >= healApCost(activeMember) ? "" : "disabled"}>${healButtonLabel}</button>` : ""
    ].filter(Boolean).join("");
    const actionAreaClass = memberActionButtons ? "member-actions" : "member-actions empty-actions";
    return `
      <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""} ${acted ? "acted" : ""} ${substitutionEffect ? "substitution-incoming" : ""}" data-member-card="${index}">
        <div class="member-card-content">
          <div class="name-line">
            <span class="name-with-icon">${renderMemberSprite(member)}<span>${member.name}</span></span>
            ${renderMemberMeta(member, `${acted ? "済 / " : ""}Lv ${member.level} / 射程 ${attackRange(member)}`)}
          </div>
          <div class="member-card-body">
            <div class="member-stats">
              <div class="stat-line">HP ${member.hp}/${member.maxHp}</div>
              <div class="stat-line">AP ${member.mp}/${member.maxMp}</div>
              ${renderStatusBadges(member)}
            </div>
            <div class="${actionAreaClass}" ${memberActionButtons ? "" : `aria-hidden="true"`}>
              ${memberActionButtons}
            </div>
          </div>
        </div>
        ${renderSubstitutionGhost(substitutionEffect)}
      </article>
    `;
}

function renderSubstitutionGhost(effect) {
  if (!effect) return "";

  const defeated = effect.defeated;
  return `
    <div class="substitution-outgoing-ghost" aria-hidden="true">
      <div class="name-line">
        <span class="name-with-icon">${renderMemberSprite(defeated)}<span>${defeated.name}</span></span>
        ${renderMemberMeta(defeated, "HP 0")}
      </div>
      <div class="substitution-ghost-body">
        <div class="member-stats">
          <div class="stat-line">HP 0/${defeated.maxHp}</div>
          <div class="stat-line">AP ${defeated.mp}/${defeated.maxMp}</div>
          ${renderStatusBadges(defeated)}
        </div>
      </div>
    </div>
  `;
}

function renderBattle() {
  if (state.phase === "policy") {
    renderTown();
    return;
  }

  if (state.phase === "event") {
    renderEvent();
    return;
  }

  if (state.phase === "ending") {
    renderEnding();
    return;
  }

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");
  const canBowPierce = state.inBattle && canUseBowPierce(member);
  const canArrowRain = state.inBattle && canUseArrowRain(member);
  const canInstantDeath = state.inBattle && canUseInstantDeath(member);

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? renderExplorationStandbyCard()
    : state.enemies.map((enemy, enemyIndex) => {
      const acted = state.inBattle && hasActedThisRound("enemy", enemy);
      return `
        <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""} ${acted ? "acted" : ""}" data-enemy-card="${enemyIndex}">
          <div class="name-line">
            <span class="name-with-icon">${renderMonsterSprite(enemy)}<span>${enemy.name}</span></span>
            <span>${enemy.hp > 0 ? acted ? "済" : "敵" : "撃破"}</span>
          </div>
          <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / 物防 ${enemy.pDef} / 魔防 ${enemy.mDef}</div>
          <div class="stat-line">射程 ${attackRange(enemy)} / 敏捷 ${enemy.agi}</div>
          ${renderStatusBadges(enemy)}
          ${state.inBattle && enemy.hp > 0 ? `
            <div class="enemy-actions">
              <button type="button" data-target-action="attack" data-enemy="${enemyIndex}" ${member && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>${normalAttackLabel(member)}</button>
              ${canBowPierce ? `<button type="button" data-target-action="bow-pierce" data-enemy="${enemyIndex}" ${member.mp >= ASH_BOW_PIERCE_AP_COST && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>弓貫通</button>` : ""}
              ${canArrowRain ? `<button type="button" data-target-action="arrow-rain" data-enemy="${enemyIndex}" ${member.mp >= KIRIKA_ARROW_RAIN_AP_COST ? "" : "disabled"}>アローレイン</button>` : ""}
              ${canInstantDeath ? `<button type="button" data-target-action="instant-death" data-enemy="${enemyIndex}" ${member.mp >= INSTANT_DEATH_AP_COST && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>即死</button>` : ""}
              <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>${spellButtonLabel(member)}</button>
              <button type="button" data-target-action="wait">待機</button>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");

  if (!state.inBattle) {
    renderDungeonQuickActions();
    bindExplorationStandbyActions();
    return;
  }

  els.commandArea.innerHTML = "";
  bindEnemyTargetActions();
}

function renderBattleWithEnemyRows() {
  if (state.phase === "policy") {
    renderTown();
    return;
  }

  if (state.phase === "event") {
    renderEvent();
    return;
  }

  if (state.phase === "ending") {
    renderEnding();
    return;
  }

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");
  const canBowPierce = state.inBattle && canUseBowPierce(member);
  const canArrowRain = state.inBattle && canUseArrowRain(member);
  const canInstantDeath = state.inBattle && canUseInstantDeath(member);

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? renderExplorationStandbyCard()
    : renderEnemyRows(canSpell, canBowPierce, canArrowRain, canInstantDeath);

  if (!state.inBattle) {
    renderDungeonQuickActions();
    bindExplorationStandbyActions();
    return;
  }

  els.commandArea.innerHTML = "";
  bindEnemyTargetActions();
}

function renderExplorationStandbyCard() {
  return `
    <div class="enemy-card town-card exploration-standby-card">
      <div class="name-line"><span>${currentTower().name}${state.floor}階</span><span>探索中</span></div>
      <div class="stat-line">登ると戦闘が始まる。帰るを選ぶまで、ダンジョン探索ターンは続く。</div>
    </div>
  `;
}

function renderDungeonQuickActions() {
  const canClimb = state.phase === "dungeon" && !state.inBattle && state.clearedFloor < TOTAL_FLOORS;
  if (!canClimb) {
    els.commandArea.innerHTML = "";
    return;
  }

  els.commandArea.innerHTML = `
    <div class="dungeon-quick-actions">
      <button type="button" data-exploration-climb>登る</button>
      <span>次の戦闘へ</span>
    </div>
  `;
}

function bindExplorationStandbyActions() {
  document.querySelectorAll("[data-exploration-climb]").forEach((button) => {
    button.addEventListener("click", climbDungeonFloor);
  });
}

function renderEnemyRows(canSpell, canBowPierce, canArrowRain, canInstantDeath) {
  return `
    <section class="enemy-formation">
      ${renderEnemyRow("前列", "front", canSpell, canBowPierce, canArrowRain, canInstantDeath)}
      ${renderEnemyRow("後列", "back", canSpell, canBowPierce, canArrowRain, canInstantDeath)}
    </section>
  `;
}

function renderEnemyRow(label, row, canSpell, canBowPierce, canArrowRain, canInstantDeath) {
  const enemies = state.enemies
    .map((enemy, enemyIndex) => ({ enemy, enemyIndex }))
    .filter((entry) => (entry.enemy.row || "front") === row);
  if (enemies.length === 0 && row === "back") return "";

  return `
    <section class="enemy-row">
      <div class="party-row-title">${label}</div>
      <div class="enemy-row-grid">
        ${renderEnemyRowSlots(enemies, canSpell, canBowPierce, canArrowRain, canInstantDeath)}
      </div>
    </section>
  `;
}

function renderEnemyRowSlots(enemies, canSpell, canBowPierce, canArrowRain, canInstantDeath) {
  return Array.from({ length: MAX_ROW_SIZE }, (_, column) => {
    const columnEnemies = enemies.filter(({ enemy }) => enemyColumn(enemy) === column);
    const entry = columnEnemies.find(({ enemy }) => enemy.hp > 0) || columnEnemies[0];
    if (!entry) return `<div class="empty-slot">空き</div>`;
    return renderEnemyCard(entry.enemy, entry.enemyIndex, canSpell, canBowPierce, canArrowRain, canInstantDeath);
  }).join("");
}

function renderEnemyCard(enemy, enemyIndex, canSpell, canBowPierce, canArrowRain, canInstantDeath) {
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canReach = member && activePartyReachableEnemies(member).includes(enemy);
  const acted = state.inBattle && hasActedThisRound("enemy", enemy);
  return `
    <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""} ${acted ? "acted" : ""}" data-enemy-card="${enemyIndex}">
      <div class="name-line">
        <span class="name-with-icon">${renderMonsterSprite(enemy)}<span>${enemy.name}</span></span>
        <span>${enemy.hp > 0 ? acted ? "済" : "敵" : "撃破"}</span>
      </div>
      <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / 物防 ${enemy.pDef} / 魔防 ${enemy.mDef}</div>
      <div class="stat-line">射程 ${attackRange(enemy)} / 敏捷 ${enemy.agi}</div>
      ${renderStatusBadges(enemy)}
      ${state.inBattle && enemy.hp > 0 ? `
        <div class="enemy-actions">
          <button type="button" data-target-action="attack" data-enemy="${enemyIndex}" ${canReach ? "" : "disabled"}>${normalAttackLabel(member)}</button>
          ${canBowPierce ? `<button type="button" data-target-action="bow-pierce" data-enemy="${enemyIndex}" ${canReach && member.mp >= ASH_BOW_PIERCE_AP_COST ? "" : "disabled"}>弓貫通</button>` : ""}
          ${canArrowRain ? `<button type="button" data-target-action="arrow-rain" data-enemy="${enemyIndex}" ${member.mp >= KIRIKA_ARROW_RAIN_AP_COST ? "" : "disabled"}>アローレイン</button>` : ""}
          ${canInstantDeath ? `<button type="button" data-target-action="instant-death" data-enemy="${enemyIndex}" ${canReach && member.mp >= INSTANT_DEATH_AP_COST ? "" : "disabled"}>即死</button>` : ""}
          <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell && canReach ? "" : "disabled"}>${spellButtonLabel(member)}</button>
          <button type="button" data-target-action="wait">待機</button>
        </div>
      ` : ""}
    </article>
  `;
}

function bindEnemyTargetActions() {
  els.enemyArea.querySelectorAll("button[data-target-action]").forEach((button) => {
    button.addEventListener("click", () => {
      performAction(button.dataset.targetAction, Number(button.dataset.enemy));
    });

    if (!["attack", "spell", "bow-pierce", "arrow-rain", "instant-death"].includes(button.dataset.targetAction)) return;

    const preview = () => {
      const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
      const enemy = state.enemies[Number(button.dataset.enemy)];
      showTargetPreview(button.dataset.targetAction, member, enemy);
    };

    button.addEventListener("mouseenter", preview);
    button.addEventListener("focus", preview);
    button.addEventListener("mouseleave", clearTargetPreview);
    button.addEventListener("blur", clearTargetPreview);
  });
}

function showTargetPreview(kind, member, primaryTarget) {
  clearTargetPreview();
  const targets = kind === "spell"
    ? spellTargets(member, primaryTarget)
    : kind === "bow-pierce"
    ? bowPierceTargets(primaryTarget)
    : kind === "arrow-rain"
    ? arrowRainTargets()
    : kind === "instant-death"
    ? [primaryTarget].filter((target) => target && target.hp > 0)
    : normalAttackTargets(member, primaryTarget);
  targets.forEach((enemy) => {
    const enemyIndex = state.enemies.indexOf(enemy);
    const card = els.enemyArea.querySelector(`[data-enemy-card="${enemyIndex}"]`);
    if (card) card.classList.add("attack-preview");
  });
}

function clearTargetPreview() {
  els.enemyArea.querySelectorAll(".enemy-card.attack-preview").forEach((card) => {
    card.classList.remove("attack-preview");
  });
}

function playPendingDamageEffects() {
  if (state.pendingDamageEffects.length === 0) return;

  const effects = state.pendingDamageEffects.splice(0);
  const stackCounts = new Map();

  effects.forEach((effect, effectIndex) => {
    const selector = effect.side === "party"
      ? `[data-member-card="${effect.index}"]`
      : `[data-enemy-card="${effect.index}"]`;
    const container = effect.side === "party" ? els.party : els.enemyArea;
    const card = container.querySelector(selector);
    if (!card) return;

    const stackKey = `${effect.side}-${effect.index}`;
    const stack = stackCounts.get(stackKey) || 0;
    stackCounts.set(stackKey, stack + 1);

    triggerHitShake(card);
    showDamagePopup(card, effect.amount, stack);
    playHitSound(effectIndex * 0.045);
  });
}

function triggerHitShake(card) {
  card.classList.remove("hit-shake");
  void card.offsetWidth;
  card.classList.add("hit-shake");
  window.setTimeout(() => card.classList.remove("hit-shake"), 340);
}

function showDamagePopup(card, amount, stack) {
  const popup = document.createElement("span");
  popup.className = "damage-popup";
  popup.textContent = amount;
  popup.style.setProperty("--damage-offset", `${stack * 18}px`);
  card.appendChild(popup);
  window.setTimeout(() => popup.remove(), 2000);
}

function playHitSound(delay = 0) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    if (!effectAudioContext) effectAudioContext = new AudioContextClass();
    if (effectAudioContext.state === "suspended") {
      effectAudioContext.resume().catch(() => {});
    }

    const start = effectAudioContext.currentTime + delay;
    const oscillator = effectAudioContext.createOscillator();
    const gain = effectAudioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(180, start);
    oscillator.frequency.exponentialRampToValueAtTime(90, start + 0.11);

    gain.gain.setValueAtTime(0.045, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.13);

    oscillator.connect(gain);
    gain.connect(effectAudioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.13);
  } catch (error) {
    // 効果音が使えない環境でも戦闘自体は続行する。
  }
}

function playTowerClearFanfare() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    if (!effectAudioContext) effectAudioContext = new AudioContextClass();
    if (effectAudioContext.state === "suspended") {
      effectAudioContext.resume().catch(() => {});
    }

    const now = effectAudioContext.currentTime;
    const notes = [
      { delay: 0, frequency: 523.25, duration: 0.14 },
      { delay: 0.13, frequency: 659.25, duration: 0.14 },
      { delay: 0.26, frequency: 783.99, duration: 0.18 },
      { delay: 0.45, frequency: 1046.5, duration: 0.34 },
      { delay: 0.45, frequency: 1318.51, duration: 0.28 }
    ];

    notes.forEach((note, index) => {
      const start = now + note.delay;
      const oscillator = effectAudioContext.createOscillator();
      const gain = effectAudioContext.createGain();

      oscillator.type = index >= 3 ? "triangle" : "square";
      oscillator.frequency.setValueAtTime(note.frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.05, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.duration);

      oscillator.connect(gain);
      gain.connect(effectAudioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + note.duration + 0.02);
    });
  } catch (error) {
    // 効果音が使えない環境でも進行は止めない。
  }
}

function renderTown() {
  els.battleTitle.textContent = state.townPlace === "tower"
    ? "探索先選択"
    : state.townPlace === "tavern"
    ? "内政: 酒場"
    : state.townPlace === "building"
    ? "内政: 建築"
    : "内政ターン";
  els.enemyArea.innerHTML = state.townPlace === "tower"
    ? TOWERS.map((tower, towerIndex) => {
      if (!isTowerUnlocked(towerIndex)) return "";
      const boss = towerBoss(towerIndex);
      return `
      <article class="enemy-card">
        <div class="name-line"><span>${tower.name}</span><span>${tower.floors}階</span></div>
        <div class="stat-line">1階から探索を開始する。最上階: ${boss.name}</div>
        <div class="shop-buyers">
          <button type="button" data-tower="${towerIndex}">探索する</button>
        </div>
      </article>
    `;
    }).join("")
    : state.townPlace === "tavern"
    ? renderTavern()
    : state.townPlace === "building"
    ? renderBuilding()
    : renderTownGate();

  els.commandArea.innerHTML = state.townPlace === "tower" || state.townPlace === "tavern" || state.townPlace === "building"
    ? `<button type="button" data-town="gate">街へ戻る</button>`
    : "";

  els.enemyArea.querySelectorAll("[data-tower]").forEach((button) => {
    button.addEventListener("click", () => startDungeonExploration(Number(button.dataset.tower)));
  });
  els.enemyArea.querySelectorAll("[data-recruit]").forEach((button) => {
    button.addEventListener("click", () => recruitMemberFromTavern(Number(button.dataset.recruit)));
  });
  els.enemyArea.querySelectorAll("[data-build]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.build === "tavern") expandTavern();
      if (button.dataset.build === "hunter-guild") upgradeHunterGuild();
      if (button.dataset.build === "thief-guild") upgradeThiefGuild();
      if (button.dataset.build === "merchant-guild") upgradeMerchantGuild();
    });
  });
  const backButton = els.commandArea.querySelector('[data-town="gate"]');
  if (backButton) backButton.addEventListener("click", returnTownGate);
}

function renderTownGate() {
  return `
    <div class="enemy-card town-card">
      街で次の探索に備える。酒場で仲間を募るか、武器防具を強化するか、建築で街を整えるか、探索へ出発できる。
    </div>
    ${state.allBuildingsBuildable ? `
    <article class="enemy-card town-card">
      <div class="name-line"><span>クリア特典</span><span>全建築解放</span></div>
      <div class="stat-line">建築の塔踏破条件は解除されている。内政Pがあれば最初からすべて建築できる。</div>
    </article>
    ` : ""}
    <article class="enemy-card town-card">
      <div class="name-line"><span>難易度</span><span>${difficultyLabel()}</span></div>
      <div class="stat-line">ノーマル: 戦闘後、HP0の仲間はHP1で踏みとどまる。</div>
      <div class="stat-line">ハード: HP0の仲間は戦闘後もHP0のまま。次の内政フェイズまで回復しない。</div>
      <div class="stat-line">難易度は旅を始める前に選んだ設定で固定されています。</div>
    </article>
  `;
}

function renderBuilding() {
  const tavernMaxed = state.tavernLevel >= TAVERN_MAX_LEVEL;
  const nextTavernCost = tavernNextCost();
  const canExpand = !tavernMaxed && state.policyPoints >= nextTavernCost;
  const thiefUnlocked = isThiefGuildUnlocked();
  const thiefMaxed = state.thiefGuildLevel >= THIEF_GUILD_MAX_LEVEL;
  const thiefNextCost = thiefGuildNextCost();
  const canUpgradeThiefGuild = thiefUnlocked && !thiefMaxed && state.policyPoints >= thiefNextCost;
  const thiefNextLabel = state.thiefGuildLevel === 0 ? "建築" : "増築";
  const hunterUnlocked = isHunterGuildUnlocked();
  const hunterMaxed = state.hunterGuildLevel >= HUNTER_GUILD_MAX_LEVEL;
  const hunterNextCost = hunterGuildNextCost();
  const canUpgradeHunterGuild = hunterUnlocked && !hunterMaxed && state.policyPoints >= hunterNextCost;
  const hunterNextLabel = state.hunterGuildLevel === 0 ? "建築" : "増築";
  const merchantUnlocked = isMerchantGuildUnlocked();
  const merchantMaxed = state.merchantGuildLevel >= MERCHANT_GUILD_MAX_LEVEL;
  const merchantNextCost = merchantGuildNextCost();
  const canUpgradeMerchantGuild = merchantUnlocked && !merchantMaxed && state.policyPoints >= merchantNextCost;
  const merchantNextLabel = state.merchantGuildLevel === 0 ? "建築" : "増築";
  return `
    <article class="enemy-card town-card">
      <div class="name-line">
        <span>酒場拡張</span>
        <span>${state.tavernLevel > 0 ? `Lv ${state.tavernLevel}` : "未拡張"}</span>
      </div>
      <div class="stat-line">
        ${state.tavernLevel === 0
          ? `${TAVERN_EXPANSION_COSTS[0]}内政Pで酒場を広げ、新しい仲間候補${tavernExpansionMembers.length}人を呼び込む。`
          : tavernMaxed
          ? "酒場は最大まで拡張済み。追加の仲間候補が酒場に集まっている。"
          : `${nextTavernCost}内政Pでさらに広げ、新しい仲間候補${tavernSecondExpansionMembers.length}人を呼び込む。`}
      </div>
      <div class="stat-line">現在の内政P ${state.policyPoints}</div>
      <div class="shop-buyers">
        <button type="button" data-build="tavern" ${canExpand ? "" : "disabled"}>
          ${tavernMaxed ? "最大Lv" : `${state.tavernLevel === 0 ? "建築" : "増築"} ${nextTavernCost}内政P`}
        </button>
      </div>
    </article>
    <article class="enemy-card town-card">
      <div class="name-line">
        <span>盗賊ギルド</span>
        <span>${state.thiefGuildLevel > 0 ? `Lv ${state.thiefGuildLevel}` : thiefUnlocked ? "未建築" : "未解放"}</span>
      </div>
      <div class="stat-line">
        ${thiefUnlocked
          ? `盗賊や忍者を酒場へ呼び、先制攻撃率を上げる。現在 ${formatPercent(preemptiveAttackRate())}。`
          : "1番目の塔を踏破すると建築できる。"}
      </div>
      <div class="stat-line">
        ${thiefUnlocked
          ? thiefMaxed
            ? "最大Lv。これ以上は増築できない。"
            : `次の${thiefNextLabel}: ${thiefNextCost}内政P / Lv1・4・7・10で盗賊、Lv2・3・6・9で忍者追加`
          : "建築費: 15内政P"}
      </div>
      <div class="shop-buyers">
        <button type="button" data-build="thief-guild" ${canUpgradeThiefGuild ? "" : "disabled"}>
          ${thiefMaxed ? "最大Lv" : thiefUnlocked ? `${thiefNextLabel} ${thiefNextCost}内政P` : "1番目の塔踏破後"}
        </button>
      </div>
    </article>
    <article class="enemy-card town-card">
      <div class="name-line">
        <span>狩人ギルド</span>
        <span>${state.hunterGuildLevel > 0 ? `Lv ${state.hunterGuildLevel}` : hunterUnlocked ? "未建築" : "未解放"}</span>
      </div>
      <div class="stat-line">
        ${hunterUnlocked
          ? `狩人や罠師を酒場へ呼び、アイテムドロップ率を上げる。現在 ${formatPercent(growthItemDropRate())}。`
          : "2番目の塔を踏破すると建築できる。"}
      </div>
      <div class="stat-line">
        ${hunterUnlocked
          ? hunterMaxed
            ? "最大Lv。これ以上は増築できない。"
            : `次の${hunterNextLabel}: ${hunterNextCost}内政P / Lv1・4・7・10で狩人、Lv2・3・6・9で罠師追加`
          : "建築費: 15内政P"}
      </div>
      <div class="shop-buyers">
        <button type="button" data-build="hunter-guild" ${canUpgradeHunterGuild ? "" : "disabled"}>
          ${hunterMaxed ? "最大Lv" : hunterUnlocked ? `${hunterNextLabel} ${hunterNextCost}内政P` : "2番目の塔踏破後"}
        </button>
      </div>
    </article>
    <article class="enemy-card town-card">
      <div class="name-line">
        <span>商人ギルド</span>
        <span>${state.merchantGuildLevel > 0 ? `Lv ${state.merchantGuildLevel}` : merchantUnlocked ? "未建築" : "未解放"}</span>
      </div>
      <div class="stat-line">
        ${merchantUnlocked
          ? `商人の流通網で、イベントフェイズに所持金の${formatPercent(merchantGuildIncomeRate())}を得る。最大${MERCHANT_GUILD_INCOME_CAP}G。`
          : "3番目の塔を踏破すると建築できる。"}
      </div>
      <div class="stat-line">
        ${merchantUnlocked
          ? merchantMaxed
            ? "最大Lv。これ以上は増築できない。"
            : `次の${merchantNextLabel}: ${merchantNextCost}内政P / Lv1・4・7・10で商人、Lv2・3・6・8で内政官追加`
          : "建築費: 15内政P"}
      </div>
      <div class="shop-buyers">
        <button type="button" data-build="merchant-guild" ${canUpgradeMerchantGuild ? "" : "disabled"}>
          ${merchantMaxed ? "最大Lv" : merchantUnlocked ? `${merchantNextLabel} ${merchantNextCost}内政P` : "3番目の塔踏破後"}
        </button>
      </div>
    </article>
  `;
}

function renderTavern() {
  const candidates = availableTavernMembers();
  if (candidates.length === 0) {
    const hiddenThieves = state.reserveMembers.some((member) => member.job === "盗賊") && state.thiefGuildLevel === 0;
    return `<div class="enemy-card town-card">
      ${hiddenThieves
        ? "酒場に表立って集まる仲間候補はいない。盗賊は盗賊ギルドを建てると現れる。"
        : state.tavernLevel > 0 || state.hunterGuildLevel > 0 || state.thiefGuildLevel > 0 || state.merchantGuildLevel > 0
        ? "酒場に残っている仲間候補はいない。"
        : "酒場に残っている仲間候補はいない。建築で酒場を拡張すると、新しい仲間候補が集まる。"}
    </div>`;
  }

  return candidates.map(({ member, reserveIndex }) => {
    const cost = tavernRecruitCost(member);
    const canRecruit = state.members.length < MAX_MEMBER_COUNT && state.policyPoints >= cost;
    return `
      <article class="enemy-card">
        <div class="name-line">
          <span class="name-with-icon">${renderMemberSprite(member)}<span>${member.name}</span></span>
          <span>${member.job}</span>
        </div>
        <div class="stat-line">HP ${member.hp}/${member.maxHp} / AP ${member.mp}/${member.maxMp} / 射程 ${attackRange(member)} / 配置 ${member.positionType}</div>
        <div class="stat-line">攻撃 ${member.atk} / 属性 ${attackTypeLabel(member)} / 物防 ${member.pDef} / 魔防 ${member.mDef}</div>
        <div class="stat-line">敏捷 ${member.agi} / 内政 ${member.policy}</div>
        <div class="shop-buyers">
          <button type="button" data-recruit="${reserveIndex}" ${canRecruit ? "" : "disabled"}>
            勧誘 ${cost}内政P
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderEvent() {
  els.battleTitle.textContent = "イベントターン";
  els.enemyArea.innerHTML = `
    <div class="enemy-card town-card">
      <div class="name-line"><span>${currentTower().name}${state.floor}階の探索後</span><span>イベント</span></div>
      <div class="stat-line">イベントを処理すると、この1ターンが終わり、次の内政ターンへ進む。</div>
    </div>
  `;
  els.commandArea.innerHTML = `
    <button type="button" data-event="finish">イベント処理</button>
  `;
  els.commandArea.querySelector('[data-event="finish"]').addEventListener("click", finishEventTurn);
}

function renderEnding() {
  const ending = state.ending || {
    clearTurn: state.turn,
    difficulty: state.difficulty,
    bonusPolicyPoints: clearPolicyPointBonus(state.turn)
  };
  const difficulty = DIFFICULTY_LABELS[ending.difficulty] || difficultyLabel();

  els.battleTitle.textContent = "エンディング";
  els.enemyArea.innerHTML = `
    <article class="enemy-card town-card">
      <div class="name-line"><span>闇豚らんらん討伐</span><span>クリア</span></div>
      <div class="stat-line">こうして平和は訪れた。</div>
      <div class="stat-line">遊んでくれてありがとうございました。</div>
      <div class="stat-line">クリアターンは${ending.clearTurn}。</div>
      <div class="stat-line">難易度は${difficulty}。</div>
      <div class="stat-line">やり直し時の初期内政Pは(60 - ${ending.clearTurn})の2乗 = ${ending.bonusPolicyPoints}。</div>
      <div class="stat-line">次の旅では全員Lv1から。建物はすべて最初から建築可能になる。</div>
    </article>
  `;
  els.commandArea.innerHTML = `
    <button type="button" data-ending-restart>クリア特典で最初から</button>
  `;
  els.commandArea.querySelector("[data-ending-restart]").addEventListener("click", restartWithClearBonus);
}

function renderStatus() {
  els.statusContent.innerHTML = `
    <table class="status-table">
      <thead>
        <tr>
          <th>名前</th>
          <th>職業</th>
          <th>Lv</th>
          <th>HP</th>
          <th>AP</th>
          <th>状態</th>
          <th>配置</th>
          <th>射程</th>
          <th>攻撃</th>
          <th>属性</th>
          <th>物防</th>
          <th>魔防</th>
          <th>敏捷</th>
          <th>内政</th>
          <th>経験値</th>
        </tr>
      </thead>
      <tbody>
        ${state.members.map((member) => `
          <tr>
            <td>${member.name}</td>
            <td>${member.job}</td>
            <td>${member.level}</td>
            <td>${member.hp}/${member.maxHp}</td>
            <td>${member.mp}/${member.maxMp}</td>
            <td>${statusSummary(member)}</td>
            <td>${member.positionType}</td>
            <td>${attackRange(member)}</td>
            <td>${member.atk}</td>
            <td>${attackTypeLabel(member)}</td>
            <td>${member.pDef}</td>
            <td>${member.mDef}</td>
            <td>${member.agi}</td>
            <td>${member.policy}</td>
            <td>${member.exp}/${member.level * 22}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function totalGrowthItemCount() {
  return GROWTH_ITEM_KEYS.reduce((sum, key) => sum + (state.items[key] || 0), 0);
}

function firstOwnedGrowthItemKey() {
  return GROWTH_ITEM_KEYS.find((key) => (state.items[key] || 0) > 0) || GROWTH_ITEM_KEYS[0];
}

function renderItems() {
  if (!(state.items[selectedGrowthItemKey] > 0) && totalGrowthItemCount() > 0) {
    selectedGrowthItemKey = firstOwnedGrowthItemKey();
  }

  const selectedItem = GROWTH_ITEMS[selectedGrowthItemKey];
  els.itemsContent.innerHTML = `
    <section class="item-list-panel">
      <div class="formation-panel-title">所持品</div>
      <div class="item-list">
        ${GROWTH_ITEM_KEYS.map((key) => {
          const item = GROWTH_ITEMS[key];
          const selected = key === selectedGrowthItemKey ? "selected" : "";
          return `
            <button type="button" class="item-select ${selected}" data-select-item="${key}">
              <span>${item.name}</span>
              <span>${state.items[key] || 0}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
    <section class="item-target-panel">
      <div class="formation-panel-title">${selectedItem.name} / ${selectedItem.description}</div>
      <table class="item-target-table">
        <thead>
          <tr>
            <th>名前</th>
            <th>職</th>
            <th>HP</th>
            <th>攻撃</th>
            <th>敏捷</th>
            <th>物防</th>
            <th>魔防</th>
            <th>使用</th>
          </tr>
        </thead>
        <tbody>
          ${state.members.map((member, memberIndex) => `
            <tr>
              <td>${member.name}</td>
              <td class="job-symbol-cell">${jobShortLabel(member)}</td>
              <td>${member.maxHp}</td>
              <td>${member.atk}</td>
              <td>${member.agi}</td>
              <td>${member.pDef}</td>
              <td>${member.mDef}</td>
              <td>
                <button type="button" data-use-item="${selectedGrowthItemKey}" data-member="${memberIndex}" ${(state.items[selectedGrowthItemKey] || 0) > 0 ? "" : "disabled"}>
                  使う
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;

  els.itemsContent.querySelectorAll("[data-select-item]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGrowthItemKey = button.dataset.selectItem;
      renderItems();
    });
  });
  els.itemsContent.querySelectorAll("[data-use-item]").forEach((button) => {
    button.addEventListener("click", () => {
      useGrowthItem(button.dataset.useItem, Number(button.dataset.member));
    });
  });
}

function useGrowthItem(itemKey, memberIndex) {
  const item = GROWTH_ITEMS[itemKey];
  const member = state.members[memberIndex];
  if (!item || !member || !(state.items[itemKey] > 0)) return;

  state.items[itemKey] -= 1;
  member[item.stat] += item.amount;
  if (item.stat === "maxHp") {
    member.hp += item.amount;
  }
  addLog(`${member.name}に${item.name}を使った。${item.description}。`);
  render();
}

function renderShop() {
  els.shopGold.textContent = `${state.gold} G`;
  els.shopContent.innerHTML = `
    ${renderShopBulkActions()}
    <table class="shop-table">
      <thead>
        <tr>
          <th>名前</th>
          <th>職業</th>
          <th>Lv</th>
          <th>武器</th>
          <th>防具</th>
          <th>攻撃</th>
          <th>物防</th>
          <th>魔防</th>
          <th>武器強化</th>
          <th>防具強化</th>
        </tr>
      </thead>
      <tbody>
        ${state.members.map((member, memberIndex) => renderShopRow(member, memberIndex)).join("")}
      </tbody>
    </table>
  `;
  els.shopContent.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => upgradeEquipment(button.dataset.upgrade, Number(button.dataset.member)));
  });
  els.shopContent.querySelectorAll("[data-bulk-upgrade]").forEach((button) => {
    button.addEventListener("click", () => bulkUpgradeEquipment(button.dataset.bulkUpgrade));
  });
}

function renderShopBulkActions() {
  return `
    <div class="shop-bulk-actions">
      ${["weapon", "armor", "all"].map((scope) => renderShopBulkButton(scope)).join("")}
    </div>
  `;
}

function renderShopBulkButton(scope) {
  const plan = bulkEquipmentUpgradePlan(scope);
  if (plan.targetGrade === null) {
    return `<button type="button" data-bulk-upgrade="${scope}" disabled>${bulkUpgradeScopeLabel(scope)} 最大</button>`;
  }

  const targetGrade = equipmentGrades[plan.targetGrade];
  return `
    <button type="button" data-bulk-upgrade="${scope}">
      ${bulkUpgradeScopeLabel(scope)} ${targetGrade.name}製へ ${plan.totalCost}G
    </button>
  `;
}

function renderShopRow(member, memberIndex) {
  const nextWeapon = nextEquipmentGrade(member, "weapon");
  const nextArmor = nextEquipmentGrade(member, "armor");
  return `
    <tr>
      <td>${member.name}</td>
      <td>${member.job}</td>
      <td>${member.level}</td>
      <td>${member.weapon}</td>
      <td>${member.armor}</td>
      <td>${member.atk}</td>
      <td>${member.pDef}</td>
      <td>${member.mDef}</td>
      <td>
        <button type="button" data-upgrade="weapon" data-member="${memberIndex}" ${nextWeapon ? "" : "disabled"}>
          ${nextWeapon ? `${nextWeapon.name}製 ${nextWeapon.price}G` : "最大"}
        </button>
      </td>
      <td>
        <button type="button" data-upgrade="armor" data-member="${memberIndex}" ${nextArmor ? "" : "disabled"}>
          ${nextArmor ? `${nextArmor.name}製 ${nextArmor.price}G` : "最大"}
        </button>
      </td>
    </tr>
  `;
}

function renderFormation() {
  els.formationContent.innerHTML = `
    <section class="formation-party-panel">
      <div class="formation-panel-title">編成中</div>
      ${renderFormationPartyRow("前衛", "front", state.formation.front)}
      ${renderFormationPartyRow("後衛", "back", state.formation.back)}
    </section>
    ${renderFormationBench(state.members.filter((member) => !getMemberRow(member)))}
  `;

  els.formationContent.querySelectorAll("[data-drag-member]").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.dragMember);
      event.dataTransfer.effectAllowed = "move";
    });
  });
  els.formationContent.querySelectorAll("[data-drop-member]").forEach((target) => {
    target.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      target.classList.add("drag-over");
    });
    target.addEventListener("dragleave", () => {
      target.classList.remove("drag-over");
    });
    target.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearFormationDragOver();
      handleFormationMemberDrop(draggedFormationMemberIndex(event), Number(target.dataset.dropMember));
    });
  });
  els.formationContent.querySelectorAll("[data-drop-zone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      clearFormationDragOver();
      handleFormationDrop(draggedFormationMemberIndex(event), zone.dataset.dropZone);
    });
  });
}

function renderFormationPartyRow(label, zone, members) {
  return `
    <section class="party-row formation-drop-row" data-drop-zone="${zone}">
      <div class="party-row-title">${label}</div>
      <div class="party-row-grid">
        ${members.map(renderFormationMemberCard).join("") || `<div class="empty-slot">空き</div>`}
      </div>
    </section>
  `;
}

function renderFormationMemberCard(member) {
  const memberIndex = state.members.indexOf(member);
  const active = state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member;
  return `
    <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""}" draggable="true" data-drag-member="${memberIndex}" data-drop-member="${memberIndex}">
      <div class="name-line">
        <span class="name-with-icon">${renderMemberSprite(member)}<span>${member.name}</span></span>
        ${renderMemberMeta(member, `Lv ${member.level}`)}
      </div>
      <div class="stat-line">HP ${member.hp}/${member.maxHp} / 射程 ${attackRange(member)}</div>
      <div class="stat-line">AP ${member.mp}/${member.maxMp}</div>
    </article>
  `;
}

function renderFormationBench(members) {
  const sortedMembers = sortFormationBenchMembers(members);
  return `
    <section class="formation-zone bench-zone" data-drop-zone="bench">
      <div class="formation-zone-title">待機</div>
      <table class="formation-table">
        <thead>
          <tr>
            <th>名前</th>
            <th>職</th>
            <th>HP</th>
            <th>AP</th>
            <th>配置</th>
            <th>射程</th>
            <th>攻撃力</th>
            <th>属性</th>
            <th>物防</th>
            <th>魔防</th>
            <th>敏捷</th>
          </tr>
        </thead>
        <tbody>
          ${sortedMembers.map((member) => renderFormationRow(member, state.members.indexOf(member), "bench")).join("") || `
            <tr>
              <td colspan="11" class="empty-table-cell">空き</td>
            </tr>
          `}
        </tbody>
      </table>
    </section>
  `;
}

function sortFormationBenchMembers(members) {
  return members
    .map((member, order) => ({ member, order }))
    .sort((a, b) => formationBenchRank(a.member) - formationBenchRank(b.member) || a.order - b.order)
    .map(({ member }) => member);
}

function formationBenchRank(member) {
  if (member.hp <= 0) return 2;
  if (member.mp <= 0) return 1;
  return 0;
}

function formationBenchStateClass(member) {
  if (member.hp <= 0) return "bench-hp-empty";
  if (member.mp <= 0) return "bench-ap-empty";
  return "";
}

function formationBenchPositionClass(member) {
  if (member.positionType === "後衛") return "bench-back-row";
  if (member.positionType === "両方") return "bench-both-row";
  return "";
}

function renderFormationRow(member, memberIndex, zone) {
    const row = getMemberRow(member);
    const inParty = Boolean(row);
    const benchStateClass = zone === "bench" ? formationBenchStateClass(member) : "";
    const benchPositionClass = zone === "bench" ? formationBenchPositionClass(member) : "";
    return `
      <tr class="${inParty ? "in-party" : ""} ${benchPositionClass} ${benchStateClass}" draggable="true" data-drag-member="${memberIndex}" data-drop-member="${memberIndex}">
        <td>${member.name}</td>
        <td class="formation-job-symbol">${jobShortLabel(member)}</td>
        <td>${member.hp}/${member.maxHp}</td>
        <td>${member.mp}/${member.maxMp}</td>
        <td>${member.positionType}</td>
        <td>${attackRange(member)}</td>
        <td>${member.atk}</td>
        <td>${attackTypeLabel(member)}</td>
        <td>${member.pDef}</td>
        <td>${member.mDef}</td>
        <td>${member.agi}</td>
      </tr>
    `;
}

addLog("闇豚の十の塔に挑む。探索では帰るまでダンジョンに留まれる。");
updateOpeningDifficultyButtons();
startPolicyTurn();
render();
