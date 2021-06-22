/*
BY Lanz
*/
const
	{
		WAConnection,
		MessageType,
		Presence,
		MessageOptions,
		Mimetype,
		WALocationMessage,
		WA_MESSAGE_STUB_TYPES,
		ReconnectMode,
		ProxyAgent,
		GroupSettingChange,
		waChatKey,
		mentionedJid,
		processTime,
} = require("@adiwajshing/baileys");
const moment = require("moment-timezone");
const fs = require("fs");
const { exec } = require('child_process');
const lanz = require('./whatsapp/message.js');
const speed = require('performance-now');
const ffmpeg = require('fluent-ffmpeg');
const conn = require('./whatsapp/connect');
const { color } = require('./lib/color');
const mess = JSON.parse(fs.readFileSync('./whatsapp/mess.json'));
const axios = require('axios');
const Exif = require('./lib/exif');
const { uptotele, uptonaufal, uploadFile } = require('./lib/uploadimage')
const exif = new Exif();

conn.connect()
const lanz = conn.lanz

fake = "LoL Human"
fakeimage = fs.readFileSync("./media/lanzwe.jpeg")
prefix = 'z'
blocked = []
baterai = {
    baterai: 0,
    cas: false
}
public = false

lanz.on('CB:Blocklist', json => {
	if (blocked.length > 2) return
	for (let i of json[1].blocklist) {
		blocked.push(i.replace('c.us','s.whatsapp.net'))
	}
})
lanz.on('CB:action,,battery', json => {
	const a = json[2][0][1].value
	const b = json[2][0][1].live
	baterai.baterai = a
	baterai.cas = b
})
lanz.on('message-update', async (msg) => { 
	require('./antidelete/antidelete.js')(lanz, msg)
})
lanz.on('message-new', async(qul) => {
    try {
        if (!qul.message) return
		if (qul.key && qul.key.remoteJid == 'status@broadcast') return
        qul.message = (Object.keys(qul.message)[0] === 'ephemeralMessage') ? qul.message.ephemeralMessage.message : qul.message
		let infoMSG = JSON.parse(fs.readFileSync(`./antidelete/msg.data.json`))
		infoMSG.push(JSON.parse(JSON.stringify(qul)))
		fs.writeFileSync(`./antidelete/msg.data.json`, JSON.stringify(infoMSG, null, 2))
		const urutan_pesan = infoMSG.length
		if (urutan_pesan === 5000) {
			infoMSG.splice(0, 4300)
			fs.writeFileSync(`./antidelete/msg.data.json`, JSON.stringify(infoMSG, null, 2))
		}
        global.prefix
		const content = JSON.stringify(qul.message)
		const from = qul.key.remoteJid
		const type = Object.keys(qul.message)[0]
		const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
		const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
		body = (type === 'conversation' && qul.message.conversation.startsWith(prefix)) ? qul.message.conversation : (type == 'imageMessage') && qul.message.imageMessage.caption.startsWith(prefix) ? qul.message.imageMessage.caption : (type == 'videoMessage') && qul.message.videoMessage.caption.startsWith(prefix) ? qul.message.videoMessage.caption : (type == 'extendedTextMessage') && qul.message.extendedTextMessage.text.startsWith(prefix) ? qul.message.extendedTextMessage.text : ''
		chats = (type === 'conversation') ? qul.message.conversation : (type === 'extendedTextMessage') ? qul.message.extendedTextMessage.text : ''
		const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
		const args = body.trim().split(/ +/).slice(1)
		const isCmd = body.startsWith(prefix)
		const q = args.join(" ")
		const arg = chats.slice(command.length + 2, chats.length)

        const botNumber = lanz.user.jid
		const isGroup = from.endsWith('@g.us')
		const sender = qul.key.fromMe ? lanz.user.jid : isGroup ? qul.participant : qul.key.remoteJid
		const totalchat = await lanz.chats.all()
		const groupMetadata = isGroup ? await lanz.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupDesc = isGroup ? groupMetadata.desc : ''
		const groupAdmins = isGroup ? lanz.getGroupAdmins(groupMembers) : ''
		const groupOwner = isGroup ? groupMetadata.owner : ''
		const itsMe = qul.key.fromMe ? true : false
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
		}

        const isMedia = (type === 'imageMessage' || type === 'videoMessage')
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
		const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
		if (itsMe){
			if (chats.toLowerCase() === `${prefix}self`){
				public = false
				lanz.sendFakeStatus(from, `Sukses`, `Status: SELF`)
			}
			if (chats.toLowerCase() === 'status'){
				lanz.sendFakeStatus(from, `STATUS: ${public ? 'PUBLIC' : 'SELF'}`)
			}/*
			if (chats.startsWith('>')){
				console.log(color('[EVAL]'), color(moment(qul.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Eval brooo`))
				return lanz.reply(from, JSON.stringify(eval(chats.slice(2)), null, 2), qul)
			}*/
		}
		if (!public){
			if (!qul.key.fromMe) return
		}
	if (isCmd && !isGroup) {console.log(color('[CMD]'), color(moment(qul.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))}
        if (isCmd && isGroup) {console.log(color('[CMD]'), color(moment(qul.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(lanz.user.name), 'in', color(groupName))}
        switch (command) {
			case 'menu': case 'help':
				textnya = `	𝐗𝐈𝐍𝐙-𝐒𝐄𝐋𝐅𝐁𝐎𝐓

\`\`\`▢ ${prefix}sticker\`\`\`
\`\`\`▢ ${prefix}swm nama | author\`\`\`
\`\`\`▢ ${prefix}takestick namma | author\`\`\`
\`\`\`▢ ${prefix}colong <reply stiker>\`\`\`
\`\`\`▢ ${prefix}eval <java scripts>\`\`\`
\`\`\`▢ ${prefix}self\`\`\`
\`\`\`▢ ${prefix}public\`\`\`
\`\`\`▢ ${prefix}hidetag\`\`\`
\`\`\`▢ ${prefix}runtime\`\`\`
\`\`\`▢ ${prefix}speed\`\`\`
\`\`\`▢ ${prefix}mystat\`\`\`
\`\`\`▢ ${prefix}kontak\`\`\`
\`\`\`▢ ${prefix}hidetag\`\`\`
\`\`\`▢ ${prefix}term\`\`\`
\`\`\`▢ ${prefix}setreply\`\`\`
\`\`\`▢ ${prefix}setprefix\`\`\`
\`\`\`▢ ${prefix}setname\`\`\`
\`\`\`▢ ${prefix}setpp\`\`\`
\`\`\`▢ ${prefix}setbio\`\`\`
\`\`\`▢ ${prefix}fdeface\`\`\`
\`\`\`▢ ${prefix}fakethumbnail\`\`\`
\`\`\`▢ ${prefix}setthumb\`\`\`
\`\`\`▢ ${prefix}getpic\`\`\`
\`\`\`▢ ${prefix}stickertag\`\`\`
\`\`\`▢ ${prefix}imgtag\`\`\`
\`\`\`▢ ${prefix}kontaktag\`\`\`
\`\`\`▢ ${prefix}doctag\`\`\`
\`\`\`▢ ${prefix}giftag\`\`\`
\`\`\`▢ ${prefix}tahta teks\`\`\`
\`\`\`▢ ${prefix}pubg teks1|teks2\`\`\`
\`\`\`▢ ${prefix}promote\`\`\`
\`\`\`▢ ${prefix}demote\`\`\`
\`\`\`▢ ${prefix}kick\`\`\`
\`\`\`▢ ${prefix}add\`\`\`
\`\`\`▢ ${prefix}creategrup nama|tag\`\`\`
\`\`\`▢ ${prefix}getgrup\`\`\`
\`\`\`▢ ${prefix}upstatus text\`\`\`
\`\`\`▢ ${prefix}tovideo\`\`\`
\`\`\`▢ ${prefix}togif\`\`\`
\`\`\`▢ ${prefix}spam teks|jumlah spam\`\`\`
\`\`\`▢ ${prefix}imgtourl\`\`\`
\`\`\`▢ ${prefix}ephemeral <teks>\`\`\`
\`\`\`▢ ${prefix}antidelete\`\`\`
\`\`\`▢ ${prefix}tourl <media>\`\`\`
\`\`\`▢ ${prefix}lol\`\`\`

*© lanz-Team*`
				lanz.sendFakeStatusWithImg(from, fakeimage, textnya, fake)
				break
            case 'test':
                lanz.sendText(from, 'oke')
				break
			case 'public':
				public = true
				lanz.sendFakeStatus(from, `Status: PUBLIC`, fake)
				break
			case 'exif':
				if (!itsMe) return
				if (args.length < 1) return lanz.reply(from, `Penggunaan ${prefix}exif nama|author`, qul)
				if (!arg.split('|')) return lanz.reply(from, `Penggunaan ${prefix}exif nama|author`, qul)
				exif.create(arg.split('|')[0], arg.split('|')[1])
				lanz.reply(from, 'sukses', qul)
				break
			case 'sticker':
			case 'stiker':
			case 's':
				if (isMedia && !qul.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								lanz.reply(from, mess.error.api, qul)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return lanz.reply(from, mess.error.api, qul)
									lanz.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), qul)
									fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else if ((isMedia && qul.message.videoMessage.fileLength < 10000000 || isQuotedVideo && qul.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					lanz.reply(from, mess.wait, qul)
						await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								lanz.reply(from, mess.error.api, qul)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return lanz.reply(from, mess.error.api, qul)
									lanz.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), qul)
									fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else {
					lanz.reply(from, `Kirim gambar/video dengan caption ${prefix}sticker atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`, qul)
				}
				break
			case 'swm':
			case 'stickerwm':
				if (isMedia && !qul.message.videoMessage || isQuotedImage) {
					if (!arg.includes('|')) return lanz.reply(from, `Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`, qul)
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					const packname1 = arg.split('|')[0]
					const author1 = arg.split('|')[1]
					exif.create(packname1, author1, `stickwm_${sender}`)
					await ffmpeg(`${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								lanz.reply(from, mess.error.api, qul)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return lanz.reply(from, mess.error.api, qul)
									lanz.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), qul)
									fs.unlinkSync(media)	
									fs.unlinkSync(`./sticker/${sender}.webp`)	
									fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else if ((isMedia && qul.message.videoMessage.fileLength < 10000000 || isQuotedVideo && qul.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
					if (!arg.includes('|')) return lanz.reply(from, `Kirim gambar atau reply gambar dengan caption *${prefix}stickerwm nama|author*`, qul)
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
					const packname1 = arg.split('|')[0]
					const author1 = arg.split('|')[1]
					exif.create(packname1, author1, `stickwm_${sender}`)
					lanz.reply(from, mess.wait, qul)
						await ffmpeg(`${media}`)
							.inputFormat(media.split('.')[4])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								lanz.reply(from, mess.error.api, qul)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
									if (error) return lanz.reply(from, mess.error.api, qul)
									lanz.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), qul)									
									fs.unlinkSync(media)
									fs.unlinkSync(`./sticker/${sender}.webp`)
									fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(`./sticker/${sender}.webp`)
				} else {
					lanz.reply(from, `Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`, id)
				}
				break
			case 'takestick':
				if (!isQuotedSticker) return lanz.reply(from, `Reply sticker dengan caption *${prefix}takestick nama|author*`, qul)
				const pembawm = body.slice(11)
				if (!pembawm.includes('|')) return lanz.reply(from, `Reply sticker dengan caption *${prefix}takestick nama|author*`, qul)
				const encmedia = JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				const media = await lanz.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
				const packname = pembawm.split('|')[0]
				const author = pembawm.split('|')[1]
				exif.create(packname, author, `takestick_${sender}`)
				exec(`webpmux -set exif ./sticker/takestick_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
					if (error) return lanz.reply(from, mess.error.api, qul)
					lanz.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), qul)
					fs.unlinkSync(media)
					fs.unlinkSync(`./sticker/takestick_${sender}.exif`)
				})
				break
	  		 case 'ephemeral'://DhyZx:v
				if (!q) return lanz.reply(from, 'textnya apa brohh', qul)
				lanz.sendMessage(from, `${q}`,
					MessageType.text, {
					sendEphemeral: true,
					thumbnail: fs.readFileSync('./media/lanz.jpeg')
					})
				break
			case 'colong':
				if (!isQuotedSticker) return lanz.reply(from, `Reply sticker dengan caption *${prefix}colong*`, qul)
				const encmediia = JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				const meidia = await lanz.downloadAndSaveMediaMessage(encmediia, `./sticker/${sender}`)
				exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
					if (error) return lanz.reply(from, mess.error.api, qul)
					lanz.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), qul)
					fs.unlinkSync(meidia)
				})
				break
			case 'hidetag':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}hidetag teks`, qul)
				lanz.hideTag(from, arg)
				break
			case 'runtime':
				run = process.uptime()
				let text = lanz.runtime(run)
				lanz.sendFakeStatus(from, text, `Runtime bro`)
				break
			case 'speed': case 'ping':
				let timestamp = speed();
				let latensi = speed() - timestamp
				lanz.sendFakeStatus(from, `Speed: ${latensi.toFixed(4)}second`, fake)
				break
			case 'mystat': case 'mystatus':
				let i = []
				let giid = []
				for (mem of totalchat){
					i.push(mem.jid)
				}
				for (id of i){
					if (id && id.includes('g.us')){
						giid.push(id)
					}
				}
                let timestampi = speed();
				let latensii = speed() - timestampi
                const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = lanz.user.phone
                anu = process.uptime()
                teskny = `*V. Whatsapp :* ${wa_version}
