gg.setVisible(false)
gg.clearResults()
gg.toast(" Login PRO YG-9WING V.2")
 
-- Login
function login()
  local info = gg.prompt({"🔒 KEY-เปลื่ยนดวง 🔒"}, {""}, {"text"})
  if not info then os.exit() end
  if info[1] ~= "WING123" then
    gg.alert(" 🖕👣 เด๋วก็หงายท้องหรอก มึงเป็นใคร ?? 👣🖕")
    os.exit()
  end

-- options
local scriptName = [=====[Script for YG.BY-วิ่งV5 11.11.11]=====]
local scriptVersion = '1.0.0'
local scriptAuthor = 'User'
local startToast = ''
-- 0 - no check; 1 - check package only, 2 - check package and build
local checkTarget = 0

local targetName = [=====[YG.BY-วิ่งV5]=====]
local targetPkg = 'com.yulgang.nowggs6'
local targetVersion = [=====[11.11.11]=====]
local targetBuild = 10

-- functions

-- init
gg.require('101.1', 16142)

if startToast ~= '' then startToast = '\n'..startToast end
gg.toast(scriptName..' v'..scriptVersion..' by '..scriptAuthor..startToast)

if checkTarget ~= 0 then
	local info = gg.getTargetInfo()
	local check = false
	local current = false
	if checkTarget >= 1 then
		check = targetPkg
		current = info.packageName
	end
	if checkTarget >= 2 then
		check = check..' '..targetVersion..' ('..targetBuild..')'
		current = current..' '..info.versionName..' ('..info.versionCode..')'
	end
	if check ~= current then
		gg.alert('This script for "'..targetName..'" ['..check..'].\nYou select "'..info.label..'" ['..current..'].\nNow script exit.')
		os.exit()
	end
end
local revert = nil

-- main code
gg.searchNumber("h 40 0E 2B 0E 21 0E 32 0E 30 0E 2A 0E 21 0E 3A 00 20 00 1B 0E 25 0E 38 0E 01 0E 1E 0E 25 0E 31 0E 07 0E", gg.TYPE_BYTE, false, gg.SIGN_EQUAL, 0, -1, 0)
revert = gg.getResults(750, nil, nil, nil, nil, nil, nil, nil, nil)
gg.editAll("h 40 0E 2B 0E 21 0E 32 0E 30 0E 2A 0E 21 0E 3A 00 40 0E 2A 0E 23 0E 34 0E 21 0E 1E 0E 25 0E 31 0E 07 0E", gg.TYPE_BYTE)
gg.processResume()

 
-- Start
login()
 
while true do
  if gg.isVisible(true) then
    gg.setVisible(false)
    mainMenu()
  end
end
