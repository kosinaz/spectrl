# SpectRL: Arakhon's Ascension

## Introduction

SpectRL: Arakhon's Ascension is a browser-based retro fantasy roguelike turn-based RPG about a dragonspawn who wants to ascend to the highest plane of existence. The game is set in the multidimensional world of Spect, featuring procedurally-generated 6-dimensional dungeons.

## Description

As Arakhon, the despised oblityian dragonspawn, your goal is to reach Aribaia, the highest plane of Spect. In addition to width, height, and depth, the world of Spect also has the dimensions of the color spectrum, the substantial structure, and the substantial surface. Therefore everything and everyone has a number of different versions in this world. Every version of them has a different structure, surface, and color, but deep inside, they are still the same. So keep in mind, animate or inanimate, some of them will help you, some of them will hurt you, based on which plane they are on.

### Dimensions

The game is rendered in two dimensions, width, and height. It displays the different levels of depth with brightnesses, the color with hues, the structure with characters, and the surface with typefaces. Lowercase characters are living beings, uppercase characters are impassable obstacles, and the dot represents the floor.

Brightnesses: c0, 80, 40

Hues: red, green, blue

Characters: a, b, c

Typefaces: basicmanual, smalltypewriting, typori

### Planes

Every plane has its unique name starting with the character of the structure, followed by the name of the color shortened by two characters, concatenated with the first two characters of the typeface name, and finally ended with '-ia'. If the character is a consonant an extra '-i' is getting added to it. If the shortened color ends with a consonant an extra '-i' is getting added to it. The inhabitants of the plane are called as the name of the plane extended with an '-n'.

Examples:

A + red - ed + i + basicmanual - sicmanual + ia/n = Aribaia/aribaian

B + green - en + smalltypewriting - alltypewriting + ia/n = Bigresmia/bigresmian

C + blue - ue + i + typori - pori + ia/n = Ciblityia/ciblityian

C + green - ed + i + basicmanual - sicmanual + ia/n = Cigrebaian/cigrebaian

Every plane has a specific pair of dimension gates connecting each other. You can traverse depth with < and >, color with { and }, structure with [ and ], and surface with ( and ). Width and height are traversable without gates, but planes are divided into rarely connected chambers filled with rooms and corridors.
