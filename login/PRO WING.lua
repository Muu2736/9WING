local scriptName = [=====[╔═ 💥PRO BY 9WING V 1.0💥 ═╗]=====]
local scriptVersion = '1.0.0'
local scriptAuthor = 'User'
 
-- วันหมดอายุ
local expirationDate = os.time({year=2026, month=7, day=16}) -- วันที่หมดอายุ: 30 มีนาคม 2026
local currentDate = os.time()
 
-- เช็ควันหมดอายุ
if currentDate > expirationDate then
    gg.alert("🙏วันใช้งานหมด🙏 กรุณาติดต่อ🧑‍✈️ FB สายวิ่ง")
    os.exit()
end
 
-- init
gg.require('101.1', 16142)
gg.toast("🙏วันใช้งานหมด🙏 กรุณาติดต่อ🧑‍✈️ FB สายวิ่ง")
 
-- Function to perform the main action
function mainAction()
gg.setRanges(gg.REGION_ANONYMOUS | gg.REGION_CODE_APP) 
gg.searchNumber("1041313291", gg.TYPE_DWORD, false, gg.SIGN_EQUAL, 0, -1, 0)
gg.processResume()
revert = gg.getResults(10, nil, nil, nil, nil, nil, nil, nil, nil)
gg.editAll("1043813291", gg.TYPE_DWORD)
gg.processResume()
gg.toast("📶 ระบบ BYPASS กันแบน💯")
end

function mainAction2()
gg.setRanges(gg.REGION_ANONYMOUS | gg.REGION_CODE_APP) 
gg.refineNumber("360", gg.TYPE_FLOAT, false, gg.SIGN_EQUAL, 0, -1, 0)
 gg.processResume()
revert = gg.getResults(1000, nil, nil, nil, nil, nil, nil, nil, nil)
gg.editAll("200", gg.TYPE_FLOAT)
gg.toast("👑 RUN ออโต้กันแบน BY วิ่ง")
end

function mainAction3()
gg.setRanges(gg.REGION_CODE_APP)
gg.searchNumber(".01;1.0e-6::9", gg.TYPE_FLOAT, false, gg.SIGN_EQUAL, 0, -1)
revert = gg.getResults(100, nil, nil, nil, nil, nil, nil, nil, nil)
gg.editAll("-1", gg.TYPE_FLOAT)
gg.clearResults()
gg.toast("👑 RUN ออโต้กันแบน BY วิ่ง")
end

-- Menu function (ไม่ต้องวนลูป)
local options = {
   " ตี ไม่มีดีเล ",
  "ปรับมุมมอง ",
--   "ปิด FX ",
 "🚪 ออก"  
}

local choice = gg.choice(options, nil, scriptName)
if choice == 1 then
    mainAction()
elseif choice == 2 then
   mainAction2()
elseif choice == 3 then
   mainAction()
elseif choice == 3 then
    gg.alert("🙏 ขอบคุณที่ใช้บริการครับ 🙏")
end

 



