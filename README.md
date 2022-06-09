# Create a Datapack Fast and Easily

This very simple CLI can generate a default data pack folder structure, while also generating global advancements that allow the pack to integrate with other datapacks.

> **NEW STRUCTURE-GENERATOR MODULE** Added to the available modules

[**You can check the datapack conventions here**](https://ooboomberoo.github.io/mcdatapacks-wiki/conventions/datapack_advancement.html)

## Usage

[**Install nodejs**](https://nodejs.org)

then type in your **terminal** to install the CLI globally:

```
npm i -g @macro21kgb/create-datapack
```

After that you can create a new datapack in the current directory with

```
create-datapack
```

or

```
npx create-datapack
```

# NEW MODULES FEATURES

Now with this command you can access different modules for any occasion

- The **Structure-Generator**, It will create from a template (see below), a mcfunction with the all the necessary setblock call, (the file are with .mcs extension)

- The **Auto-uninstaller**,It will scan your datapack an create an **uninstall.mcfunction** just for you, (run it in the root directory, where is the pack.mcmeta file)

- The **Summon-Give Convert**, Convert your commands into **give to summon** or **summon to give** (a little bit buggy but it is ok for most thing)

- The **Generator-Sites Module**, This will give you the link of some of my custom generators (floor-crafting and crafting table recipe)

```
create-datapack -m

or 

create-datapack --modules
```

# Template System (.mclate)

The templates are written in a **custom language**, it is very **simple** and **easy to use**, below there is an example of everything you can do:

```
<###>Test Template <-- name of the template, must be first line

<===functions:load  <-- location of the file : name of the function without extension (auto-added)
scoreboard objectives add tf_rc dummy
scoreboard objectives add tf_detection minecraft.used:minecraft.carrot_on_a_stick
===>

<===functions:main
execute as @a[scores={tf_detection=1..}] at @s run say CLICK
execute as @a[scores={tf_detection=1..}] at @s run function NAMESPACE:start_raycast
execute as @a[scores={tf_detection=1..}] at @s run scoreboard players set @s tf_detection 0
===>

<===functions/test/subfolder:test  <-- you can create sub-folder easily like that
say super duper test
===>

<===tags/blocks:passable_blocks  <-- NOT only functions!
{
  "values":[
    "minecraft:air",
    "minecraft:void_air",
    "minecraft:cave_air",
    "minecraft:water",
    "minecraft:lava",
    "minecraft:grass"
}
===>


```

### Delimiters for the custom template

Name of the template

```
<###>This is the Name of the Template
```

File start and end **markers** (you can obviously create multiple files in a template):

```
<===file_location/folder:name_of_the_file   <-- start of a file

===> <-- end of the file
```

When executing function and you need the namespace of the datapack, set it like this (use **NAMESPACE**):

```elixir
<===functions:main
execute as @a[scores={tf_detection=1..}] at @s run say CLICK
execute as @a[scores={tf_detection=1..}] at @s run function NAMESPACE:start_raycast <-- the namespace is taken automatically
execute as @a[scores={tf_detection=1..}] at @s run scoreboard players set @s tf_detection 0
===>
```

# Template System for Structure (.mcs)
The template syntax is very simple and easy to use, you simply create your structure layer by layer.

This schematic will create a 3x3 cube of stone with an hole in the middle:
```
S S S <-- this is the first layer
S S S <-- space between each symbol
S S S
---   <-- three "-", it means to go up one level
S S S <-- this is the second layer and so on...
S A S
S S S
---
S S S
S S S
S S S
===   <-- it means that the schematic is finished
S minecraft:stone <-- symbol block_associated_with
A minecraft:air

```
the structre-generator module will create in the function folder a new file named "templatefilenamehere".mcfunction

Also, yeah i can do some check and convert some commands in fill, ecc.. but for now is good enough.

## Info

You can create all possible files with this system, The **location in the datapack folder structure** part is without error handling so be careful.

All the folder paths can be found on the [wiki](https://minecraft.fandom.com/wiki/Data_Pack) and as shown in the example you can create sub folders and **extensions are added automatically**

## Where can i found the templates folder?

When you are going to use a template, the path to the templates folder will appear inside the CLI, go to the indicated path and add or modify whatever you want.


## Bugs or something else?

If you encounter bugs or some missed features that you want, create a new issue on github, and i will check it out as soon as possible.
[create-datapack-github](https://github.com/macro21KGB/create-datapack)

If you want, you can also message me on PMC (Planet Minecaft) website

[My PMC Profile](https://www.planetminecraft.com/member/macro21kgb)