/**
 * Feature: Anti-Sticker System
 * System: TOM PRIME X
 * Author: ToxRon
 */

const stickerTracker = new Map();

module.exports = {
    name: 'antisticker',
    category: 'admin',
    async execute(sock, msg, { from, sender, isGroup, isBotAdmin }) {
        try {
            // 1. Group Context Check
            if (!isGroup) return; 

            // 2. Sticker Detection Logic
            if (msg.message.stickerMessage) {
                const now = Date.now();
                const userState = stickerTracker.get(sender) || { count: 0, lastTime: 0 };

                // Track stickers sent within 3 seconds
                if (now - userState.lastTime < 3000) {
                    userState.count++;
                } else {
                    userState.count = 1;
                }

                userState.lastTime = now;
                stickerTracker.set(sender, userState);

                // 3. Action: Delete & Kick
                if (userState.count >= 2) {
                    if (!isBotAdmin) return;

                    // Remove the offending sticker
                    await sock.sendMessage(from, { delete: msg.key });

                    // Notification & Removal
                    await sock.sendMessage(from, { 
                        text: `*⚠️ sᴛɪᴄᴋᴇʀ sᴘᴀᴍ ᴅᴇᴛᴇᴄᴛᴇᴅ!*\n\n*ᴜsᴇʀ:* @${sender.split('@')[0]}\n*ᴀᴄᴛɪᴏɴ:* ɪɴsᴛᴀɴᴛ ᴋɪᴄᴋ\n*sʏsᴛᴇᴍ:* ᴛᴏᴍ ᴘʀɪᴍᴇ x`, 
                        mentions: [sender] 
                    });

                    await sock.groupParticipantsUpdate(from, [sender], 'remove');

                    // Reset tracking
                    stickerTracker.delete(sender);
                } else {
                    // Delete even the first sticker to keep group clean
                    if (isBotAdmin) {
                        await sock.sendMessage(from, { delete: msg.key });
                    }
                }
            }
        } catch (err) {
            console.error('[ANTISTICKER ERROR]', err);
        }
    }
};
