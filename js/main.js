// Initialize Kaboom.js
const kb = kaboom({
	global: false,
    loadingScreen: false,
	background: [255, 255, 255],
});

/* paths */
const assetPath = "../assets/kaboom/";
const pagesPath = "../assets/kaboom/pages/"
// kb load root
const loadSpritePath = () => kb.loadRoot("../assets/img/");
const loadDefaultPath = () => kb.loadRoot("/");

class AssetLoader {
	static load() {
		return new Promise((resolve, reject) => {
			kb.load(fetch(`${assetPath}assets.json`)
				.then(response => response.json()) // implicit return
				.then(data => {
					AssetLoader._loadGeneral(data);
					resolve();
				})
				.catch(error => {
					console.error("Error fetching resource:", error);
					reject(error);
				})
			);
		});
	}

	static _loadGeneral(assets) {
		loadSpritePath();
		assets.sprites.forEach(elm => {
			kb.loadSprite(elm.name,elm.filename,elm.kwargs ?? {});
		});
	}

}

/**
 * JSON page loader 
 */
class Page {
	_checkNameEmpty(pageName) // just to be able to change the behaviour and error once
	{
		if(pageName == "" || !pageName)
			console.error("pageName cannot be of type null or empty");
	}
	constructor(pageName) {
		this._checkNameEmpty(pageName)
		this.pageName = pageName;

		// set new dictonaries 
		this.data = new Object();
		this.gameobjects = new Object();
	}

	loadlocalPage(pageName = this.pageName) {
		this._checkNameEmpty(pageName)
		return new Promise((resolve, reject) => {
			fetch(`${pagesPath}${pageName}.json`)
				.then(response => {
					if (!response.ok)
						throw new Error("HTTP error " + response.status);
					return response.json();
				})
				.then(data => {
					this.data = data;
					resolve(this);  
				})
				.catch(error => {
					// FIXME: this might become a problem later.
					console.error(`Note: ${pageName} has to be the same name as the json file.\n`, error);
					reject(error);
				});
		});
		
	}

	loadStoredPage(pageName = this.pageName) {
		this._checkNameEmpty(pageName)
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(pageName, (result) => {
				if (chrome.runtime.lastError)
					reject(chrome.runtime.lastError);
				console.log("Load",pageName , result.save);

				this.data = result.save;
				resolve(this);
			});
		});
	}

	/*Instantiate*/

	// Assumes data is already loaded.
	instantiatePage(data = this.data, pageName = this.pageName) {
		this._checkNameEmpty(pageName)
		if(!data)
		{
			console.warn("Data is never loaded, or coresponding JSON is empty. Attempting to load page now.");
			this.loadlocalPage(pageName)
				.then( () => { return this.instantiatePage() }); // makes sure promise is resolved before retrying the block
		}
	
		for (const [k, v] of Object.entries(data)) {
			this.instantiate(k,v);
		}
		return this;
	}

	instantiate(goName,gameobject) {
		console.log(`Loading... ${goName}:${gameobject}`)
		this.gameobjects[goName] =
			kb.make([
				kb.sprite(gameobject["sprite"]),   // sprite() component makes it render as a sprite
				kb.pos(gameobject["pos"]),     // pos() component gives it position, also enables movement
				kb.area(),
				...gameobject["tags"] ?? "",	// Tags
				kb.rotate(gameobject["rotation"] ?? 0),        // rotate() component gives it rotation
				kb.anchor(gameobject["anchor"] ?? "center"), // anchor() component defines the pivot point (defaults to "topleft")
			]);
	}

	/*Initialize*/

	initializeAllGameObj() {
		for (const [k, v] of Object.entries(this.gameobjects)) {
			this.initialize(k);
		}
	}

	initialize(goName) {
		kb.add(this.gameobjects[goName]);
	}

}

// Loads page by name
function loadlocalPage(pageName,args = {}) {
	return new Promise((resolve, reject) => {
		kb.scene(pageName, (args) => {
			// Create
			let page = new Page(pageName);
	
			// load
			page.loadlocalPage()
				.then(() => {
					page.instantiatePage();
				})
				.then(() => {
					page.initializeAllGameObj()
					resolve(page);
				})
				.catch(error => {
					// FIXME: this might become a problem later.
					console.error(`An Error occured while trying to create or load page ${pageName}`,error);
					reject(err);
				});
		});
			
		kb.go(pageName);
	});
}

function saveJSONToStorage(pageJSON, pageName = 'save') {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({'save': pageJSON }, () => {
			if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
			console.log("Save", pageName, pageJSON);
			resolve();
		});
	});
}

