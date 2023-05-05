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

async function potarsiManekenka(id) {
  try {
    const { user } = await fetch(`https://xhamsterlive.com/api/front/users/${id}/`).then(res => res.json());
    if (user && user.isModel && (user.gender === "female" || user.gender === "females")) {
      const portret = user.avatarUrl || './no_img_avatar.jpg', pochivaOt = user.wentIdleAt || user.statusChangedAt || "не се знае";
      const manekenka = new Manekenka({ ime: user.username, SN: id, pochivaOt, pornoZvezda: user.isPornStar, portret });

      await manekenka.save();
    }
    ID++;
    if (id === 100000000) console.log(`---------- Търсенето приключи ----------`);
    potarsiManekenka(ID);
  } catch (fetchUserError) { potarsiManekenka(id); }
}

mongoose.connect(MONGO_URI).then(() => { 
	console.log("Базата данни е свързана");
	potarsiManekenka(ID);
	console.log("Търсене на модели...");
}).catch(mongoConnectionErr => { console.log(`mongoConnectionErr: ${mongoConnectionErr}`); });
