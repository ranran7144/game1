const TOWERS = [
  { name: "初めの塔", floors: 15, enemyRows: ["front"] },
  { name: "2番目の塔", floors: 20, enemyRows: ["front"] },
  { name: "影の塔", floors: 10, enemyRows: ["front", "back"] },
  { name: "4番目の塔", floors: 15, enemyRows: ["front", "back"] }
];
const TOTAL_FLOORS = TOWERS.reduce((sum, tower) => sum + tower.floors, 0);
const MAX_ROW_SIZE = 3;
const MAX_MEMBER_COUNT = 40;
const SAVE_KEY_PREFIX = "ai-jrpg-save-v1-slot";
const SAVE_SLOT_COUNT = 10;
const TAVERN_RECRUIT_COST_BASE = 5;
const TAVERN_EXPANSION_COST = 20;
const HUNTER_GUILD_BUILD_COSTS = [15, 50, 100, 150, 200, 250, 300, 350, 400, 500];
const HUNTER_GUILD_MAX_LEVEL = HUNTER_GUILD_BUILD_COSTS.length;
const THIEF_GUILD_BUILD_COSTS = [15, 50, 100, 150, 200, 250, 300, 350, 400, 500];
const THIEF_GUILD_MAX_LEVEL = THIEF_GUILD_BUILD_COSTS.length;
const BGM_SETTING_KEY = "ai-jrpg-bgm-volume";
const BGM_DEFAULT_LEVEL = 5;
const BGM_MAX_LEVEL = 10;
const BGM_TRACKS = {
  policy: { name: "街", src: "audio/bgm/town.mp3" },
  dungeon: { name: "探索", src: "audio/bgm/dungeon.mp3" },
  battle: { name: "戦闘", src: "audio/bgm/dungeon.mp3" },
  event: { name: "イベント", src: "audio/bgm/event.mp3" }
};
const PHASE_LABELS = {
  policy: "内政",
  dungeon: "探索",
  event: "イベント"
};
const ATTACK_TYPE_LABELS = {
  physical: "物理",
  magic: "魔法",
  both: "両方"
};
const HEAL_AP_COST = 1;
const OFFENSIVE_SPELL_AP_COST = 2;
const GROWTH_ITEM_DROP_RATE = 0.03;
const GROWTH_ITEMS = {
  hp: { name: "いのちの種", stat: "maxHp", amount: 3, description: "最大HP +3" },
  atk: { name: "力の種", stat: "atk", amount: 1, description: "攻撃 +1" },
  agi: { name: "すばやさの種", stat: "agi", amount: 1, description: "敏捷 +1" },
  pDef: { name: "守りの種", stat: "pDef", amount: 1, description: "物防 +1" },
  mDef: { name: "魔防の種", stat: "mDef", amount: 1, description: "魔防 +1" }
};
const GROWTH_ITEM_KEYS = Object.keys(GROWTH_ITEMS);
const CHARACTER_IMAGE_PATHS = {
  アルス: "assets/characters/ars.png",
  ガロン: "assets/characters/garon.png",
  ミリア: "assets/characters/miria.png",
  セネカ: "assets/characters/seneca.png",
  リオ: "assets/characters/rio.png",
  ノルン: "assets/characters/norn.png",
  エルマ: "assets/characters/elma.png",
  ダリオ: "assets/characters/dario.png",
  サイラス: "assets/characters/cyrus.png",
  フィオナ: "assets/characters/fiona.png",
  ブラン: "assets/characters/bran.png",
  ユナ: "assets/characters/yuna.png"
};
const MEMBER_SPRITE_FALLBACKS = {
  狩人: "盗賊"
};

