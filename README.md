# Fat-latto

A weighted lottery group decision Discord bot

## TODOs:

### [ ] Tables

  - [ ] guilds: servers the bot is in
  - [ ] channels: per-channel settings like purpose, lottery defaults, and public sharing
  - [ ] choices: options users register to a channel's pool
  - [ ] participants: each user's loss count and paused state per channel
  - [ ] bans: users banned from lotteries server-wide
  - [ ] lotteries: each lottery event, its settings, status, and timer
  - [ ] lottery_entrants: who took part in each lottery and their weight at draw time
  - [ ] draws: the result of each draw, including rerolls
  - [ ] schema_migrations: which schema versions have been applied

### [ ] Commands

  - [ ] /choice
    - [ ] add: register a new choice to your pool in this channel
    - [ ] edit: update one of your choices
    - [ ] remove: delete one of your choices
    - [ ] list: list your choices, or a specified user's
    
  - [ ] /lottery
    - [ ] start: run a lottery immediately for the channel or specified users
    - [ ] post: create a timed lottery post with Join and Leave buttons
    - [ ] end: close an open lottery early and draw a winner
    - [ ] cancel: cancel an open lottery without drawing
    - [ ] reroll: redo the last draw and undo its loss changes
    - [ ] odds: show current odds and loss counts for this channel
    - [ ] history: show past lottery results for this channel

  - [ ] /server
    - [ ] choices: list all users' choices across the server
    - [ ] participants: list all users with registered choices

  - [ ] /me
    - [ ] delete-data: delete all of your data from the bot
    - [ ] pause: temporarily exclude yourself from lotteries in this channel
    - [ ] resume: rejoin lotteries in this channel


  - [ ] /admin
    - [ ] choice
      - [ ] add: add a choice to a specified user's pool
      - [ ] edit: update a specified user's choice
      - [ ] remove: delete a specified user's choice
    - [ ] losses
      - [ ] reset: reset a user's loss count
      - [ ] set: set a user's loss count to a specific value
    - [ ] ban: ban a user from future lotteries
    - [ ] unban: lift a user's ban
    - [ ] purge-user: delete all data for a specified user

  - [ ] /config
    - [ ] purpose: set what this channel's lotteries are for
    - [ ] defaults: set default options for lottery commands
    - [ ] sharing: allow or disallow public sharing of odds and history

  - [ ] /help: overview of commands by category

  - [ ] /about: bot info with links to the terms of service and privacy policy

  - [ ] /docs: link to the full guide on choices and lotteries
