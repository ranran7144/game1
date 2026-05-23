const TOWERS = [
  { name: "初めの塔", floors: 30 },
  { name: "2番目の塔", floors: 20 }
];
const TOTAL_FLOORS = TOWERS.reduce((sum, tower) => sum + tower.floors, 0);
const MAX_ROW_SIZE = 3;
const MAX_MEMBER_COUNT = 40;
const PHASE_LABELS = {
  policy: "内政",
  dungeon: "探索",
  event: "イベント"
};

const startingMembers = [
  { name: "アルス", job: "勇者", positionType: "両方", level: 1, hp: 34, maxHp: 34, mp: 8, maxMp: 8, atk: 8, def: 4, agi: 8, policy: 3, exp: 0, weapon: "銅の剣", armor: "旅人の服", weaponAtk: 0, armorDef: 0 },
  { name: "ガロン", job: "戦士", positionType: "前衛", level: 1, hp: 42, maxHp: 42, mp: 0, maxMp: 0, atk: 10, def: 6, agi: 5, policy: 1, exp: 0, weapon: "こんぼう", armor: "革の鎧", weaponAtk: 0, armorDef: 0 }
];

const recruitableMembers = [
  { name: "ミリア", job: "僧侶", positionType: "後衛", level: 1, hp: 28, maxHp: 28, mp: 14, maxMp: 14, atk: 5, def: 3, agi: 6, policy: 4, exp: 0, weapon: "樫の杖", armor: "布のローブ", weaponAtk: 0, armorDef: 0, joinFloor: 8 },
  { name: "セネカ", job: "魔法使い", positionType: "後衛", level: 1, hp: 24, maxHp: 24, mp: 18, maxMp: 18, atk: 4, def: 2, agi: 7, policy: 5, exp: 0, weapon: "短い杖", armor: "魔法のローブ", weaponAtk: 0, armorDef: 0, joinFloor: 16 },
  { name: "リオ", job: "盗賊", positionType: "両方", level: 1, hp: 30, maxHp: 30, mp: 4, maxMp: 4, atk: 7, def: 3, agi: 12, policy: 2, exp: 0, weapon: "短剣", armor: "身軽な服", weaponAtk: 0, armorDef: 0, joinFloor: 24 },
  { name: "ノルン", job: "騎士", positionType: "前衛", level: 1, hp: 38, maxHp: 38, mp: 0, maxMp: 0, atk: 9, def: 7, agi: 4, policy: 2, exp: 0, weapon: "槍", armor: "鎖かたびら", weaponAtk: 0, armorDef: 0, joinFloor: 32 }
];

