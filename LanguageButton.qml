import QtQuick
import qs.Commons
import qs.Ui
import "I18n.js" as I18n

// Compact control that shows the active language and switches to the next
// supported one when activated. The overlay owns the state and the save;
// this only reports the intent.
Rectangle {
  id: root

  property string language: I18n.defaultLanguage()
  property color foreground: Color.popups.text

  signal activated()

  implicitHeight: Style.space(28)
  implicitWidth: buttonLabel.implicitWidth + Style.spacing.lg * 2
  radius: height / 2
  color: area.containsMouse ? Util.alpha(Color.accent, 0.2) : Util.alpha(root.foreground, 0.05)
  border.width: 1
  border.color: Util.alpha(root.foreground, 0.12)

  Text {
    id: buttonLabel
    anchors.centerIn: parent
    text: "🌐 " + I18n.label(root.language)
    color: root.foreground
    font.family: I18n.fontFamily(root.language, Style.font.family)
    font.pixelSize: Style.font.bodySmall
    font.bold: true
  }

  MouseArea {
    id: area
    anchors.fill: parent
    hoverEnabled: true
    cursorShape: Qt.PointingHandCursor
    onClicked: root.activated()
  }

  Text {
    anchors.top: root.bottom
    anchors.topMargin: Style.spacing.xs
    anchors.horizontalCenter: parent.horizontalCenter
    visible: area.containsMouse
    text: I18n.t("app.language.tooltip", root.language)
    color: Color.muted
    font.family: I18n.fontFamily(root.language, Style.font.family)
    font.pixelSize: Style.font.caption
    z: 5
  }
}
