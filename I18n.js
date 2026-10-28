// Localization catalog for the Touch Type trainer.
//
// Pure JS, no QML/Quickshell imports, and no dependency on other .js
// library files — the caller passes the locale id it wants and reads back
// the resolved string. Every user-facing string in the plugin lives here,
// including the English one, so there is exactly one copy of each string
// and adding a locale is a data-only change.
//
// Resolution order for a key: the requested locale, then English, then the
// key itself. The last step is deliberate — a missing translation should be
// visible in the UI rather than silently rendering as empty space.
.pragma library

var DEFAULT_LANGUAGE = "en"

// Each locale names itself in its own language, so the switch reads
// correctly whichever language is currently active.
var locales = [
  { id: "en", label: "English" },
  { id: "zh-CN", label: "简体中文" }
]

var catalogs = {
  "en": {
    "app.title": "Touch Type",
    "app.admin": "⚙ Admin",
    "app.streak": "{n} day streak",
    "app.language.tooltip": "Switch language",

    "menu.hint": "Train each finger pair, or run the classic course. Use ←/→ to switch tracks, ↑↓ + Enter, number keys, or click.",
    "menu.track.finger": "🖐 Finger Gym",
    "menu.track.classic": "⌨ Classic Course",
    "menu.level.best": "Best: {wpm} wpm · {acc}%",

    "lesson.hint": "Esc: menu",
    "lesson.time": "⏱ {s}s",
    "lesson.wpm": "⌨ {wpm} wpm",
    "lesson.accuracy": "🎯 {acc}%",
    "lesson.finger.hint": "{fingers} — press the tinted keys",
    "lesson.finger.legend": "Keys tinted by finger:",

    "finger.index": "Index fingers",
    "finger.middle": "Middle fingers",
    "finger.ring": "Ring fingers",
    "finger.pinky": "Pinky fingers",

    "results.passed": "✓ Level passed!",
    "results.keepPracticing": "Keep practicing",
    "results.accuracy": "accuracy",
    "results.wpm": "wpm",
    "results.time": "time",
    "results.weakestKeys": "Weakest keys",
    "results.hint": "Enter: retry{next}   ·   Esc: menu",
    "results.hint.next": "   ·   N: next level",

    "admin.unlock": "Open all stages",
    "admin.lock": "Lock all stages",
    "admin.reset": "Reset progress",
    "admin.confirm.message": "Reset all progress? Streaks, best scores, and weak-key stats will be cleared.",
    "admin.confirm.cancel": "Cancel",
    "admin.confirm.reset": "Reset",

    "bar.tooltip": "Touch Type — Finger Gym {fp}/{ft}, Classic {cp}/{ct}, {streak} day streak",

    "level.anchors.title": "F & J Anchors",
    "level.anchors.subtitle": "Find home by feel",
    "level.homerow.title": "Home Row",
    "level.homerowWords.title": "Home Row Words",
    "level.homerowWords.subtitle": "Real words, home keys only",
    "level.toprow.title": "Top Row",
    "level.toprowWords.title": "Top Row Words",
    "level.toprowWords.subtitle": "Words without the bottom row",
    "level.bottomrow.title": "Bottom Row",
    "level.fullAlphabet.title": "Full Alphabet",
    "level.fullAlphabet.subtitle": "Every letter, real words",
    "level.numbers.title": "Numbers & Punctuation",
    "level.numbers.subtitle": "0-9 and basic symbols",
    "level.mixed.title": "Mixed Drills",
    "level.mixed.subtitle": "Capitals, numbers, punctuation",
    "level.sentences.title": "Sentences & Speed",
    "level.sentences.subtitle": "Full sentences, timed",
    "level.fingerIndex.title": "Index Fingers",
    "level.fingerMiddle.title": "Middle Fingers",
    "level.fingerRing.title": "Ring Fingers",
    "level.fingerPinky.title": "Pinky Fingers",
    "level.fingerNumbers.title": "Numbers Row",
    "level.fingerNumbers.subtitle": "1–0 across all fingers",
    "level.fingerPunct.title": "Punctuation"
  },

  "zh-CN": {
    "app.title": "盲打练习",
    "app.admin": "⚙ 管理",
    "app.streak": "连续练习 {n} 天",
    "app.language.tooltip": "切换语言",

    "menu.hint": "逐个手指训练，或完成经典课程。使用 ←/→ 切换课程，↑↓ + Enter 选择关卡，也可以直接点击。",
    "menu.track.finger": "🖐 手指训练",
    "menu.track.classic": "⌨ 经典课程",
    "menu.level.best": "最佳：{wpm} wpm · {acc}%",

    "lesson.hint": "Esc：返回菜单",
    "lesson.time": "⏱ {s} 秒",
    "lesson.wpm": "⌨ {wpm} wpm",
    "lesson.accuracy": "🎯 {acc}%",
    "lesson.finger.hint": "{fingers} —— 按下高亮的按键",
    "lesson.finger.legend": "按键按手指着色：",

    "finger.index": "食指",
    "finger.middle": "中指",
    "finger.ring": "无名指",
    "finger.pinky": "小指",

    "results.passed": "✓ 通关！",
    "results.keepPracticing": "继续练习",
    "results.accuracy": "准确率",
    "results.wpm": "每分钟字数",
    "results.time": "用时",
    "results.weakestKeys": "最薄弱的按键",
    "results.hint": "Enter：重试{next}   ·   Esc：返回菜单",
    "results.hint.next": "   ·   N：下一关",

    "admin.unlock": "解锁全部关卡",
    "admin.lock": "锁定全部关卡",
    "admin.reset": "重置进度",
    "admin.confirm.message": "确定要重置全部进度吗？连续天数、最佳成绩和薄弱按键统计都将被清除。",
    "admin.confirm.cancel": "取消",
    "admin.confirm.reset": "重置",

    "bar.tooltip": "盲打练习 —— 手指训练 {fp}/{ft}，经典课程 {cp}/{ct}，连续练习 {streak} 天",

    "level.anchors.title": "F 与 J 定位键",
    "level.anchors.subtitle": "凭手感找到基准键",
    "level.homerow.title": "主键行",
    "level.homerowWords.title": "主键行单词",
    "level.homerowWords.subtitle": "只用主键行的真实单词",
    "level.toprow.title": "上排键",
    "level.toprowWords.title": "上排键单词",
    "level.toprowWords.subtitle": "不含下排键的单词",
    "level.bottomrow.title": "下排键",
    "level.fullAlphabet.title": "全字母",
    "level.fullAlphabet.subtitle": "全部字母与真实单词",
    "level.numbers.title": "数字与标点",
    "level.numbers.subtitle": "0-9 与基本符号",
    "level.mixed.title": "混合练习",
    "level.mixed.subtitle": "大写字母、数字与标点",
    "level.sentences.title": "句子与速度",
    "level.sentences.subtitle": "完整句子，计时训练",
    "level.fingerIndex.title": "食指",
    "level.fingerMiddle.title": "中指",
    "level.fingerRing.title": "无名指",
    "level.fingerPinky.title": "小指",
    "level.fingerNumbers.title": "数字行",
    "level.fingerNumbers.subtitle": "全部手指练习 1–0",
    "level.fingerPunct.title": "标点符号"
  }
}