const state = {
  turn: 1,
  phase: "policy",
  towerIndex: 0,
  floor: 1,
  clearedFloor: 0,
  gold: 0,
  policyPoints: 0,
  tavernExpanded: false,
  hunterGuildLevel: 0,
  thiefGuildLevel: 0,
  inBattle: false,
  townPlace: "gate",
  activeMemberIndex: 0,
  activeActor: null,
  actionQueue: [],
  preemptiveRoundPending: false,
  enemies: [],
  pendingDamageEffects: [],
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
  locationName: document.querySelector("#locationName"),
  towerProgress: document.querySelector("#towerProgress"),
  travelActions: document.querySelector("#travelActions"),
  statusBtn: document.querySelector("#statusBtn"),
  formationBtn: document.querySelector("#formationBtn"),
  itemsBtn: document.querySelector("#itemsBtn"),
  saveBtn: document.querySelector("#saveBtn"),
  loadBtn: document.querySelector("#loadBtn"),
  bgmBtn: document.querySelector("#bgmBtn"),
  partyTitle: document.querySelector("#partyTitle"),
  closeStatusBtn: document.querySelector("#closeStatusBtn"),
  closeFormationBtn: document.querySelector("#closeFormationBtn"),
  closeItemsBtn: document.querySelector("#closeItemsBtn"),
  closeShopBtn: document.querySelector("#closeShopBtn"),
  statusDialog: document.querySelector("#statusDialog"),
  formationDialog: document.querySelector("#formationDialog"),
  itemsDialog: document.querySelector("#itemsDialog"),
  shopDialog: document.querySelector("#shopDialog"),
  statusContent: document.querySelector("#statusContent"),
  formationContent: document.querySelector("#formationContent"),
  itemsContent: document.querySelector("#itemsContent"),
  shopContent: document.querySelector("#shopContent"),
  shopGold: document.querySelector("#shopGold"),
  party: document.querySelector("#party"),
  battleTitle: document.querySelector("#battleTitle"),
  gold: document.querySelector("#gold"),
  enemyArea: document.querySelector("#enemyArea"),
  commandArea: document.querySelector("#commandArea"),
  log: document.querySelector("#log")
};

els.statusBtn.addEventListener("click", openStatus);
els.closeStatusBtn.addEventListener("click", () => els.statusDialog.close());
els.formationBtn.addEventListener("click", openFormation);
els.closeFormationBtn.addEventListener("click", () => els.formationDialog.close());
els.itemsBtn.addEventListener("click", openItems);
els.closeItemsBtn.addEventListener("click", () => els.itemsDialog.close());
els.closeShopBtn.addEventListener("click", () => els.shopDialog.close());
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
  const pattern = spritePatterns[patternName] || spritePatterns.勇者;
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
  normalizeCombatStats([member]);

  const gradeKey = kind === "weapon" ? "weaponGrade" : "armorGrade";
  const bonusKey = kind === "weapon" ? "weaponAtk" : "armorDef";
  const baseKey = kind === "weapon" ? "weaponBase" : "armorBase";
  const equipKey = kind;
  const currentGrade = member[gradeKey] || 0;
  const nextGrade = equipmentGrades[currentGrade + 1];

  if (!nextGrade) {
    addLog(`${member.name}の${kind === "weapon" ? "武器" : "防具"}はこれ以上強化できない。`);
    render();
    return;
  }
  if (state.gold < nextGrade.price) {
    addLog("ゴールドが足りない。");
    render();
    return;
  }

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

  addLog(`${member.name}の${kind === "weapon" ? "武器" : "防具"}を${nextGrade.name}製に強化した。`);
  render();
}

function fullHeal() {
  state.members.forEach((member) => {
    member.hp = member.maxHp;
    member.mp = member.maxMp;
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
  return [...startingMembers, ...recruitableMembers, ...tavernExpansionMembers, ...monsters];
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
      actor.normalAttackPattern = actor.name === "ノルン" ? "pierce-column" : "single";
    }
    if (!actor.spellPattern) {
      actor.spellPattern = actor.name === "セネカ"
        ? "row"
        : actor.name === "サイラス"
        ? "pierce-column"
        : "single";
    }
    if (!actor.spellName) {
      if (actor.name === "セネカ") actor.spellName = "フレイム";
      if (actor.name === "サイラス") actor.spellName = "ファイア";
    }
  });
}

