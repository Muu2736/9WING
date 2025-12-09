REG=1
::XREGION:: 
if REG==1 then gg.setRanges(gg.REGION_ANONYMOUS) end
if REG==2 then gg.setRanges(gg.REGION_C_ALLOC) end
if REG==3 then gg.setRanges(gg.REGION_C_DATA) end
if REG==4 then gg.setRanges(gg.REGION_OTHER) end
gg.clearResults() t1={} t2={} TRY=1 SPEED={} 
gg.searchNumber("3F7FFFFEh",4)
    if gg.getResultsCount()==0 and REG<4 then REG=REG+1 goto XREGION return end 
    if gg.getResultsCount()==0 and REG==4 then
        gg.alert("×× ERROR ××\nNo Search Results ","OK",nil,xTAGx) 
        return
   end 
local res=gg.getResults(gg.getResultsCount())   
gg.clearResults() O1=20 O2=28 
::TRYAGAIN::
    for i, v in ipairs(res) do
        t1[i]={} t2[i]={}
        t1[i].address=v.address+O1 t1[i].flags=32
        t2[i].address=v.address+O2 t2[i].flags=32
    end
t3={} x=0
t1=gg.getValues(t1) gg.sleep(150) t2=gg.getValues(t2)
    for i, v in ipairs(t1) do
        if #(tostring(v.value))<7 and v.value>100 and t2[i].value<v.value+250 and t2[i].value>v.value then
            x=x+1 t3[x]={}
            t3[x].address=v.address t3[x].flags=16
        end
    end 
    if x==0 and TRY==1 then O1=16 O2=24 TRY=TRY+1 goto TRYAGAIN return end 
    if x==0 and TRY==2 then O1=24 O2=32 TRY=TRY+1 goto TRYAGAIN return end   
    if x==0 and TRY==3 and REG<4 then REG=REG+1 goto XREGION return end 
    if x==0 and TRY==3 and REG==4 then 
        gg.alert("×× ERROR ××\nNo Time Value Found","EXIT",nil, xTAGx) 
        gg.setVisible(true) os.exit()
        return
    end 
    x=0
    for z=1,35 do 
        for i, v in ipairs(t3) do 
            v.address=v.address+4 v.flags=16
        end 
        t3=gg.getValues(t3)
        for i, v in ipairs(t3) do 
            if v.value==1 then 
                x=x+1 SPEED[x]={} 
                SPEED[x].address=v.address SPEED[x].flags=16
            end
        end
    end 
    if x==0 and REG<4 then REG=REG+1 goto XREGION return end 
    if x==0 and REG==4 then 
        gg.alert("×× ERROR ××\nNo Speed Value Found","EXIT",nil, xTAGx) 
        gg.setVisible(true) os.exit()
        return
    end      
gg.loadResults(SPEED) 
