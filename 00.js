console.log("Зареждане...");
const mongoose = require("mongoose"), MONGO_URI = "mongodb+srv://thelisswayne:aPA5V8XUscYyMsSt@firstcluster.h56ikud.mongodb.net/thelisswayne?retryWrites=true&w=majority";
const Model = mongoose.model("Model", new mongoose.Schema({
	ime: { type: String, required: [true, "Трябва да се въведе 'ime'"], uniquie: [true, "Това име вече се заето"] },
	SN: { type: Number, uniquie: [true, "Този сериен номер вече е зает"] },
	stariImena: { type: Array, default: [] },
	pochivaOt: { type: String, default: "" },
	pornoZvezda: { type: Boolean, default: false },
	portret: { type: String, default: "" },	
}));
let ID = 0;

async function potarsiModel(id) {
    try {
        const { user } = await fetch(`https://xhamsterlive.com/api/front/users/${id}/`).then(res => res.json());
        if (user && user.isModel && user.broadcastGender === "female") {
			const model = new Model({
				ime: user.username,
				SN: id,
				pochivaOt: user.wentIdleAt,
				pornoZvezda: user.isPornStar,
				portret: user.avatarUrl
			});
			
			await model.save();
		}
		ID++;
		if (id === 100000000) console.log(`---------- Търсенето приключи ----------`);
		potarsiModel(ID);
    } catch (fetchUserError) { potarsiModel(id); }
}

mongoose.connect(MONGO_URI).then(() => { 
	console.log("Базата данни е свързана");
	potarsiModel(ID);
	console.log("Търсене на модели...");
}).catch(mongoConnectionErr => { console.log(`mongoConnectionErr: ${mongoConnectionErr}`); });