function loadJSONFromStorage(pageName = 'save') {
	return new Promise((resolve, reject) => {
		kb.scene(pageName, (args) => {
			// Create
			let page = new Page(pageName);
	
			// load
			page.loadStoredPage()
				.then(() => {
					page.instantiatePage();
				})
				.then(() => {
					page.initializeAllGameObj()
					resolve(page);
				})
				.catch(error => {
					// FIXME: this might become a problem later.
					console.error(`An Error occured while trying to create or load page ${pageName}`,error);
					reject(err);
				});
		});
			
		kb.go(pageName);
	});
}

function gameobjectsToJSON(page) {
	let gameobjects = new Object();
	for (const [goName, gameobject] of Object.entries(page.data)) {
		let gos = kb.get(goName)[0];
		console.log(gos.pos);
		gameobjects[goName] =
			{
				"sprite": gameobject["sprite"],
				"pos": [gos.pos.x, gos.pos.y],
				"tags": gameobject["tags"] ?? "",
				"rotation": gameobject["rotation"] + gos.rotation ?? 0,
				"anchor": gameobject["anchor"] ?? "center",
			};
	}
	return gameobjects;
}

var doodles = []
const outline = {
	width: 4,
	color: kb.rgb(0, 0, 0),
}
function drawStuff() {
	doodles.forEach((pts) => {
		kb.drawLines({
			...outline,
			pts: pts,
		})
	})
}
// main
function activatePage(page) {
	kb.onClick("save", (btn) => {
		// saveJSONToStorage(gameobjectsToJSON(page));

		// chrome.storage.local.set({'doodles': doodles });
	});
	kb.onClick("load", (btn) => {
		// loadJSONFromStorage()
		// 	.then( (page) => activatePage(page) )
		// 	.catch(error => {
		// 		console.error(`An Error occured while trying to load page from storage`,error);
		// 	});
		
		// doodles = chrome.storage.local.get('doodles');
	})

	kb.onClick("confetti", (btn) => {
		addConfetti();
	})
	kb.onDraw(() => {
		drawStuff();
	});

	kb.onUpdate(() => {
		if (kb.isMousePressed()) {
			doodles.push([])
		}
		if (kb.isMouseDown() && kb.isMouseMoved()) {
			doodles[doodles.length - 1].push(kb.mousePos())
		}
	
	})
}

// Load assets then invoke main
AssetLoader.load()
	.then(() => {
		loadlocalPage("mainPage")
			.then( (page) => activatePage(page) )
			.catch(error => {
				console.error(`An Error occured while trying to load main page`,error);
			});
	}) 
	.catch(error => {
		console.error("Error Occured while loading Assets.",error);
	});

// Kaboom Custom Components

// Kaboom Custom Functions

/* Confetti */
const DEF_COUNT = 80;
const DEF_GRAVITY = 800;
const DEF_AIR_DRAG = 0.9;
const DEF_VELOCITY = [1000, 4000];
const DEF_ANGULAR_VELOCITY = [-200, 200];
const DEF_FADE = 0.3;
const DEF_SPREAD = 60;
const DEF_SPIN = [2, 8];
const DEF_SATURATION = 0.7;
const DEF_LIGHTNESS = 0.6;
/**
 * Adds confetti at a position
 */
function addConfetti(opt = {}) {
	const sample = (s) => typeof s === "function" ? s() : s
	for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
		const p = kb.add([
			kb.pos(sample(opt.pos ?? kb.vec2(0, 0))),
			kb.choose([
				kb.rect(kb.rand(5, 20), kb.rand(5, 20)),
				kb.circle(kb.rand(3, 10)),
			]),
			kb.color(sample(opt.color ?? kb.hsl2rgb(kb.rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS))),
			kb.opacity(1),
			kb.lifespan(4),
			kb.scale(1),
			kb.anchor("center"),
			kb.rotate(kb.rand(0, 360)),
		])
		const spin = kb.rand(DEF_SPIN[0], DEF_SPIN[1]);
		const gravity = opt.gravity ?? DEF_GRAVITY;
		const airDrag = opt.airDrag ?? DEF_AIR_DRAG;
		const heading = sample(opt.heading ?? 0) - 90;
		const spread = opt.spread ?? DEF_SPREAD;
		const head = heading + kb.rand(-spread / 2, spread / 2);
		const fade = opt.fade ?? DEF_FADE;
		const vel = sample(opt.velocity ?? kb.rand(DEF_VELOCITY[0], DEF_VELOCITY[1]));
		let velX = Math.cos(kb.deg2rad(head)) * vel;
		let velY = Math.sin(kb.deg2rad(head)) * vel;
		const velA = sample(opt.angularVelocity ?? kb.rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]));
		p.onUpdate(() => {
			velY += gravity * kb.dt();
			p.pos.x += velX * kb.dt();
			p.pos.y += velY * kb.dt();
			p.angle += velA * kb.dt();
			p.opacity -= fade * kb.dt();
			velX *= airDrag;
			velY *= airDrag;
			p.scale.x = kb.wave(-1, 1, kb.time() * spin);
		})
	}
}