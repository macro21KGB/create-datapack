# Create a Datapack Fast and Easily

This very simple CLI can generate a default data pack folder structure, while also generating global advancements that allow the pack to integrate with other datapacks.

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

- The **Auto-uninstaller**,It will scan your datapack an create an **uninstall.mcfunction** just for you, (run it in the root directory, where is the pack.mcmeta file)

- The **Summon-Give Convert**, Convert your commands into **give to summon** or **summon to give**

```
create-datapack -m
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

### Info

You can create all possible files with this system, The **location in the datapack folder structure** part is without error handling so be careful.

All the folder paths can be found on the [wiki](https://minecraft.fandom.com/wiki/Data_Pack) and as shown in the example you can create sub folders and **extensions are added automatically**

## Where can i found the templates folder?

When you are going to use a template, the path to the templates folder will appear inside the CLI, go to the indicated path and add or modify whatever you want.
