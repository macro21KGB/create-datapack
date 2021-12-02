execute as @e[type=minecraft:item,nbt={Item: {id: "minecraft:glowstone_dust", Count: 1b}}] run execute as @e[type=minecraft:item,nbt={Item: {id: "minecraft:redstone", Count: 3b}},distance=..1] run summon minecraft:item ~ ~ ~ {Tags: ["fresh_craft"], Item: {id: "minecraft:diamond", Count: 1b}}

execute at @e[type=item,tag=fresh_craft] run kill @e[type=item,sort=nearest,distance=..1,nbt={Item: {id: "minecraft:glowstone_dust", Count: 1b}}]
execute at @e[type=item,tag=fresh_craft] run kill @e[type=item,sort=nearest,distance=..1,nbt={Item: {id: "minecraft:redstone", Count: 3b}}]
tag @e[type=item,tag=fresh_craft,limit=1,sort=nearest] remove fresh_craft