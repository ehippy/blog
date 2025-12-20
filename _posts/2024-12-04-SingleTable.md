---
title: "Single-Table Database Design"
featured_image: /images/arcs.jpg
tags: [Infrastructure, Game Design, Software Engineering]
---

I've wanted to do this videogame for years. I've started it handful of times, in C#, Python, Node. Well, with some time on my hands, I finally got around to really taking a good swing at it. I started by picking up the last version of it I'd started a couple years ago. For the last two weeks, I've been enjoying really getting into some fullstack creation.
<!--more--> 

Part of this nascent codebase was a Postgres flavored `Sequelize` ORM that had a few tables in it, and after those couple weeks, I'd expanded to what you see here. 

![Database diagram for Infight.io](/images/infightDbDiagram.png)]

`Guilds`, `Players`, `PlayerGuilds`, `Games`, `GamePlayers` and `Moves` are all these little bits and pieces of the information the game needs to let users have accounts and manage their play on this board game. This was all good, a nice normalized collection of what I needed. It's nice and old-school, cozy.

Time came to start thinking about putting this thing on the internet and I kept getting sweating one main thing: Paying to run this database and this app server up in the cloud. Spinning up a tiny Postgres and a tiny app server on Amazon was going to run me $30 a month or so. 

## Saving dozens of dollars by spending dozens of hours

So, being morally-outraged at Bezos wanting $15/mo to run some open-source database software for me, I'm kicking around to see what's up with DynamoDB these days. All the girls are all atwitter about this pattern-de-jour called [Single-Table Design](https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/).

The idea is, instead of having those **SIX** tables from earlier, you jam all of that information into one pennies-per-month cloud table and then leveraging some sassy indexing magic.

DynamoDB is amazingly fast and scaleable because it makes you play its way, and it's way is this:
  - You can have any data you want in a table so long as you always *know* its Partition (and Range) Key(s) to access it. There's very little searchability in Dynamo natively.

 Single-Table Design asks us to get funky by designing a system of keys that let all these relational tables exist in the same DynamoDB table. 

 ## Has anyone seen my keys
So to start I want to have some PKs that looks like these:

 - `Guild:48xx37hh9x3mh`
 - `Player:mc62mcm03cn`
 - `Game:203nfcf4c4`

The hash marks are like alphanums, or ints for each individual item. I'll know those from their Discord login (Guild and Player), or inbound hyperlinks (Game). Important to note here, and super different from relational-land is that the Entity name is _part of the id value_. Then in each of these cases, next to that PK you store whatever other properties Guilds or Players have.

| PK | SK | ... |
| -------- | ------- |
|Guild:xxx|details|`{ServerName, ...}`|
|Player:xxx|details|`{UserName, avatar, email, ...}`|
|Game:xxx|details|`{startDate, avatar, email, ...}`|
|Game:xxx|Player:xxx|`{xPosition, yPosition, hp, ...}`|
|Game:xxx|Player:yyy|`{xPosition, yPosition, hp, ...}`|

It's __bananas__ for a relational kid to see those two types of data in the same table together.

Ok, so how are we doing relationships here? 

So get this: the `GamePlayers`, the many-to-many joining table in the relational schema? We just reuse the gameId, but then add a sort Key with the PlayerId in it.

| PK | SK | ... |
| -------- | ------- |
|Game:xxx|Player:xxx|`{xPosition, yPosition, hp, ...}`|
|Game:xxx|Player:yyy|`{xPosition, yPosition, hp, ...}`|

One trick dynamo can do is let you query *partial* range keys, so you can ask Give me `Game:x` and all whose range starts with `Player:` to get every player in a game.

Expanding on that, you can just say, give me everything for `Game:x`, and then in one query, you're getting back all of the game details including GamePlayers in a single, instant-fast query.

Neat stuff and new to me!