function attackTypeLabel(actor) {
  normalizeCombatStats([actor]);
  return ATTACK_TYPE_LABELS[actor.attackType] || ATTACK_TYPE_LABELS.physical;
}

function livingActorsInRow(actors, row, rowOf) {
  return actors.filter((actor) => actor.hp > 0 && rowOf(actor) === row);
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

function enemyColumn(enemy) {
  const row = rowOfEnemy(enemy);
  return state.enemies
    .filter((entry) => rowOfEnemy(entry) === row)
    .indexOf(enemy);
}

function normalAttackPattern(member) {
  return member?.normalAttackPattern || "single";
}

function normalAttackLabel(member) {
  return normalAttackPattern(member) === "pierce-column" ? "槍貫通" : "攻撃";
}

function normalAttackTargets(member, primaryTarget) {
  if (!primaryTarget || primaryTarget.hp <= 0) return [];
  if (normalAttackPattern(member) !== "pierce-column") return [primaryTarget];

  return livingEnemiesInColumn(primaryTarget);
}

function livingEnemiesInColumn(primaryTarget) {
  const column = enemyColumn(primaryTarget);
  return state.enemies.filter((enemy) =>
    enemy.hp > 0 && enemyColumn(enemy) === column
  );
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

function spellTargets(member, primaryTarget) {
  if (!primaryTarget || primaryTarget.hp <= 0) return [];
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
  if (els.statusDialog.open) els.statusDialog.close();
  state.enemies = createEnemies(isBoss);
  state.pendingDamageEffects = [];
  state.preemptiveRoundPending = Math.random() < preemptiveAttackRate();
  addLog(isBoss ? "最上階の主が立ちはだかった！" : "魔物があらわれた！");
  if (state.preemptiveRoundPending) {
    addLog("先制攻撃！ 初回ラウンドは敵が動けない。");
  }
  startActionRound();
  advanceBattleTurn();
  render();
}

function createEnemies(isBoss) {
  const rows = enemyRowsForCurrentTower();
  if (isBoss) {
    const bossName = isFinalTowerFloor() ? "天塔竜" : "塔の番人";
    const bossStats = isFinalTowerFloor()
      ? { name: bossName, attackType: "both", range: 3, hp: 1070, mp: 16, atk: 22, pDef: 10, mDef: 12, agi: 8, exp: 180, gold: 250 }
      : { name: bossName, attackType: "physical", range: 1, hp: 95, mp: 10, atk: 17, pDef: 7, mDef: 4, agi: 5, exp: 80, gold: 90 };
    return [makeEnemy(bossStats, "front", true)];
  }

  const maxEnemies = rows.length * MAX_ROW_SIZE;
  const maxRoll = rows.length > 1 ? maxEnemies : (currentTotalFloor() > 12 ? 3 : 2);
  const count = Math.min(maxEnemies, 1 + Math.floor(Math.random() * maxRoll));
  return Array.from({ length: count }, (_, enemySlot) => {
    const index = Math.min(monsters.length - 1, Math.floor(currentTotalFloor() / 10) + Math.floor(Math.random() * 2));
    const row = rows[Math.min(rows.length - 1, Math.floor(enemySlot / MAX_ROW_SIZE))] || "front";
    return makeEnemy(monsters[index], row);
  });
}

function enemyRowsForCurrentTower() {
  return currentTower().enemyRows || ["front", "back"];
}

function makeEnemy(template, row = "front", isBoss = false) {
  const scale = 1 + Math.floor(currentTotalFloor() / 8) * 0.18;
  const maxHp = Math.round(template.hp * scale);
  const maxMp = Math.max(0, Math.round(Number(template.mp || template.maxMp || 0) * scale));
  return {
    ...template,
    isBoss,
    row,
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
  if ((kind === "attack" || kind === "spell") && (!enemyTarget || enemyTarget.hp <= 0)) {
    addLog("攻撃する相手を選べない。");
    render();
    return;
  }
  if ((kind === "attack" || kind === "spell") && !reachableEnemies.includes(enemyTarget)) {
    addLog(`${member.name}の射程では届かない。`);
    render();
    return;
  }
  const allyTarget = kind === "heal"
    ? Number.isInteger(targetIndex)
      ? state.members[targetIndex]
      : mostWoundedAlly()
    : null;
  if (kind === "heal" && (!allyTarget || !state.party.includes(allyTarget) || allyTarget.hp <= 0)) {
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
  }

  if (kind === "heal") {
    if (member.mp < HEAL_AP_COST) {
      addLog(`${member.name}はAPが足りない。`);
    } else {
      member.mp -= HEAL_AP_COST;
      const amount = 18 + member.level * 3;
      allyTarget.hp = Math.min(allyTarget.maxHp, allyTarget.hp + amount);
      addLog(`${member.name}はヒールを唱えた。${allyTarget.name}のHPが${amount}回復。`);
    }
  }

  if (kind === "spell") {
    if (member.mp < OFFENSIVE_SPELL_AP_COST) {
      addLog(`${member.name}はAPが足りない。`);
    } else {
      const targets = spellTargets(member, enemyTarget);
      const results = targets.map((target) => {
        const damage = calculateDamage(18 + member.level * 4, target, member, "magic");
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

  advanceBattleTurn();
  render();
}

function startActionRound() {
  const skipEnemies = state.preemptiveRoundPending;
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
    if (state.party.every((member) => member.hp <= 0)) {
      loseBattle();
      return;
    }
    if (state.actionQueue.length === 0) {
      startActionRound();
    }

    const entry = state.actionQueue.shift();
    if (!entry || !canActorAct(entry)) continue;

    state.activeActor = entry;
    if (entry.type === "party") {
      state.activeMemberIndex = state.party.indexOf(entry.actor);
      return;
    }

    enemyAct(entry.actor);
  }
}

function canActorAct(entry) {
  if (entry.actor.hp <= 0) return false;
  if (entry.type === "party") return state.party.includes(entry.actor);
  return state.enemies.includes(entry.actor);
}

function enemyAct(enemy) {
  const targets = reachableTargets(enemy, rowOfEnemy(enemy), state.party, getMemberRow);
  if (targets.length === 0) {
    addLog(`${enemy.name}は射程内に攻撃できる相手がいない。`);
    return;
  }

  const target = targets[Math.floor(Math.random() * targets.length)];
  const damage = calculateDamage(enemy.atk, target, enemy);
  spendAttackMp(enemy);
  dealDamage(target, damage);
  addLog(`${enemy.name}の攻撃。${target.name}に${damage}ダメージ。`);
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
  target.hp = Math.max(0, target.hp - damage);
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

function winBattle() {
  const exp = state.enemies.reduce((sum, enemy) => sum + enemy.exp, 0);
  const gold = state.enemies.reduce((sum, enemy) => sum + enemy.gold, 0);
  const droppedItems = rollGrowthItemDrops(state.enemies);
  state.gold += gold;
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.preemptiveRoundPending = false;
  state.enemies = [];
  state.clearedFloor = Math.max(state.clearedFloor, currentTotalFloor());

  addLog(`勝利！ 経験値${exp}、${gold}Gを手に入れた。`);
  droppedItems.forEach((itemKey) => {
    addLog(`${GROWTH_ITEMS[itemKey].name}を手に入れた。`);
  });
  awardBattleExperience(exp);

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
  } else {
    state.floor += 1;
    addLog(`${currentTower().name}${state.floor}階へ進めるようになった。帰るまでは探索ターンが続く。`);
    render();
    return;
  }

  state.phase = "event";
  state.townPlace = "gate";
  addLog("探索ターンを終え、イベントターンへ進む。");
  render();
}

function rollGrowthItemDrops(enemies) {
  return enemies
    .filter((enemy) => !enemy.isBoss)
    .flatMap(() => {
      if (Math.random() >= growthItemDropRate()) return [];
      const itemKey = GROWTH_ITEM_KEYS[Math.floor(Math.random() * GROWTH_ITEM_KEYS.length)];
      state.items[itemKey] = (state.items[itemKey] || 0) + 1;
      return [itemKey];
    });
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

function addTavernExpansionMembers() {
  const knownNames = new Set([...state.members, ...state.reserveMembers].map((member) => member.name));
  const newMembers = tavernExpansionMembers
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

function expandTavern() {
  if (state.inBattle || state.phase !== "policy" || state.townPlace !== "building") return;
  if (state.tavernExpanded) {
    addLog("酒場はすでに拡張済みだ。");
    render();
    return;
  }
  if (state.policyPoints < TAVERN_EXPANSION_COST) {
    addLog("内政Pが足りない。");
    render();
    return;
  }

  state.policyPoints -= TAVERN_EXPANSION_COST;
  state.tavernExpanded = true;
  const addedCount = addTavernExpansionMembers();
  addLog(`酒場を拡張した。新しい仲間候補が${addedCount}人集まった。`);
  render();
}

function hunterGuildUnlockFloor() {
  return TOWERS[0].floors + TOWERS[1].floors;
}

function thiefGuildUnlockFloor() {
  return TOWERS[0].floors;
}

function isThiefGuildUnlocked() {
  return state.clearedFloor >= thiefGuildUnlockFloor();
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
    addLog(`酒場に新しい盗賊が${addedCount}人集まった。`);
  }
  render();
}

function isHunterGuildUnlocked() {
  return state.clearedFloor >= hunterGuildUnlockFloor();
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
    addLog(`酒場に新しい狩人が${addedCount}人集まった。`);
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
  if (member.hp <= 0) member.hp = 1;
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
  state.preemptiveRoundPending = false;
  state.phase = "event";
  state.townPlace = "gate";
  state.enemies = [];
  addLog(`全滅した。所持Gを${lostGold}G失い、イベントターンへ移行した。`);
  render();
}

function resolveEvent() {
  const event = Math.floor(Math.random() * 3);
  if (event === 0) {
    const foundGold = 15 + currentTotalFloor() * 2;
    state.gold += foundGold;
    addLog(`イベントターン。商隊の護衛を手伝い、${foundGold}Gを得た。`);
    return;
  }
  if (event === 1) {
    state.party.forEach((member) => {
      member.hp = Math.min(member.maxHp, member.hp + 8 + currentTotalFloor());
    });
    addLog("イベントターン。旅の治療師に出会い、全員のHPが少し回復した。");
    return;
  }
  addLog("イベントターン。街道は静かだった。次の探索に備える。");
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

function handleFormationDrop(memberIndex, target) {
  if (target === "bench") {
    moveMemberToBench(memberIndex);
    return;
  }
  placeFormationMember(memberIndex, target);
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

function addLog(message) {
  const line = document.createElement("p");
  line.textContent = message;
  els.log.prepend(line);
}

function currentBgmTrack() {
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
    summary: `第${state.turn}T ${PHASE_LABELS[state.phase]} / ${state.gold}G / 仲間${state.members.length}人`,
    turn: state.turn,
    phase: state.phase,
    towerIndex: state.towerIndex,
    floor: state.floor,
    clearedFloor: state.clearedFloor,
    gold: state.gold,
    policyPoints: state.policyPoints,
    tavernExpanded: state.tavernExpanded,
    hunterGuildLevel: state.hunterGuildLevel,
    thiefGuildLevel: state.thiefGuildLevel,
    inBattle: state.inBattle,
    townPlace: state.townPlace,
    activeMemberIndex: state.activeMemberIndex,
    activeActor: serializeActionEntry(state.activeActor),
    actionQueue: state.actionQueue.map(serializeActionEntry).filter(Boolean),
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
  state.phase = payload.phase;
  state.towerIndex = payload.towerIndex;
  state.floor = payload.floor;
  state.clearedFloor = payload.clearedFloor;
  state.gold = payload.gold;
  state.policyPoints = payload.policyPoints;
  state.tavernExpanded = Boolean(payload.tavernExpanded);
  state.hunterGuildLevel = Math.min(HUNTER_GUILD_MAX_LEVEL, Math.max(0, Number(payload.hunterGuildLevel) || 0));
  state.thiefGuildLevel = Math.min(THIEF_GUILD_MAX_LEVEL, Math.max(0, Number(payload.thiefGuildLevel) || 0));
  state.inBattle = payload.inBattle;
  state.townPlace = payload.townPlace === "shop" ? "gate" : payload.townPlace;
  state.activeMemberIndex = payload.activeMemberIndex || 0;
  state.members = cloneData(payload.members || []);
  state.reserveMembers = cloneData(payload.reserveMembers || []);
  state.enemies = cloneData(payload.enemies || []);
  state.pendingDamageEffects = [];
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
  if (state.tavernExpanded) addTavernExpansionMembers();
  addHunterGuildMembersUpToLevel();
  addThiefGuildMembersUpToLevel();
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
    const activeMember = state.activeActor?.type === "party" ? state.activeActor.actor : null;
    const canTargetHeal = state.inBattle
      && activeMember
      && (activeMember.job === "僧侶" || activeMember.job === "勇者")
      && state.party.includes(member)
      && member.hp > 0;
    const memberActionButtons = [
      active ? `<button type="button" data-party-action="wait">待機</button>` : "",
      canTargetHeal ? `<button type="button" data-party-action="heal" data-ally="${index}" ${activeMember.mp >= HEAL_AP_COST ? "" : "disabled"}>回復</button>` : ""
    ].filter(Boolean).join("");
    const actionAreaClass = memberActionButtons ? "member-actions" : "member-actions empty-actions";
    return `
      <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""}" data-member-card="${index}">
        <div class="name-line">
          <span class="name-with-icon">${renderMemberSprite(member)}<span>${member.name}</span></span>
          <span>Lv ${member.level} / 射程 ${attackRange(member)}</span>
        </div>
        <div class="member-card-body">
          <div class="member-stats">
            <div class="stat-line">HP ${member.hp}/${member.maxHp}</div>
            <div class="stat-line">AP ${member.mp}/${member.maxMp}</div>
          </div>
          <div class="${actionAreaClass}" ${memberActionButtons ? "" : `aria-hidden="true"`}>
            ${memberActionButtons}
          </div>
        </div>
      </article>
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

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? `<div class="enemy-card town-card">
        <div class="name-line"><span>${currentTower().name}${state.floor}階</span><span>探索中</span></div>
        <div class="stat-line">登ると戦闘が始まる。帰るを選ぶまで、ダンジョン探索ターンは続く。</div>
      </div>`
    : state.enemies.map((enemy, enemyIndex) => {
      return `
        <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""}" data-enemy-card="${enemyIndex}">
          <div class="name-line">
            <span class="name-with-icon">${renderSprite(enemy.name, "monster")}<span>${enemy.name}</span></span>
            <span>${enemy.hp > 0 ? "敵" : "撃破"}</span>
          </div>
          <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / AP ${enemy.mp}/${enemy.maxMp} / 属性 ${attackTypeLabel(enemy)} / 物防 ${enemy.pDef} / 魔防 ${enemy.mDef}</div>
          <div class="stat-line">射程 ${attackRange(enemy)} / 敏捷 ${enemy.agi}</div>
          ${state.inBattle && enemy.hp > 0 ? `
            <div class="enemy-actions">
              <button type="button" data-target-action="attack" data-enemy="${enemyIndex}" ${member && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>${normalAttackLabel(member)}</button>
              <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>${spellButtonLabel(member)}</button>
              <button type="button" data-target-action="wait">待機</button>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");

  if (!state.inBattle) {
    els.commandArea.innerHTML = "";
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

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? `<div class="enemy-card town-card">
        <div class="name-line"><span>${currentTower().name}${state.floor}階</span><span>探索中</span></div>
        <div class="stat-line">登ると戦闘が始まる。帰るを選ぶまで、ダンジョン探索ターンは続く。</div>
      </div>`
    : renderEnemyRows(canSpell);

  if (!state.inBattle) {
    els.commandArea.innerHTML = "";
    return;
  }

  els.commandArea.innerHTML = "";
  bindEnemyTargetActions();
}

function renderEnemyRows(canSpell) {
  return `
    <section class="enemy-formation">
      ${renderEnemyRow("前列", "front", canSpell)}
      ${renderEnemyRow("後列", "back", canSpell)}
    </section>
  `;
}

function renderEnemyRow(label, row, canSpell) {
  const enemies = state.enemies
    .map((enemy, enemyIndex) => ({ enemy, enemyIndex }))
    .filter((entry) => (entry.enemy.row || "front") === row);
  if (enemies.length === 0 && row === "back") return "";

  return `
    <section class="enemy-row">
      <div class="party-row-title">${label}</div>
      <div class="enemy-row-grid">
        ${enemies.map(({ enemy, enemyIndex }) => renderEnemyCard(enemy, enemyIndex, canSpell)).join("") || `<div class="empty-slot">空き</div>`}
      </div>
    </section>
  `;
}

function renderEnemyCard(enemy, enemyIndex, canSpell) {
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canReach = member && activePartyReachableEnemies(member).includes(enemy);
  return `
    <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""}" data-enemy-card="${enemyIndex}">
      <div class="name-line">
        <span class="name-with-icon">${renderSprite(enemy.name, "monster")}<span>${enemy.name}</span></span>
        <span>${enemy.hp > 0 ? "敵" : "撃破"}</span>
      </div>
      <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / AP ${enemy.mp}/${enemy.maxMp} / 属性 ${attackTypeLabel(enemy)} / 物防 ${enemy.pDef} / 魔防 ${enemy.mDef}</div>
      <div class="stat-line">射程 ${attackRange(enemy)} / 敏捷 ${enemy.agi}</div>
      ${state.inBattle && enemy.hp > 0 ? `
        <div class="enemy-actions">
          <button type="button" data-target-action="attack" data-enemy="${enemyIndex}" ${canReach ? "" : "disabled"}>${normalAttackLabel(member)}</button>
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

    if (!["attack", "spell"].includes(button.dataset.targetAction)) return;

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

function renderTown() {
  els.battleTitle.textContent = state.townPlace === "tower"
    ? "探索先選択"
    : state.townPlace === "tavern"
    ? "内政: 酒場"
    : state.townPlace === "building"
    ? "内政: 建築"
    : "内政ターン";
  els.enemyArea.innerHTML = state.townPlace === "tower"
    ? TOWERS.map((tower, towerIndex) => isTowerUnlocked(towerIndex) ? `
      <article class="enemy-card">
        <div class="name-line"><span>${tower.name}</span><span>${tower.floors}階</span></div>
        <div class="stat-line">1階から探索を開始する。</div>
        <div class="shop-buyers">
          <button type="button" data-tower="${towerIndex}">探索する</button>
        </div>
      </article>
    ` : "").join("")
    : state.townPlace === "tavern"
    ? renderTavern()
    : state.townPlace === "building"
    ? renderBuilding()
    : `<div class="enemy-card town-card">街で次の探索に備える。酒場で仲間を募るか、武器防具を強化するか、建築で街を整えるか、探索へ出発できる。</div>`;

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
    });
  });
  const backButton = els.commandArea.querySelector('[data-town="gate"]');
  if (backButton) backButton.addEventListener("click", returnTownGate);
}

function renderBuilding() {
  const canExpand = !state.tavernExpanded && state.policyPoints >= TAVERN_EXPANSION_COST;
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
  return `
    <article class="enemy-card town-card">
      <div class="name-line">
        <span>酒場拡張</span>
        <span>${state.tavernExpanded ? "完成" : "建築"}</span>
      </div>
      <div class="stat-line">
        ${state.tavernExpanded
          ? "酒場は拡張済み。追加の仲間候補が酒場に集まっている。"
          : `${TAVERN_EXPANSION_COST}内政Pで酒場を広げ、新しい仲間候補${tavernExpansionMembers.length}人を呼び込む。`}
      </div>
      <div class="stat-line">現在の内政P ${state.policyPoints}</div>
      <div class="shop-buyers">
        <button type="button" data-build="tavern" ${canExpand ? "" : "disabled"}>
          ${state.tavernExpanded ? "拡張済み" : `建築 ${TAVERN_EXPANSION_COST}内政P`}
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
          ? `盗賊を酒場へ呼び、先制攻撃率を上げる。現在 ${formatPercent(preemptiveAttackRate())}。`
          : "1番目の塔を踏破すると建築できる。"}
      </div>
      <div class="stat-line">
        ${thiefUnlocked
          ? thiefMaxed
            ? "最大Lv。これ以上は増築できない。"
            : `次の${thiefNextLabel}: ${thiefNextCost}内政P / Lv1・4・7・10で盗賊追加`
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
          ? `狩人を酒場へ呼び、アイテムドロップ率を上げる。現在 ${formatPercent(growthItemDropRate())}。`
          : "2番目の塔を踏破すると建築できる。"}
      </div>
      <div class="stat-line">
        ${hunterUnlocked
          ? hunterMaxed
            ? "最大Lv。これ以上は増築できない。"
            : `次の${hunterNextLabel}: ${hunterNextCost}内政P / Lv1・4・7・10で狩人追加`
          : "建築費: 15内政P"}
      </div>
      <div class="shop-buyers">
        <button type="button" data-build="hunter-guild" ${canUpgradeHunterGuild ? "" : "disabled"}>
          ${hunterMaxed ? "最大Lv" : hunterUnlocked ? `${hunterNextLabel} ${hunterNextCost}内政P` : "2番目の塔踏破後"}
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
        : state.tavernExpanded || state.hunterGuildLevel > 0 || state.thiefGuildLevel > 0
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
}

function renderShopRow(member, memberIndex) {
  const nextWeapon = equipmentGrades[(member.weaponGrade || 0) + 1];
  const nextArmor = equipmentGrades[(member.armorGrade || 0) + 1];
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
      zone.classList.remove("drag-over");
      handleFormationDrop(Number(event.dataTransfer.getData("text/plain")), zone.dataset.dropZone);
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
    <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""}" draggable="true" data-drag-member="${memberIndex}">
      <div class="name-line">
        <span class="name-with-icon">${renderMemberSprite(member)}<span>${member.name}</span></span>
        <span>Lv ${member.level}</span>
      </div>
      <div class="stat-line">HP ${member.hp}/${member.maxHp} / 射程 ${attackRange(member)}</div>
      <div class="stat-line">AP ${member.mp}/${member.maxMp}</div>
    </article>
  `;
}

function renderFormationBench(members) {
  return `
    <section class="formation-zone bench-zone" data-drop-zone="bench">
      <div class="formation-zone-title">待機</div>
      <table class="formation-table">
        <thead>
          <tr>
            <th>名前</th>
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
          ${members.map((member) => renderFormationRow(member, state.members.indexOf(member), "bench")).join("") || `
            <tr>
              <td colspan="10" class="empty-table-cell">空き</td>
            </tr>
          `}
        </tbody>
      </table>
    </section>
  `;
}

function renderFormationRow(member, memberIndex, zone) {
    const row = getMemberRow(member);
    const inParty = Boolean(row);
    return `
      <tr class="${inParty ? "in-party" : ""}" draggable="true" data-drag-member="${memberIndex}">
        <td><span class="name-with-icon">${renderMemberSprite(member)}<span>${member.name}</span></span></td>
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

addLog("初めの塔と2番目の塔に挑む。探索では帰るまでダンジョンに留まれる。");
startPolicyTurn();
render();
