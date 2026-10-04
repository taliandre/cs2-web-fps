'use strict';
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Health check endpoint for Render.com
app.get('/health', (req, res) => res.status(200).send('OK'));

// Room structure: roomCode -> { code, players: Map<id, { ws, data }>, matchTime: 300, timerInterval }
const rooms = new Map();
let nextPlayerId = 1;

function getOrCreateRoom(roomCode, requestedMap = 'shortdust2') {
  const code = (roomCode || 'PUBLIC').trim().toUpperCase();
  if (!rooms.has(code)) {
    const room = {
      code,
      map: requestedMap || 'shortdust2',
      players: new Map(),
      matchDuration: 300,
      matchTime: 300,
      timerInterval: null
    };

    // 1-second room timer ticker
    room.timerInterval = setInterval(() => {
      if (room.players.size === 0) return;
      if (room.matchTime > 0) {
        room.matchTime -= 1;
        if (room.matchTime <= 0) {
          room.matchTime = 0;
          broadcastRoom(room, { type: 'match_ended' });
        }
      }
    }, 1000);

    rooms.set(code, room);
    console.log(`[ROOM CREATED] ${code} (Map: ${room.map})`);
  }
  return rooms.get(code);
}

function broadcastRoom(room, message, excludeWs = null) {
  const json = JSON.stringify(message);
  for (const [id, p] of room.players) {
    if (p.ws !== excludeWs && p.ws.readyState === WebSocket.OPEN) {
      try { p.ws.send(json); } catch (err) {}
    }
  }
}