const state = {
  turn: 1,
  phase: "policy",
  towerIndex: 0,
  floor: 1,
  clearedFloor: 0,
  gold: 0,
  policyPoints: 0,
  inBattle: false,
  townPlace: "gate",
  activeMemberIndex: 0,
  activeActor: null,
  actionQueue: [],
  enemies: [],
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

const monsters = [
  { name: "スライム", hp: 12, atk: 5, def: 1, agi: 5, exp: 4, gold: 3 },
  { name: "こうもり", hp: 15, atk: 6, def: 2, agi: 11, exp: 7, gold: 6 },
  { name: "ゴブリン", hp: 22, atk: 8, def: 3, agi: 6, exp: 9, gold: 8 },
  { name: "まどうし", hp: 26, atk: 10, def: 2, agi: 7, exp: 14, gold: 13 },
  { name: "塔の番人", hp: 42, atk: 14, def: 5, agi: 4, exp: 25, gold: 24 }
];

const shopItems = [
  { name: "鉄の剣", type: "weapon", price: 60, atk: 4, def: 0 },
  { name: "鋼の剣", type: "weapon", price: 160, atk: 8, def: 0 },
  { name: "鉄の鎧", type: "armor", price: 80, atk: 0, def: 4 },
  { name: "鋼の鎧", type: "armor", price: 180, atk: 0, def: 8 }
];

const spritePalettes = {
  hero: { k: "#171410", s: "#f0bf82", h: "#6f462a", b: "#477bd3", y: "#f3d47c", w: "#f4f0e8", r: "#b9473f", g: "#5ac184", p: "#8f6bd8", m: "#7e7465", c: "#64a8e8", n: "#2f5f8f", o: "#d98445", l: "#efe0b4" },
  monster: { k: "#171410", a: "#5ac184", b: "#3e8f68", c: "#f4f0e8", d: "#b9473f", e: "#64a8e8", f: "#8f6bd8", y: "#f3d47c", m: "#7e7465" }
};

const spritePatterns = {
  勇者: [
    "................",
    "......yyyy......",
    ".....yyyyyy.....",
    ".....hhhhhh.....",
    "....hssssssh....",
    "....swsswss....",
    "....ssrrss......",
    ".....srrrr......",
    "....bbbbbbbk....",
    "...bybbbbbk.....",
    "..bbybbbb.......",
    "....bbbb........",
    "....b..b........",
    "...kk..kk.......",
    "................",
    "................"
  ],
  戦士: [
    "................",
    ".....mmmmmm.....",
    "....mkkkkkkm....",
    "....mssssssm....",
    "....swswwss.....",
    "....ssssss......",
    "...rrrrrrrr.....",
    "..rmmmmmmrkk....",
    "..rmmmmmmrk.....",
    "...rrrrrr.......",
    "....bbbb........",
    "...bb..bb.......",
    "...kk..kk.......",
    "................",
    "................",
    "................"
  ],
  僧侶: [
    "................",
    "......wwww......",
    ".....wwyyww.....",
    ".....wssssw.....",
    ".....swswss.....",
    ".....ssssss.....",
    "....wwwpwww.....",
    "...wwwwpwww.....",
    "...wwwppwww.....",
    "....wwpww.......",
    "....bb.bb.......",
    "...kk..kk.......",
    "................",
    "................",
    "................",
    "................"
  ],
  魔法使い: [
    "................",
    ".......p........",
    "......ppp.......",
    ".....ppppp......",
    "....ppppppp.....",
    "......hhhh......",
    ".....swswss.....",
    ".....ssssss.....",
    "....ppppppp.....",
    "...ppppppppp....",
    "....pppppp......",
    "....bb..bb......",
    "...kk....kk.....",
    "................",
    "................",
    "................"
  ],
  盗賊: [
    "................",
    ".....kkkkkk.....",
    "....kggggggk....",
    "....gssssssg....",
    "....swswss......",
    "....ssssss......",
    "...gggggggg.....",
    "..ggrgggggkk....",
    "...gggggg.......",
    "....gggg........",
    "...bb..bb.......",
    "..kk....kk......",
    "................",
    "................",
    "................",
    "................"
  ],
  騎士: [
    "................",
    ".....wwwwww.....",
    "....wmmmmmmw....",
    "....mssssssm....",
    "....swswwss.....",
    "....ssssss......",
    "...wwwwwwww.....",
    "..wwwwwwwwkk....",
    "...wwwwww.......",
    "....wwww........",
    "...bb..bb.......",
    "..kk....kk......",
    "................",
    "................",
    "................",
    "................"
  ],
  スライム: [
    "................",
    "................",
    ".......a........",
    "......aaa.......",
    ".....aaaaa......",
    "....aaaaaaa.....",
    "...aaaaaaaaa....",
    "..aaacaaacaa....",
    "..aaaaaaaaaa....",
    "..aaaaaddaaa....",
    "...aaaaaaaa.....",
    "....bbbbbb......",
    "................",
    "................",
    "................",
    "................"
  ],
  こうもり: [
    "................",
    "................",
    "...m......m.....",
    "..mmm....mmm....",
    ".mmmmm..mmmmm...",
    "mmmmmmmmmmmmmm..",
    "...mmffffmm.....",
    "....fcffc.......",
    "....fffff.......",
    ".....ddf........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  ゴブリン: [
    "................",
    ".....a....a.....",
    "....aaaaaaaa....",
    "....acaaaca.....",
    "....aaaaaaa.....",
    ".....addda......",
    "...mmmmmmmm.....",
    "..mmymmmmmmk....",
    "....mmmmmm......",
    ".....m..m.......",
    "....kk..kk......",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  まどうし: [
    "................",
    ".......f........",
    "......fff.......",
    ".....fffff......",
    "....fffffff.....",
    "......mmmm......",
    ".....mcfcmm.....",
    ".....mmmmm......",
    "....ffffffff....",
    "...ffffyffff....",
    "....fffff.......",
    "....m..m........",
    "...kk..kk.......",
    "................",
    "................",
    "................"
  ],
  塔の番人: [
    "................",
    "....m....m......",
    "...mmmmmmmm.....",
    "..mmmyyyymm.....",
    "..mycmmycym.....",
    "..myyyyyyym.....",
    "...mddddm.......",
    "..mmmmmmmm......",
    ".mmmmmmmmmm.....",
    "...mmmmmm.......",
    "..mm....mm......",
    ".kk......kk.....",
    "................",
    "................",
    "................",
    "................"
  ],
  天塔竜: [
    ".......d........",
    "......ddd.......",
    ".....ddddd......",
    "...dddyyddd.....",
    "..ddycyycdd.....",
    "..ddyyyyddd.....",
    "...ddddd........",
    "..mmmmmmmm......",
    ".mmmmmmmmmm.....",
    "mmmmmmmmmmmm....",
    "...mm..mm.......",
    "..kk....kk......",
    "................",
    "................",
    "................",
    "................"
  ]
};

Object.assign(spritePatterns, {
  勇者: [
    "........................",
    "..........yyyy..........",
    ".........yyyyyy.........",
    "........yyywwyyy........",
    ".......yyhhhhhhyy.......",
    ".......yhhhhhhhhy.......",
    "......hhsssssshh........",
    "......hsswsswssh........",
    "......hssssssssh........",
    ".......ssrrrrss.........",
    "........srrrrs..........",
    "......bbbbbbbbbb........",
    ".....bbybbbbbybb........",
    "....bbbybbbbbybbb.......",
    "....bbbyyyyyybbb........",
    ".....bbbbbbbbbb.........",
    "......bb....bb..........",
    "......bb....bb..........",
    ".....kkk....kkk.........",
    "....kkkk....kkkk........",
    "........................",
    "........................",
    "........................",
    "........................"
  ],
  戦士: [
    "........................",
    "........mmmmmmmm........",
    ".......mmkkkkkkmm.......",
    "......mmkkkkkkkkmm......",
    "......mmssssssssmm......",
    "......msswsswwssm.......",
    "......msssssssssm.......",
    ".......sssrrrrss........",
    "......rrrrrrrrrrrr......",
    ".....rrmmmmmmmmrrk......",
    "....rrmmmmmmmmmmrk......",
    "...kkkmmmmmmmmmmrk......",
    ".....rrmmmmmmmmrr.......",
    "......rrrrrrrrrr........",
    ".......bbbbbbbb.........",
    "......bbb....bbb........",
    "......bb......bb........",
    ".....kkk......kkk.......",
    "....kkkk......kkkk......",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................"
  ],
  僧侶: [
    "........................",
    ".........wwwwww.........",
    "........wwyyyyww........",
    ".......wwwyyyywww.......",
    ".......wwssssssww.......",
    ".......wsswsswssw.......",
    ".......wssssssssw.......",
    "........sssllss.........",
    ".......wwwwpwwww........",
    "......wwwwwpwwwww.......",
    ".....wwwwpppwwwww.......",
    ".....wwwppwppwwww.......",
    "......wwwpppwwww........",
    ".......wwwpwwww.........",
    "........wwwwww..........",
    "........bb..bb..........",
    ".......bbb..bbb.........",
    "......kkk....kkk........",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................"
  ],
  魔法使い: [
    "........................",
    "...........p............",
    "..........ppp...........",
    ".........ppppp..........",
    "........ppppppp.........",
    ".......ppppppppp........",
    "......pppccccppp........",
    "........hhhhhh..........",
    ".......hssssssh.........",
    ".......sswsswss.........",
    ".......ssssssss.........",
    "......pppppppppp........",
    ".....pppppppppppp.......",
    "....ppppppyypppp........",
    "....pppppppppppp........",
    "......pppppppp..........",
    ".......bb....bb.........",
    "......kkk....kkk........",
    ".....kkkk....kkkk.......",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................"
  ],
  盗賊: [
    "........................",
    "........kkkkkkkk........",
    ".......kkggggggkk.......",
    "......kkggggggggkk......",
    "......kgssssssssgk......",
    "......gsswsswssg........",
    "......gsssssssg.........",
    ".......sssrrss..........",
    "......gggggggggg........",
    ".....ggggngggggkk.......",
    "....ggggnnggggkk........",
    "...kkgggnggggg..........",
    ".....gggggggg...........",
    "......gggggg............",
    ".......bb..bb...........",
    "......bbb..bbb..........",
    ".....kkk....kkk.........",
    "....kkkk....kkkk........",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................"
  ],
  騎士: [
    "........................",
    ".........wwwwww.........",
    "........wwmmmmww........",
    ".......wwmmmmmmww.......",
    ".......wmssssssmw.......",
    ".......msswsswwsm.......",
    ".......msssssssm........",
    "........sssrrss.........",
    "......wwwwwwwwww........",
    ".....wwwwwwwwwwwwk......",
    "....wwwwwwwwwwwwwk......",
    "...kkwwwwwwwwwwwwk......",
    ".....wwwwwwwwwwww.......",
    "......wwwwwwwwww........",
    ".......bb....bb.........",
    "......bbb....bbb........",
    ".....kkk......kkk.......",
    "....kkkk......kkkk......",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................"
  ]
});

const els = {
  locationName: document.querySelector("#locationName"),
  towerProgress: document.querySelector("#towerProgress"),
  travelActions: document.querySelector("#travelActions"),
  statusBtn: document.querySelector("#statusBtn"),
  formationBtn: document.querySelector("#formationBtn"),
  partyTitle: document.querySelector("#partyTitle"),
  closeStatusBtn: document.querySelector("#closeStatusBtn"),
  closeFormationBtn: document.querySelector("#closeFormationBtn"),
  statusDialog: document.querySelector("#statusDialog"),
  formationDialog: document.querySelector("#formationDialog"),
  statusContent: document.querySelector("#statusContent"),
  formationContent: document.querySelector("#formationContent"),
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

function currentTower() {
  return TOWERS[state.towerIndex];
}

function currentTotalFloor() {
  return TOWERS.slice(0, state.towerIndex).reduce((sum, tower) => sum + tower.floors, 0) + state.floor;
}

function isFinalTowerFloor() {
  return state.towerIndex === TOWERS.length - 1 && state.floor === currentTower().floors;
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
  state.townPlace = "shop";
  addLog("武器防具屋に入った。");
  render();
}

function returnTownGate() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "gate";
  render();
}

function finishEventTurn() {
  if (state.inBattle || state.phase !== "event") return;

  const joined = recruitMembers("イベント");
  if (joined === 0) {
    resolveEvent();
  }

  state.turn += 1;
  startPolicyTurn();
  render();
}

function startPolicyTurn() {
  state.phase = "policy";
  state.townPlace = "gate";
  fullHeal();
  recruitMembers("内政");

  const gainedPoints = totalPolicyPower();
  state.policyPoints += gainedPoints;
  addLog(`第${state.turn}ターン内政開始。内政Pが${gainedPoints}増えた。`);
}

function buyItem(itemIndex, memberIndex) {
  const item = shopItems[itemIndex];
  const member = state.party[memberIndex];
  if (!item || !member || state.gold < item.price) {
    addLog("ゴールドが足りない。");
    render();
    return;
  }

  state.gold -= item.price;
  if (item.type === "weapon") {
    member.atk = member.atk - member.weaponAtk + item.atk;
    member.weaponAtk = item.atk;
    member.weapon = item.name;
  } else {
    member.def = member.def - member.armorDef + item.def;
    member.armorDef = item.def;
    member.armor = item.name;
  }

  addLog(`${member.name}は${item.name}を装備した。`);
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
}

function canPlaceInRow(member, row) {
  return member.positionType === "両方" || (row === "front" ? member.positionType === "前衛" : member.positionType === "後衛");
}

function getMemberRow(member) {
  if (state.formation.front.includes(member)) return "front";
  if (state.formation.back.includes(member)) return "back";
  return null;
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
  addLog(isBoss ? "最上階の主が立ちはだかった！" : "魔物があらわれた！");
  startActionRound();
  advanceBattleTurn();
  render();
}

function createEnemies(isBoss) {
  if (isBoss) {
    const bossName = isFinalTowerFloor() ? "天塔竜" : "塔の番人";
    const bossStats = isFinalTowerFloor()
      ? { name: bossName, hp: 170, atk: 22, def: 8, agi: 8, exp: 180, gold: 250 }
      : { name: bossName, hp: 95, atk: 17, def: 6, agi: 5, exp: 80, gold: 90 };
    return [makeEnemy(bossStats)];
  }

  const count = Math.min(3, 1 + Math.floor(Math.random() * (currentTotalFloor() > 12 ? 3 : 2)));
  return Array.from({ length: count }, () => {
    const index = Math.min(monsters.length - 1, Math.floor(currentTotalFloor() / 10) + Math.floor(Math.random() * 2));
    return makeEnemy(monsters[index]);
  });
}

function makeEnemy(template) {
  const scale = 1 + Math.floor(currentTotalFloor() / 8) * 0.18;
  const maxHp = Math.round(template.hp * scale);
  return {
    ...template,
    maxHp,
    hp: maxHp,
    atk: Math.round(template.atk * scale),
    def: Math.round(template.def * scale),
    agi: Math.max(1, Math.round(template.agi * scale))
  };
}

function performAction(kind, targetIndex) {
  if (!state.inBattle || state.activeActor?.type !== "party") return;

  const member = state.activeActor.actor;
  if (!member || member.hp <= 0) return;

  const target = Number.isInteger(targetIndex)
    ? state.enemies[targetIndex]
    : state.enemies.find((enemy) => enemy.hp > 0);
  if ((kind === "attack" || kind === "spell") && (!target || target.hp <= 0)) {
    addLog("攻撃する相手を選べない。");
    render();
    return;
  }

  if (kind === "attack") {
    const damage = calculateDamage(member.atk, target.def);
    target.hp = Math.max(0, target.hp - damage);
    addLog(`${member.name}の攻撃。${target.name}に${damage}ダメージ。`);
  }

  if (kind === "heal") {
    if (member.mp < 4) {
      addLog(`${member.name}はMPが足りない。`);
    } else {
      member.mp -= 4;
      const ally = mostWoundedAlly();
      const amount = 18 + member.level * 3;
      ally.hp = Math.min(ally.maxHp, ally.hp + amount);
      addLog(`${member.name}はヒールを唱えた。${ally.name}のHPが${amount}回復。`);
    }
  }

  if (kind === "spell") {
    if (member.mp < 5) {
      addLog(`${member.name}はMPが足りない。`);
    } else {
      member.mp -= 5;
      const damage = 18 + member.level * 4 + Math.floor(Math.random() * 6);
      target.hp = Math.max(0, target.hp - damage);
      addLog(`${member.name}はファイアを唱えた。${target.name}に${damage}ダメージ。`);
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
  state.actionQueue = [
    ...state.party.filter((member) => member.hp > 0).map((member) => makeActionEntry("party", member)),
    ...state.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => makeActionEntry("enemy", enemy))
  ].sort((a, b) => b.order - a.order);
  addLog("敏捷順の行動順が決まった。");
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
  const targets = state.party.filter((member) => member.hp > 0);
  if (targets.length === 0) {
    loseBattle();
    return;
  }

  const target = targets[Math.floor(Math.random() * targets.length)];
  const damage = calculateDamage(enemy.atk, target.def);
  target.hp = Math.max(0, target.hp - damage);
  addLog(`${enemy.name}の攻撃。${target.name}に${damage}ダメージ。`);
}

function calculateDamage(atk, def) {
  return Math.max(1, atk - Math.floor(def / 2) + Math.floor(Math.random() * 5));
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
  state.gold += gold;
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.enemies = [];
  state.clearedFloor = Math.max(state.clearedFloor, currentTotalFloor());

  addLog(`勝利！ 経験値${exp}、${gold}Gを手に入れた。`);
  state.party.forEach((member) => gainExp(member, exp));

  if (isFinalTowerFloor()) {
    addLog("2番目の塔を踏破した。すべての塔に静けさが戻った。");
  } else if (state.floor === currentTower().floors) {
    const clearedTowerName = currentTower().name;
    state.towerIndex += 1;
    state.floor = 1;
    addLog(`${clearedTowerName}を踏破した。次は${currentTower().name}へ向かえる。`);
  } else {
    state.floor += 1;
    addLog(`${currentTower().name}${state.floor}階へ進めるようになった。帰るまでは探索ターンが続く。`);
  }

  render();
}

function recruitMembers(source) {
  let joined = 0;
  while (state.members.length < MAX_MEMBER_COUNT) {
    const recruitIndex = state.reserveMembers.findIndex((member) => member.joinFloor <= state.clearedFloor);
    if (recruitIndex === -1) return joined;

    const [member] = state.reserveMembers.splice(recruitIndex, 1);
    const joinFloor = member.joinFloor;
    delete member.joinFloor;
    prepareRecruit(member);
    state.members.push(member);
    placeMemberInFormation(member);
    joined += 1;
    addLog(`${source}ターン。${joinFloor}階の縁で${member.name}が仲間になった！`);
  }
  return joined;
}

function prepareRecruit(member) {
  member.level = 1;
  member.exp = 0;
  member.hp = member.maxHp;
  member.mp = member.maxMp;
}

function gainExp(member, exp) {
  if (member.hp <= 0) member.hp = 1;
  member.exp += exp;

  while (member.exp >= member.level * 22) {
    member.exp -= member.level * 22;
    member.level += 1;
    member.maxHp += 5 + Math.floor(Math.random() * 4);
    member.maxMp += member.maxMp > 0 ? 3 : 0;
    member.atk += 2;
    member.def += 1;
    member.agi += 1;
    addLog(`${member.name}はレベル${member.level}に上がった！`);
  }
}

function loseBattle() {
  const lostGold = Math.ceil(state.gold / 2);
  state.gold = Math.floor(state.gold / 2);
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
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

function render() {
  els.locationName.textContent = `第${state.turn}T ${PHASE_LABELS[state.phase]}`;
  els.towerProgress.style.height = `${Math.max(2, (state.clearedFloor / TOTAL_FLOORS) * 100)}%`;
  els.gold.textContent = `${state.gold} G / 内政P ${state.policyPoints}`;
  els.statusBtn.disabled = state.inBattle;
  els.partyTitle.textContent = `前衛${state.formation.front.length} / 後衛${state.formation.back.length} / 仲間${state.members.length}人`;

  renderTravelActions();
  renderParty();
  renderBattle();
  if (els.statusDialog.open) renderStatus();
  if (els.formationDialog.open) renderFormation();
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
    `;
    els.travelActions.querySelector('[data-town="tower"]').addEventListener("click", openTowerSelect);
    els.travelActions.querySelector('[data-town="shop"]').addEventListener("click", openShop);
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
    const active = state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member;
    return `
      <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""}">
        <div class="name-line">
          <span class="name-with-icon">${renderSprite(member.job, "hero")}<span>${member.name}</span></span>
          <span>Lv ${member.level}</span>
        </div>
        <div class="stat-line">HP ${member.hp}/${member.maxHp}</div>
        <div class="stat-line">MP ${member.mp}/${member.maxMp}</div>
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
  const canHeal = state.inBattle && member && (member.job === "僧侶" || member.job === "勇者");
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? `<div class="enemy-card town-card">
        <div class="name-line"><span>${currentTower().name}${state.floor}階</span><span>探索中</span></div>
        <div class="stat-line">登ると戦闘が始まる。帰るを選ぶまで、ダンジョン探索ターンは続く。</div>
      </div>`
    : state.enemies.map((enemy, enemyIndex) => {
      return `
        <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""}">
          <div class="name-line">
            <span class="name-with-icon">${renderSprite(enemy.name, "monster")}<span>${enemy.name}</span></span>
            <span>${enemy.hp > 0 ? "敵" : "撃破"}</span>
          </div>
          <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / 敏捷 ${enemy.agi}</div>
          ${state.inBattle && enemy.hp > 0 ? `
            <div class="enemy-actions">
              <button type="button" data-target-action="attack" data-enemy="${enemyIndex}">攻撃</button>
              <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell ? "" : "disabled"}>魔法</button>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");

  if (!state.inBattle) {
    els.commandArea.innerHTML = "";
    return;
  }

  els.commandArea.innerHTML = `
    <button type="button" data-action="heal" ${canHeal ? "" : "disabled"}>回復</button>
  `;

  els.commandArea.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => performAction(button.dataset.action));
  });
  els.enemyArea.querySelectorAll("button[data-target-action]").forEach((button) => {
    button.addEventListener("click", () => {
      performAction(button.dataset.targetAction, Number(button.dataset.enemy));
    });
  });
}

function renderTown() {
  els.battleTitle.textContent = state.townPlace === "shop" ? "内政: 武器防具屋" : state.townPlace === "tower" ? "探索先選択" : "内政ターン";
  els.enemyArea.innerHTML = state.townPlace === "shop"
    ? shopItems.map((item, itemIndex) => `
      <article class="enemy-card">
        <div class="name-line"><span>${item.name}</span><span>${item.price} G</span></div>
        <div class="stat-line">${item.type === "weapon" ? `攻撃 +${item.atk}` : `守備 +${item.def}`}</div>
        <div class="shop-buyers">
          ${state.party.map((member, memberIndex) => `
            <button type="button" data-buy="${itemIndex}" data-member="${memberIndex}">${member.name}</button>
          `).join("")}
        </div>
      </article>
    `).join("")
    : state.townPlace === "tower"
    ? TOWERS.map((tower, towerIndex) => isTowerUnlocked(towerIndex) ? `
      <article class="enemy-card">
        <div class="name-line"><span>${tower.name}</span><span>${tower.floors}階</span></div>
        <div class="stat-line">1階から探索を開始する。</div>
        <div class="shop-buyers">
          <button type="button" data-tower="${towerIndex}">探索する</button>
        </div>
      </article>
    ` : "").join("")
    : `<div class="enemy-card town-card">街で次の探索に備える。武器防具を買うか、${currentTower().name}${state.floor}階の探索へ出発できる。</div>`;

  els.commandArea.innerHTML = state.townPlace === "shop" || state.townPlace === "tower"
    ? `<button type="button" data-town="gate">街へ戻る</button>`
    : "";

  els.enemyArea.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => buyItem(Number(button.dataset.buy), Number(button.dataset.member)));
  });
  els.enemyArea.querySelectorAll("[data-tower]").forEach((button) => {
    button.addEventListener("click", () => startDungeonExploration(Number(button.dataset.tower)));
  });
  const backButton = els.commandArea.querySelector('[data-town="gate"]');
  if (backButton) backButton.addEventListener("click", returnTownGate);
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
          <th>MP</th>
          <th>配置</th>
          <th>攻撃</th>
          <th>守備</th>
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
            <td>${member.atk}</td>
            <td>${member.def}</td>
            <td>${member.agi}</td>
            <td>${member.policy}</td>
            <td>${member.exp}/${member.level * 22}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
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
        <span class="name-with-icon">${renderSprite(member.job, "hero")}<span>${member.name}</span></span>
        <span>Lv ${member.level}</span>
      </div>
      <div class="stat-line">HP ${member.hp}/${member.maxHp}</div>
      <div class="stat-line">MP ${member.mp}/${member.maxMp}</div>
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
            <th>HP/最大HP</th>
            <th>配置</th>
            <th>攻撃力</th>
            <th>守備力</th>
            <th>敏捷</th>
          </tr>
        </thead>
        <tbody>
          ${members.map((member) => renderFormationRow(member, state.members.indexOf(member), "bench")).join("") || `
            <tr>
              <td colspan="6" class="empty-table-cell">空き</td>
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
        <td><span class="name-with-icon">${renderSprite(member.job, "hero")}<span>${member.name}</span></span></td>
        <td>${member.hp}/${member.maxHp}</td>
        <td>${member.positionType}</td>
        <td>${member.atk}</td>
        <td>${member.def}</td>
        <td>${member.agi}</td>
      </tr>
    `;
}

addLog("初めの塔と2番目の塔に挑む。探索では帰るまでダンジョンに留まれる。");
startPolicyTurn();
render();
