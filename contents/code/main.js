/*******************************************************************************
 * Quick Tile 2 KWin script
 *
 * This script will add four additional shortcuts to the KWin window manager,
 * in order to emulate Windows 10 tiling behavior.
 *
 * Forked from Quick Tiling - Windows 10 by Koen Hausmans <koen@hausmans.nl>
 *
 * https://github.com/tsoernes/kwin-quick-tile-2
 ******************************************************************************/

function _GetScreenGeometry() {
    return workspace.clientArea(KWin.PlacementArea, workspace.activeScreen, workspace.Desktop)
}

function _GetClientGeometryOnScreen() {
    const clientGeometry = workspace.activeClient.geometry
    const screenGeometry = _GetScreenGeometry()
    const x = clientGeometry.x - screenGeometry.x
    const y = clientGeometry.y - screenGeometry.y
    return {x: x, y: y, width: clientGeometry.width, height: clientGeometry.height}
}

function _IsVerticallyMaximized() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.height === screenGeometry.height) {
        return true
    }
    return false
}

function _IsHorizontallyMaximized() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.width === screenGeometry.width) {
        return true
    }
    return false
}

function _IsMaximized() {
    return _IsHorizontallyMaximized() && _IsVerticallyMaximized()
}

function _IsTiledToTop() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.height === (screenGeometry.height / 2) && clientGeometry.y === 0) {
        return true
    }
    return false
}

function _IsTiledTop() {
    return _IsTiledToTop() && _IsHorizontallyMaximized()
}

function _IsTiledToBottom() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.height === (screenGeometry.height / 2) && clientGeometry.y === (screenGeometry.height / 2)) {
        return true
    }
    return false
}

function _IsTiledBottom() {
    return _IsTiledToBottom() && _IsHorizontallyMaximized()
}

function _IsTiledToLeft() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.width === (screenGeometry.width / 2) && clientGeometry.x === 0) {
        return true
    }
    return false
}

function _IsTiledLeft() {
    return _IsTiledToLeft() && _IsVerticallyMaximized()
}

function _IsTiledToRight() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.width === (screenGeometry.width / 2) && clientGeometry.x === (screenGeometry.width / 2)) {
        return true
    }
    return false
}

function _IsTiledRight() {
    return _IsTiledToRight() && _IsVerticallyMaximized()
}

function _IsTiledToQuadrant() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.width === (screenGeometry.width / 2) && clientGeometry.height === (screenGeometry.height/ 2)) {
        return true
    }
    return false
}

function _isOnRightScreenEdge() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.x + clientGeometry.width === screenGeometry.width) {
        return true
    }
    return false
}

function _isOnLeftScreenEdge() {
    const screenGeometry = _GetScreenGeometry()
    const clientGeometry = _GetClientGeometryOnScreen()
    if (clientGeometry.x === 0) {
        return true
    }
    return false
}

function _nextScreenRight() {
    next = workspace.activeClient.screen + 1
    if (next > workspace.numScreens - 1){
        return 0
    }
    else {
        return next
    }
}

function _nextScreenLeft() {
    next = workspace.activeClient.screen - 1
    if (next < 0) {
        return workspace.numScreens - 1
    }
    else {
        return next
    }
}

function _IsTiledTopLeft() {
    return _IsTiledToTop() && _IsTiledToLeft()
}

function _IsTiledTopRight() {
    return _IsTiledToTop() && _IsTiledToRight()
}

function _IsTiledBottomLeft() {
    return _IsTiledToBottom() && _IsTiledToLeft()
}

function _IsTiledBottomRight() {
    return _IsTiledToBottom() && _IsTiledToRight()
}


lastMinimized = null;

function manageMinimzed(client) {
    lastMinimized = client
}

function restoreLastMinimized() {
    if (lastMinimized !== null){    
        lastMinimized.minimized = false;
        workspace.activeClient = lastMinimized;
        lastMinimized = null;
    }    
}

function sendToScreenLeft() {
    workspace.sendClientToScreen(workspace.activeClient, _nextScreenLeft())
}

function sendToScreenRight() {
    workspace.sendClientToScreen(workspace.activeClient, _nextScreenRight())
}

var QuickTileUp = function() {
    // L > TL
    if (_IsTiledLeft()) {
        workspace.slotWindowQuickTileTopLeft()
    // R > TR
    } else if (_IsTiledRight()) {
        workspace.slotWindowQuickTileTopRight()
    // B > T
    } else if (_IsTiledBottom()) {
        workspace.slotWindowQuickTileTop()
    // BL > L
    } else if (_IsTiledBottomLeft()) {
        workspace.slotWindowQuickTileLeft()
    // BR > R
    } else if (_IsTiledBottomRight()) {
        workspace.slotWindowQuickTileRight()
    // M > Restored
    } else if (_IsMaximized()) {
        workspace.slotWindowMaximize()
    // Restored > M
    } else {
        workspace.slotWindowMaximize()
    }
}