wss.on('connection', (ws) => {
  let currentRoom = null;
  let playerId = 'p_' + (nextPlayerId++);
  let playerData = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      if (msg.type === 'join') {
        const roomCode = (msg.room || 'PUBLIC').trim().toUpperCase();
        const playerName = (msg.name || ('Player ' + playerId.slice(2))).trim().slice(0, 16);
        currentRoom = getOrCreateRoom(roomCode, msg.map);
        if (msg.map && currentRoom.players.size === 0) {
          currentRoom.map = msg.map;
        }

        playerData = {
          id: playerId,
          name: playerName,
          room: currentRoom.code,
          pos: msg.pos || { x: (Math.random() - 0.5) * 20, y: 0, z: (Math.random() - 0.5) * 20 },
          vel: { x: 0, y: 0, z: 0 },
          yaw: 0,
          pitch: 0,
          hp: 100,
          armor: 100,
          kills: 0,
          deaths: 0,
          headshots: 0,
          weapon: 0,
          alive: true,
          invulnUntil: Date.now() + 1000,
          team: currentRoom.players.size % 2 === 0 ? 'CT' : 'T',
          color: currentRoom.players.size % 2 === 0 ? 0x3a6ab0 : 0xb03a3a
        };

        currentRoom.players.set(playerId, { ws, data: playerData });

        // Gather existing players in room
        const existingList = [];
        for (const [id, p] of currentRoom.players) {
          if (id !== playerId) existingList.push(p.data);
        }

        // Welcome player with room details
        ws.send(JSON.stringify({
          type: 'joined',
          myId: playerId,
          room: currentRoom.code,
          map: currentRoom.map || 'shortdust2',
          matchTime: currentRoom.matchTime,
          players: existingList
        }));

        // Notify room members
        broadcastRoom(currentRoom, {
          type: 'player_joined',
          player: playerData
        }, ws);

        console.log(`[PLAYER JOINED] ${playerData.name} (${playerId}) -> Room: ${currentRoom.code} (Total: ${currentRoom.players.size})`);
      }
      else if (msg.type === 'move' && currentRoom && playerData) {
        playerData.pos = msg.pos;
        playerData.vel = msg.vel;
        playerData.yaw = msg.yaw;
        playerData.pitch = msg.pitch;
        playerData.weapon = msg.weapon;
        playerData.crouch = msg.crouch;
        playerData.walk = msg.walk;

        broadcastRoom(currentRoom, {
          type: 'player_moved',
          id: playerId,
          pos: msg.pos,
          vel: msg.vel,
          yaw: msg.yaw,
          pitch: msg.pitch,
          weapon: msg.weapon,
          crouch: msg.crouch,
          walk: msg.walk
        }, ws);
      }
      else if (msg.type === 'shoot' && currentRoom && playerData) {
        broadcastRoom(currentRoom, {
          type: 'player_shot',
          id: playerId,
          origin: msg.origin,
          dir: msg.dir,
          weaponId: msg.weaponId,
          muzzle: msg.muzzle
        }, ws);
      }
      else if (msg.type === 'hit' && currentRoom && playerData) {
        const victimEntry = currentRoom.players.get(msg.targetId);
        if (victimEntry && victimEntry.data.alive) {
          const victim = victimEntry.data;
          if (victim.invulnUntil && Date.now() < victim.invulnUntil) {
            return;
          }
          victim.hp = Math.max(0, victim.hp - msg.dmg);

          if (victim.hp <= 0) {
            victim.alive = false;
            victim.deaths++;
            playerData.kills++;
            if (msg.head) playerData.headshots++;

            broadcastRoom(currentRoom, {
              type: 'player_killed',
              killerId: playerId,
              victimId: msg.targetId,
              weaponId: msg.weaponId,
              head: !!msg.head
            });
          } else {
            broadcastRoom(currentRoom, {
              type: 'player_damaged',
              targetId: msg.targetId,
              attackerId: playerId,
              hp: victim.hp,
              head: !!msg.head
            });
          }
        }
      }
      else if (msg.type === 'respawn' && currentRoom && playerData) {
        playerData.alive = true;
        playerData.hp = 100;
        playerData.pos = msg.pos;
        playerData.invulnUntil = Date.now() + 1000;
        broadcastRoom(currentRoom, {
          type: 'player_respawned',
          id: playerId,
          pos: msg.pos
        }, ws);
      }
      else if (msg.type === 'restart_match' && currentRoom) {
        currentRoom.matchTime = currentRoom.matchDuration;
        for (const [id, p] of currentRoom.players) {
          p.data.kills = 0;
          p.data.deaths = 0;
          p.data.headshots = 0;
          p.data.hp = 100;
          p.data.alive = true;
          p.data.invulnUntil = Date.now() + 1000;
        }
        broadcastRoom(currentRoom, {
          type: 'match_restarted',
          matchTime: currentRoom.matchTime
        });
      }
      else if (msg.type === 'leave' && currentRoom && playerId) {
        currentRoom.players.delete(playerId);
        broadcastRoom(currentRoom, { type: 'player_left', id: playerId }, ws);
        console.log(`[PLAYER LEFT] ${playerData ? playerData.name : playerId} left room ${currentRoom.code} (Remaining: ${currentRoom.players.size})`);
        if (currentRoom.players.size === 0) {
          clearInterval(currentRoom.timerInterval);
          rooms.delete(currentRoom.code);
          console.log(`[ROOM DELETED] ${currentRoom.code} is now empty.`);
        }
        currentRoom = null;
        playerData = null;
      }
    } catch (err) {
      console.error('[WS ERROR]', err);
    }
  });

  ws.on('close', () => {
    if (currentRoom && playerId) {
      currentRoom.players.delete(playerId);
      broadcastRoom(currentRoom, { type: 'player_left', id: playerId });
      console.log(`[PLAYER LEFT] ${playerId} from ${currentRoom.code} (Remaining: ${currentRoom.players.size})`);

      if (currentRoom.players.size === 0) {
        clearInterval(currentRoom.timerInterval);
        rooms.delete(currentRoom.code);
        console.log(`[ROOM DELETED] ${currentRoom.code} is now empty.`);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  CS2 LOW-POLY FFA MULTIPLAYER SERVER ACTIVE  `);
  console.log(`  Local URL:   http://localhost:${PORT}        `);
  console.log(`  Deploy:      Ready for Render.com / Railway `);
  console.log(`===============================================`);

  // Render Keep-Alive: Ping itself every 9 minutes to avoid free-tier spin down
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    const pingProto = renderUrl.startsWith('https') ? require('https') : require('http');
    setInterval(() => {
      pingProto.get(`${renderUrl}/health`, (res) => {
        console.log(`[KEEP-ALIVE] Pinged ${renderUrl}/health (${res.statusCode})`);
      }).on('error', (err) => {
        console.warn('[KEEP-ALIVE WARN]', err.message);
      });
    }, 9 * 60 * 1000);
    console.log(`[KEEP-ALIVE] Auto-ping active for ${renderUrl}`);
  }
});