// The supported locales, in switch order.
function languages() {
  return locales
}
// The locale used when nothing else is known or chosen.
function defaultLanguage() {
  return DEFAULT_LANGUAGE
}

// True when the id names a supported locale.
function isLanguage(id) {
  for (var i = 0; i < locales.length; i++) {
    if (locales[i].id === id) return true
  }
  return false
}

// Maps an arbitrary id onto a supported locale, falling back to the default.
// Used when reading a saved preference that may be missing or stale.
function normalize(id) {
  return isLanguage(id) ? id : DEFAULT_LANGUAGE
}

// The next locale in the list, wrapping around. Drives the language switch.
// An unknown id is treated as the default locale, so the switch always
// moves to the same place regardless of what was stored.
function nextLanguage(current) {
  var index = -1
  var resolved = normalize(current)
  for (var i = 0; i < locales.length; i++) {
    if (locales[i].id === resolved) { index = i; break }
  }
  if (index === -1) index = 0
  return locales[(index + 1) % locales.length].id
}

// The display name of a locale, in that locale's own language.
function label(id) {
  for (var i = 0; i < locales.length; i++) {
    if (locales[i].id === id) return locales[i].label
  }
  return ""
}

// Font families that cover each locale's glyphs. The theme font is used
// where it covers the locale; Chinese needs a CJK-capable family, which
// also carries Latin glyphs so mixed text stays coherent.
var localeFonts = {
  "en": "",
  "zh-CN": "Noto Sans CJK SC"
}

// The font family to render a locale's text in. Falls back to the theme
// font for any locale that does not need a specific one.
function fontFamily(language, themeFont) {
  var family = localeFonts[language]
  if (family) return family
  return themeFont || ""
}

// The catalog for a locale; an empty object for an unknown locale.
function strings(language) {
  return catalogs[language] || {}
}

// Every key defined by any catalog.
function keys() {
  var seen = {}
  var out = []
  for (var id in catalogs) {
    var catalog = catalogs[id]
    for (var key in catalog) {
      if (!seen[key]) { seen[key] = true; out.push(key) }
    }
  }
  return out
}

// Resolves a key for a locale. Falls back to English, then to the key itself.
// `params` substitutes {name} placeholders.
function t(key, language, params) {
  if (!key) return ""
  var catalog = catalogs[language]
  var str = (catalog && catalog[key] !== undefined) ? catalog[key] : undefined
  if (str === undefined) {
    var english = catalogs[DEFAULT_LANGUAGE]
    str = (english && english[key] !== undefined) ? english[key] : key
  }
  if (params) {
    for (var name in params) {
      var value = params[name]
      if (value === undefined || value === null) continue
      str = str.split("{" + name + "}").join(String(value))
    }
  }
  return str
}