var QuickTileDown = function() {
    // L > BL
    if (_IsTiledLeft()) {
        workspace.slotWindowQuickTileBottomLeft()
    // R > BR
    } else if (_IsTiledRight()) {
        workspace.slotWindowQuickTileBottomRight()
    // T > B
    } else if (_IsTiledTop()) {
      workspace.slotWindowQuickTileBottom()
    // TL > L
    } else if (_IsTiledTopLeft()) {
        workspace.slotWindowQuickTileLeft()
    // TR > R
    } else if (_IsTiledTopRight()) {
        workspace.slotWindowQuickTileRight()
    // M > Restored
    } else if (_IsMaximized()) {
        workspace.slotWindowMaximize()
    // Restored > M
    } else {
        workspace.slotWindowMinimize()
    }
}

var QuickTileLeft = function() {
    // T > TL
    if (_IsTiledTop()) {
        workspace.slotWindowQuickTileTopLeft()
    // B > BL
    } else if (_IsTiledBottom()) {
        workspace.slotWindowQuickTileBottomLeft()
    // TR > T
    } else if (_IsTiledTopRight()) {
        workspace.slotWindowQuickTileTop()
    // BR > B
    } else if (_IsTiledBottomRight()) {
        workspace.slotWindowQuickTileBottom()
    // M > L
    } else if (_IsMaximized()) {
        workspace.slotWindowQuickTileLeft()
    // Loop screens with quadrant tiles
    } else if (_IsTiledTopLeft() & _isOnLeftScreenEdge()) {
        sendToScreenLeft()
        workspace.slotWindowQuickTileTopRight()
    } else if (_IsTiledBottomLeft() & _isOnLeftScreenEdge()){
        sendToScreenLeft()
        workspace.slotWindowQuickTileBottomRight()
    // Loop screens with half panel tiles
    } else if (_IsTiledLeft()){
        sendToScreenLeft()
        workspace.slotWindowQuickTileRight()
    } else {
        workspace.slotWindowQuickTileLeft()
    }
}

var QuickTileRight = function() {
    // T > TR
    if (_IsTiledTop()) {
        workspace.slotWindowQuickTileTopRight()
    // B > BR
    } else if (_IsTiledBottom()) {
        workspace.slotWindowQuickTileBottomRight()
    // TL > T
    } else if (_IsTiledTopLeft()) {
        workspace.slotWindowQuickTileTop()
    // BL > B
    } else if (_IsTiledBottomLeft()) {
        workspace.slotWindowQuickTileBottom()
    // M > R
    } else if (_IsMaximized()) {
        workspace.slotWindowQuickTileRight()
    // Loop screens with quadrant tiles
    } else if (_IsTiledTopRight() & _isOnRightScreenEdge()) {
        sendToScreenRight()
        workspace.slotWindowQuickTileTopLeft()
    } else if (_IsTiledBottomRight() & _isOnRightScreenEdge()){
        sendToScreenRight()
        workspace.slotWindowQuickTileBottomLeft()
    // Loop screens with half panel tiles
    } else if (_IsTiledRight()) {
        sendToScreenRight()
        workspace.slotWindowQuickTileLeft()
    } else {
        workspace.slotWindowQuickTileRight()
    }
}

workspace.clientMinimized.connect(manageMinimzed)

var shortcutPrefix = "Quick Tile 2 "
registerShortcut(shortcutPrefix + "Up", shortcutPrefix + "Up", "Meta+Up", QuickTileUp)
registerShortcut(shortcutPrefix + "Down", shortcutPrefix + "Down", "Meta+Down", QuickTileDown)
registerShortcut(shortcutPrefix + "Left", shortcutPrefix + "Left", "Meta+Left", QuickTileLeft)
registerShortcut(shortcutPrefix + "Right", shortcutPrefix + "Right", "Meta+Right", QuickTileRight)

registerShortcut(shortcutPrefix + "Restore Last Minimized", shortcutPrefix + "Restore Last Minimized", "Meta+Shift+Up", restoreLastMinimized)

registerShortcut(shortcutPrefix + "Send to screen Left", shortcutPrefix + "Send to screen Left", "Meta+Shift+Left", sendToScreenLeft)
registerShortcut(shortcutPrefix + "Send to screen Right", shortcutPrefix + "Send to screen Right", "Meta+Shift+Right", sendToScreenRight)