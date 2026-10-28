import QtQuick
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Ui
import "ProgressStore.js" as Progress
import "Curriculum.js" as Curriculum
import "I18n.js" as I18n

// Compact bar indicator: keyboard icon plus daily streak.
// Hover shows per-track progress; click opens the Touch Type overlay.
BarWidget {
  id: root

  property string progressPath: Quickshell.env("HOME") + "/.local/state/omarchy/touchtype-progress.json"
  property var progress: Progress.defaultProgress()

  readonly property var fingerList: Curriculum.fingerLevels()
  readonly property var levelList: Curriculum.levels([])

  function countPassed(list) {
    var n = 0
    for (var i = 0; i < list.length; i++) {
      var entry = root.progress.levels[list[i].id]
      if (entry && entry.passed) n++
    }
    return n
  }
  readonly property int fingerPassed: root.countPassed(root.fingerList)
  readonly property int classicPassed: root.countPassed(root.levelList)
  readonly property int streakCount: root.progress.streak.count || 0
  readonly property string displayText: "⌨" + (root.streakCount > 0 ? "  🔥" + root.streakCount : "")
  // The widget follows the same saved preference as the overlay, so the
  // tooltip never disagrees with the trainer it opens.
  readonly property string language: I18n.normalize(root.progress.settings.language)

  implicitWidth: button.implicitWidth
  implicitHeight: button.implicitHeight

  FileView {
    id: progressFile
    path: root.progressPath
    watchChanges: true
    printErrors: false
    onLoaded: root.progress = Progress.parse(text())
    onLoadFailed: root.progress = Progress.defaultProgress()
    onFileChanged: reload()
  }

  WidgetButton {
    id: button
    anchors.fill: parent
    bar: root.bar
    text: root.vertical ? "⌨" : root.displayText
    tooltipText: I18n.t("bar.tooltip", root.language, {
      fp: root.fingerPassed + 1, ft: root.fingerList.length,
      cp: root.classicPassed + 1, ct: root.levelList.length,
      streak: root.streakCount
    })
    horizontalMargin: 8.5

    onPressed: function(b) {
      if (root.bar && root.bar.shell) root.bar.shell.summon(root.moduleName, "{}")
    }
  }
}