*Baterai :* ${baterai.baterai}%
*Charge :* ${baterai.cas === 'true' ? 'Ya' : 'Tidak'}
*RAM :* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*MCC :* ${mcc}
*MNC :* ${mnc}
*Versi OS :* ${os_version}
*Merk HP :* ${device_manufacturer}
*Versi HP :* ${device_model}

*Group Chat :* ${giid.length}
*Personal Chat :* ${totalchat.length - giid.length}
*Total Chat :* ${totalchat.length}
*Speed :* ${latensii.toFixed(4)} Second
*Runtime :* ${lanz.runtime(anu)}`
				lanz.sendFakeStatus(from, teskny, fake)
				break
			case 'kontak':
				argz = arg.split('|')
				if (!argz) return lanz.reply(from, `Penggunaan ${prefix}kontak @tag atau nomor|nama`, qul)
				if (qul.message.extendedTextMessage != undefined){
                    mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					lanz.sendKontak(from, mentioned[0].split('@')[0], argz[1])
				} else {
					lanz.sendKontak(from, argz[0], argz[1])
				}
				break
			case 'term':
				if (!itsMe) return
				if (!arg) return
				exec(arg, (err, stdout) => {
					if (err) return lanz.sendFakeStatus(from, err, fake)
					if (stdout) lanz.sendFakeStatus(from, stdout, fake)
				})
				break
			case 'setreply':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}setreply teks`, qul)
				fake = arg
				lanz.sendFakeStatus(from, `Sukses`, fake)
				break
			case 'setprefix':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}setprefix prefix`, qul)
				prefix = arg
				lanz.sendFakeStatus(from, `Prefix berhasil diubah menjadi ${prefix}`, fake)
				break
			case 'setname':
				if (!itsMe) return
				if (!arg) return lanz.reply(from, 'masukkan nama', qul)
				lanz.setName(arg)
				.then((res) => lanz.sendFakeStatus(from, JSON.stringify(res), fake))
				.catch((err) => lanz.sendFakeStatus(from, JSON.stringify(err), fake))
				break
			case 'setbio':
				if (!itsMe) return
				if (!arg) return lanz.reply(from, 'masukkan bio', qul)
				lanz.setBio(arg)
				.then((res) => lanz.sendFakeStatus(from, JSON.stringify(res), fake))
				.catch((err) => lanz.sendFakeStatus(from, JSON.stringify(err), fake))
				break
			case 'fdeface': case 'hack':
				if (!arg) return lanz.reply(from, `Penggunaaan ${prefix}fdeface url|title|desc|url\n\nContoh : ${prefix}fdeface https://google.com|Self Bot|By lanzzz|https://lanz.com`, qul)
				argz = arg.split("|")
				if (!argz) return lanz.reply(from, `Penggunaaan ${prefix}fdeface url|title|desc|url\n\nContoh : ${prefix}fdeface https://google.com|Self Bot|By lanzzz|https://lanz.com`, qul)
				if ((isMedia && !qul.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo : qul
					let media = await lanz.downloadMediaMessage(encmedia)
					lanz.sendFakeThumb(from, argz[0], argz[1], argz[2], argz[3], media)
				} else {
					lanz.sendFakeThumb(from, argz[0], argz[1], argz[2], argz[3])
				}
				break
			case 'fakethumbnail': case 'fthumbnail': case 'fakethumb':
				if ((isMedia && !qul.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo : qul
					let media = await lanz.downloadMediaMessage(encmedia)
					lanz.sendFakeImg(from, media, arg, fakeimage, qul)
				} else {
					lanz.reply(from, `Kirim gambar atau reply dengan caption ${prefix}fakethumb caption`, qul)
				}
				break
			case 'setthumb':
				boij = JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				delb = await lanz.downloadMediaMessage(boij)
				fs.writeFileSync(`./media/lanz.jpeg`, delb)
				fakeimage = fs.readFileSync(`./media/lanz.jpeg`)
				lanz.sendFakeStatus(from, `Sukses`, fake)
				break
			case 'getpic':
				if (qul.message.extendedTextMessage != undefined){
					mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					try {
						pic = await lanz.getProfilePicture(mentioned[0])
					} catch {
						pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
					}
					thumb = await lanz.getBuffer(pic)
					lanz.sendImage(from, thumb)
				}
				break
			case 'imgtag':
				if ((isMedia && !qul.message.videoMessage || isQuotedImage)) {
					let encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo : qul
					let media = await lanz.downloadMediaMessage(encmedia)
					lanz.hideTagImg(from, media)
				} else {
					lanz.reply(from, `Kirim gambar atau reply dengan caption ${prefix}imgtag caption`, qul)
				}
				break
			case 'sticktag': case 'stickertag':
				if (!isQuotedSticker) return lanz.reply(from, `Reply sticker dengan caption *${prefix}stickertag*`, qul)
				let encmediai = JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo
				let mediai = await lanz.downloadMediaMessage(encmediai)
				lanz.hideTagSticker(from, mediai)
				break
			case 'kontaktag':
				argz = arg.split('|')
				if (!argz) return lanz.reply(from, `Penggunaan ${prefix}kontak @tag atau nomor|nama`, qul)
				if (qul.message.extendedTextMessage != undefined){
                    mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					lanz.hideTagKontak(from, mentioned[0].split('@')[0], argz[1])
				} else {
					lanz.hideTagKontak(from, argz[0], argz[1])
				}
				break
			case 'doctag':  case 'dokumentag': //by Dehanjing
		        if (!isQuotedDocument) return lanz.reply(from, `Reply Document dengan caption *${prefix + command}*`, qul)
                quoted = JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                download = await lanz.downloadMediaMessage(quoted)
                await fs.writeFileSync(`doc.txt`, download)
                var group = await lanz.groupMetadata(from)
                var member = group['participants']
                var mem = []
                member.map(async adm => {
                mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
                })
                lanz.sendMessage(from, fs.readFileSync(`doc.txt`), document, { contextInfo: {mentionedJid: mem }, quoted: qul, mimetype: 'text/plain' })
			    await fs.unlinkSync(`doc.txt`)
			    break
		    case 'giftag':   case 'giphytag': //by Dehanjing
                if (!isQuotedVideo) return reply(`Reply Gif nya dengan caption ${prefix + command}`)
                quoted = JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
                download = await lanz.downloadMediaMessage(quoted)
                await fs.writeFileSync(`giftag.gif`, download)
                var group = await lanz.groupMetadata(from)
                var member = group['participants']
                var mem = []
                member.map(async adm => {
                mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
                })
                thumb = fs.readFileSync(`giftag.gif`)
                lanz.sendMessage(from, thumb, video, { contextInfo: {mentionedJid: mem }, quoted: qul, mimetype: 'video/gif', thumbnail: thumb })
			    await fs.unlinkSync(`giftag.gif`)
			    break
			case 'tahta':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}tahta teks`, qul)
				lanz.sendMediaURL(from, `https://api.zeks.xyz/api/hartatahta?text=${arg}&apikey=apivinz`)
				break
			case 'pubg':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}pubg teks1|teks2`, qul)
				argz = arg.split("|")
				if (!argz) return lanz.reply(from, `Penggunaan ${prefix}pubg teks1|teks2`, qul)
				axios.get(`https://lanzbot-api.herokuapp.com/api/textmaker/game?text=${argz[0]}&text2=${argz[1]}&theme=pubg&apikey=lanzBot`)
				.then((res) => lanz.sendMediaURL(from, res.data.result.url))
				.catch((err) => {
					console.log(err)
					lanz.reply(from, mess.error.api, qul)
				})
				break
			case 'togif':
				if (!isQuotedSticker) return reply(from, 'Reply stiker nya', qul)
				if (qul.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === true){
					const encmedia = JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					const media = await lanz.downloadAndSaveMediaMessage(encmedia)
					const uploadn = await uptonaufal(media, Date.now() + '.webp')
					const anjj = await axios.get(`http://nzcha-apii.herokuapp.com/webp-to-mp4?url=${uploadn.result.image}`)
					thumb = await lanz.getBuffer(anjj.data.result)
					lanz.sendGif(from, thumb)
					fs.unlinkSync(media)
				} else {
					lanz.reply(from, `Harus sticker bergerak`, qul)
				}
				break
			case 'toimg': case 'tovideo':
				if (!isQuotedSticker) return lanz.reply(from, 'Reply stiker nya', qul)
				if (qul.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === true){
					const encmedia = JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					const media = await lanz.downloadAndSaveMediaMessage(encmedia)
					const uploadn = await uptonaufal(media, Date.now() + '.webp')
					const anjj = await axios.get(`http://nzcha-apii.herokuapp.com/webp-to-mp4?url=${uploadn.result.image}`)
					await lanz.sendMediaURL(from, anjj.data.result, 'Nih')
					fs.unlinkSync(media)
				} else {
					const encmedia = JSON.parse(JSON.stringify(qul).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					const media = await lanz.downloadAndSaveMediaMessage(encmedia)
					ran = lanz.getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) {
							lanz.reply(from, `gagal`, qul)
							fs.unlinkSync(ran)
						} else {
							buffer = fs.readFileSync(ran)
							lanz.sendImage(from, buffer, 'nih', qul)
							fs.unlinkSync(ran)
						}
					})
				}
				break
			case 'shutdown':
				await lanz.FakeTokoForwarded(from, `Bye...`, fake)
				await lanz.sleep(5000)
				lanz.close()
				break
			case 'spam':
				if (!itsMe) return
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}spam teks|jumlahspam`, qul)
				argz = arg.split("|")
				if (!argz) return lanz.reply(from, `Penggunaan ${prefix}spam teks|jumlah`, qul)
				if (isNaN(argz[1])) return lanz.reply(from, `harus berupa angka`, qul)
				for (let i = 0; i < argz[1]; i++){
					lanz.sendText(from, argz[0])
				}
				break
			case 'promote':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}promote @tag atau nomor`, qul)
				if (qul.message.extendedTextMessage != undefined){
                    mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					await lanz.FakeTokoForwarded(from, `sukses`, fake)
					lanz.promote(from, mentioned)
				} else {
					await lanz.FakeTokoForwarded(from, `sukses`, fake)
					lanz.promote(from, [args[0] + '@s.whatsapp.net'])
				}
				break
			case 'demote':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}demote @tag atau nomor`, qul)
				if (qul.message.extendedTextMessage != undefined){
                    mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					await lanz.FakeTokoForwarded(from, `sukses`, fake)
					lanz.demote(from, mentioned)
				} else {
					await lanz.FakeTokoForwarded(from, `sukses`, fake)
					lanz.demote(from, [args[0] + '@s.whatsapp.net'])
				}
				break
			case 'kick':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}kick @tag atau nomor`, qul)
				if (qul.message.extendedTextMessage != undefined){
                    mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					await lanz.FakeTokoForwarded(from, `Bye...`, fake)
					lanz.kick(from, mentioned)
				} else {
					await lanz.FakeTokoForwarded(from, `Bye...`, fake)
					lanz.kick(from, [args[0] + '@s.whatsapp.net'])
				}
				break
			case 'add':
				if (!arg) return lanz.reply(from, `Penggunaan ${prefix}kick 628xxxx`, qul)
				lanz.add(from, [args[0] + '@s.whatsapp.net'])
				lanz.FakeTokoForwarded(from, `Sukses`, fake)
				break
			case 'upstatus':
				if (!itsMe) return
				if (!arg) return lanz.reply(from, `Penggunaan \n${prefix}upstatus text\n${prefix}upstatus caption <reply atau kirim video / img>`, qul)
				if (isMedia && !qul.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadAndSaveMediaMessage(encmedia)
					lanz.upImgStatus(media, arg).then(() => { lanz.FakeTokoForwarded(from, 'Sukses', fake) })
				} else if ((isMedia || isQuotedVideo )) {
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadAndSaveMediaMessage(encmedia)
					lanz.upVidStatus(media, arg).then(() => { lanz.FakeTokoForwarded(from, 'Sukses', fake) })
				} else {
					await lanz.upTextStatus(arg).then(() => { lanz.FakeTokoForwarded(from, 'Sukses', fake) })
				}
				break
			case 'getgrup': case 'getgroup': case 'getg':
				const ingfo = await lanz.getGroup(totalchat)
				let txt = `Ingfo grup\nJumlah Grup: ${ingfo.length}\n\n`
				for (let i = 0; i < ingfo.length; i++){
					txt += `Nama grup : ${ingfo[i].subject}\nID grup : ${ingfo[i].id}\nDibuat : ${moment(`${ingfo[i].creation}` * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')}\nJumlah Peserta : ${ingfo[i].participants.length}\n\n`
				}
				lanz.FakeTokoForwarded(from, txt, fake)
				break
			case 'creategrup': case 'creategroup': case 'createg':
				argz = arg.split('|')
				if (qul.message.extendedTextMessage != undefined){
                    mentioned = qul.message.extendedTextMessage.contextInfo.mentionedJid
					lanz.groupCreate(argz[0], mentioned)
					.then((res) => lanz.FakeTokoForwarded(from, JSON.stringify(res, null, 2).toString(), fake))
					.catch((err) => console.log(err))
				} else {
					lanz.reply(from, `Penggunaan ${prefix}creategrup namagrup|@tag`, qul)
				}
				break
			case 'imgtourl':
				const encmediiia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
				const mediaq = await lanz.downloadMediaMessage(encmediiia)
				const upli = await uptotele(mediaq)
				lanz.reply(from, `${upli}`, qul)
				break
			case 'tourl':
				let a = JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				let b = await lanz.downloadAndSaveMediaMessage(a)
				let c = await uploadFile(b)
				lanz.reply(from, c.result, qul)
				fs.unlinkSync(b)
				break
			case 'antidelete':
				if (!itsMe) return
				const dataRevoke = JSON.parse(fs.readFileSync('./antidelete/gc-revoked.json'))
				const dataCtRevoke = JSON.parse(fs.readFileSync('./antidelete/ct-revoked.json'))
				const dataBanCtRevoke = JSON.parse(fs.readFileSync('./antidelete/ct-revoked-banlist.json'))
				const isRevoke = dataRevoke.includes(from)
				const isCtRevoke = dataCtRevoke.data
				const isBanCtRevoke = dataBanCtRevoke.includes(sender) ? true : false
				if (args.length === 0) return lanz.sendMessage(from, `Penggunaan fitur antidelete :\n\n*${prefix}antidelete [aktif/mati]* (Untuk grup)\n*${prefix}antidelete [ctaktif/ctmati]* (untuk semua kontak)\n*${prefix}antidelete banct 628558xxxxxxx* (banlist kontak)`, MessageType.text)
				if (args[0] == 'aktif') {
					if (isGroup) {
						if (isRevoke) return lanz.sendMessage(from, `Antidelete telah diaktifkan di grup ini sebelumnya!`, MessageType.text)
						dataRevoke.push(from)
						fs.writeFileSync('./antidelete/gc-revoked.json', JSON.stringify(dataRevoke, null, 2))
						lanz.sendMessage(from, `*Succes Enable Antidelete Grup!*`, MessageType.text)
					} else if (!isGroup) {
						lanz.sendMessage(from, `Untuk kontak penggunaan *${prefix}antidelete ctaktif*`, MessageType.text)
					}
				} else if (args[0] == 'ctaktif') {
					if (!isGroup) {
						if (isCtRevoke) return lanz.sendMessage(from, `Antidelete telah diaktifkan di semua kontak sebelumnya!`, MessageType.text)
						dataCtRevoke.data = true
						fs.writeFileSync('./antidelete/ct-revoked.json', JSON.stringify(dataCtRevoke, null, 2))
						lanz.sendMessage(from, `Antidelete diaktifkan disemua kontak!`, MessageType.text)
					} else if (isGroup) {
						lanz.sendMessage(from, `Untuk grup penggunaan *${prefix}antidelete aktif*`, MessageType.text)
					}
				} else if (args[0] == 'banct') {
					if (isBanCtRevoke) return lanz.sendMessage(from, `kontak ini telah ada di database banlist!`, MessageType.text)
					if (args.length === 1 || args[1].startsWith('0')) return lanz.sendMessage(from, `Masukan nomer diawali dengan 62! contoh 62859289xxxxx`, MessageType.text)
					dataBanCtRevoke.push(args[1] + '@s.whatsapp.net')
					fs.writeFileSync('./antidelete/ct-revoked-banlist.json', JSON.stringify(dataBanCtRevoke, null, 2))
					lanz.sendMessage(from, `Kontak ${args[1]} telah dimasukan ke banlist antidelete secara permanen!`, MessageType.text)
				} else if (args[0] == 'mati') {
					if (isGroup) {
						const index = dataRevoke.indexOf(from)
						dataRevoke.splice(index, 1)
						fs.writeFileSync('./antidelete/gc-revoked.json', JSON.stringify(dataRevoke, null, 2))
						lanz.sendMessage(from, `*Succes disable Antidelete Grup!*`, MessageType.text)
					} else if (!isGroup) {
						lanz.sendMessage(from, `Untuk kontak penggunaan *${prefix}antidelete ctmati*`, MessageType.text)
					}
				} else if (args[0] == 'ctmati') {
					if (!isGroup) {
						dataCtRevoke.data = false
						fs.writeFileSync('./antidelete/ct-revoked.json', JSON.stringify(dataCtRevoke, null, 2))
						lanz.sendMessage(from, `Antidelete dimatikan disemua kontak!`, MessageType.text)
					} else if (isGroup) {
						lanz.sendMessage(from, `Untuk grup penggunaan *${prefix}antidelete mati*`, MessageType.text)
					}
				}
				break
			case 'lol' : case 'lol'
			lanz.sendMessage(from,`lol juga`)
				break
			case 'setpp': case 'setprofilepicture':
				if (!itsMe) return
				if (isMedia && !qul.message.videoMessage || isQuotedImage) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(qul).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : qul
					const media = await lanz.downloadMediaMessage(encmedia)
					lanz.updateProfilePicture(lanz.user.jid, media)
					.then((res) => lanz.FakeTokoForwarded(from, JSON.stringify(res, null, 2).toString(), fake))
					.catch((err) => console.log(err))
				} else {
					lanz.reply(from, `Kirim gambar atau reply gambar dengan caption ${prefix}setpp`, qul)
				}
				break
			case 'eval':
				if (!itsMe) return
				let code = body.slice(6)
				try {

					if (!code) return lanz.reply(from, 'No JavaScript Code', qul)
					let evaled;

					if (code.includes("--silent") && code.includes("--async")) {
						code = code.replace("--async", "").replace("--silent", "");

						return await eval(`(async () => { ${code} })()`)
					} else if (code.includes("--async")) {
						code = code.replace("--async", "");

						evaled = await eval(`(async () => { ${code} })()`);
					} else if (code.includes("--silent")) {
						code = code.replace("--silent", "");

						return await eval(code);
					} else evaled = await eval(code);

					/*if (typeof evaled !== "string")
						evaled = require("util").inspect(evaled, {
							depth: 0
						*/

					let output = clean(evaled);
					lanz.reply(from, JSON.stringify(evaled, null, 2), qul)

				} catch (err) {
					console.error(err)
					const error = clean(err)
					lanz.reply(from, error, qul)
				}

				function clean(text) {
					if (typeof text === "string")
						return text
							.replace(/`/g, `\`${String.fromCharCode(8203)}`)
							.replace(/@/g, `@${String.fromCharCode(8203)}`);
					// eslint-disable-line prefer-template
					else return text;
				}
				break
			default:
				break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
})
