// Initialize KaPlay.js
const kb = kaplay({
	global: false,
    loadingScreen: false,
	// background: [0,0,0],
});

const componentMap = {
    sprite: (value) => [kb.sprite(value)],
    pos: (value) => [kb.pos(...value)],
    rotation: (value) => [kb.rotate(value)],
    anchor: (value) => [kb.anchor(value)],
    tags: (value) => value,
    area: (value) => [kb.area()],
    agent: (value) => [kb.agent(value)],
    animate: (value) => [kb.animate(value)],
    blend: (value) => [kb.blend(value)],
    body: (value) => [kb.body(value)],
    buoyancyEffector: (value) => [kb.buoyancyEffector(value)],
    circle: (value) => [kb.circle(value)],
    color: (value) => [kb.color(value)],
    constantForce: (value) => [kb.constantForce(value)],
    doubleJump: (value) => [kb.doubleJump(value)],
    drawon: (value) => [kb.drawon(value)],
    ellipse: (value) => [kb.ellipse(value)],
    fadeIn: (value) => [kb.fadeIn(value)],
    fakeMouse: (value) => [kb.fakeMouse(value)],
    fixed: (value) => [kb.fixed(value)],
    follow: (value) => [kb.follow(value)],
    health: (value) => [kb.health(value)],
    layer: (value) => [kb.layer(value)],
    lifespan: (value) => [kb.lifespan(value)],
    mask: (value) => [kb.mask(value)],
    move: (value) => [kb.move(value)],
    named: (value) => [kb.named(value)],
    offscreen: (value) => [kb.offscreen(value)],
    opacity: (value) => [kb.opacity(value)],
    outline: (value) => [kb.outline(value)],
    particles: (value) => [kb.particles(value)],
    pathfinder: (value) => [kb.pathfinder(value)],
    patrol: (value) => [kb.patrol(value)],
    platformEffector: (value) => [kb.platformEffector(value)],
    pointEffector: (value) => [kb.pointEffector(value)],
    polygon: (value) => [kb.polygon(value)],
    raycast: (value) => [kb.raycast(value)],
    rect: (value) => [kb.rect(value)],
    scale: (value) => [kb.scale(value)],
    sentry: (value) => [kb.sentry(value)],
    serializeAnimation: (value) => [kb.serializeAnimation(value)],
    shader: (value) => [kb.shader(value)],
    state: (value) => [kb.state(value)],
    stay: (value) => [kb.stay(value)],
    surfaceEffector: (value) => [kb.surfaceEffector(value)],
    text: (value) => [kb.text(value)],
    textInput: (value) => [kb.textInput(value)],
    tile: (value) => [kb.tile(value)],
    timer: (value) => [kb.timer(value)],
    usesArea: (value) => [kb.usesArea(value)],
    uvquad: (value) => [kb.uvquad(value)],
    z: (value) => [kb.z(value)],
};

const serializeMap = {
    sprite: (gos) => ({ sprite: gos.sprite }),
    pos: (gos) => ({ pos: [gos.pos.x, gos.pos.y] }),
    rotation: (gos) => ({ rotation: gos.angle }),
    anchor: (gos) => ({ anchor: gos.anchor }),
    tags: (gos) => ({ tags: gos.tags }),
    // area: (gos) => ({ area: { shape: gos.area.shape } }), // currently only Rect and Polygon is supported
    area: (gos) => ({ area: gos.area }),
    agent: (gos) => ({ agent: gos.agent }),
    animate: (gos) => ({ animate: gos.animate }),
    blend: (gos) => ({ blend: gos.blend }),
    body: (gos) => ({ body: gos.body }),
    buoyancyEffector: (gos) => ({ buoyancyEffector: gos.buoyancyEffector }),
    circle: (gos) => ({ circle: gos.circle }),
    color: (gos) => ({ color: gos.color }),
    constantForce: (gos) => ({ constantForce: gos.constantForce }),
    doubleJump: (gos) => ({ doubleJump: gos.doubleJump }),
    drawon: (gos) => ({ drawon: gos.drawon }),
    ellipse: (gos) => ({ ellipse: gos.ellipse }),
    fadeIn: (gos) => ({ fadeIn: gos.fadeIn }),
    fakeMouse: (gos) => ({ fakeMouse: gos.fakeMouse }),
    fixed: (gos) => ({ fixed: gos.fixed }),
    follow: (gos) => ({ follow: gos.follow }),
    health: (gos) => ({ health: gos.health }),
    layer: (gos) => ({ layer: gos.layer }),
    lifespan: (gos) => ({ lifespan: gos.lifespan }),
    mask: (gos) => ({ mask: gos.mask }),
    move: (gos) => ({ move: gos.move }),
    named: (gos) => ({ named: gos.named }),
    offscreen: (gos) => ({ offscreen: gos.offscreen }),
    opacity: (gos) => ({ opacity: gos.opacity }),
    outline: (gos) => ({ outline: gos.outline }),
    particles: (gos) => ({ particles: gos.particles }),
    pathfinder: (gos) => ({ pathfinder: gos.pathfinder }),
    patrol: (gos) => ({ patrol: gos.patrol }),
    platformEffector: (gos) => ({ platformEffector: gos.platformEffector }),
    pointEffector: (gos) => ({ pointEffector: gos.pointEffector }),
    polygon: (gos) => ({ polygon: gos.polygon }),
    raycast: (gos) => ({ raycast: gos.raycast }),
    rect: (gos) => ({ rect: gos.rect }),
    scale: (gos) => ({ scale: gos.scale }),
    sentry: (gos) => ({ sentry: gos.sentry }),
    serializeAnimation: (gos) => ({ serializeAnimation: gos.serializeAnimation }),
    shader: (gos) => ({ shader: gos.shader }),
    state: (gos) => ({ state: gos.state }),
    stay: (gos) => ({ stay: gos.stay }),
    surfaceEffector: (gos) => ({ surfaceEffector: gos.surfaceEffector }),
    text: (gos) => ({ text: gos.text }),
    textInput: (gos) => ({ textInput: gos.textInput }),
    tile: (gos) => ({ tile: gos.tile }),
    timer: (gos) => ({ timer: gos.timer }),
    usesArea: (gos) => ({ usesArea: gos.usesArea }),
    uvquad: (gos) => ({ uvquad: gos.uvquad }),
    z: (gos) => ({ z: gos.z }),
};

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
        this.componentKeys = {};
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

	instantiate(goName, gameobject) {
        const components = [];
        const keysUsed = [];
        for (const [key, value] of Object.entries(gameobject)) {
            if (componentMap[key]) {
                const componentParts = componentMap[key](value);
                components.push(...componentParts);
                keysUsed.push(key);
            } else {
                console.warn(`Unknown component key '${key}' for ${goName}`);
            }
        }
        this.gameobjects[goName] = kb.make(components);
        this.componentKeys[goName] = keysUsed;
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
    const savedData = {};
    for (const [goName, gameobjectData] of Object.entries(page.data)) {
        const gos = kb.get(goName)[0];
        const components = {};
        for (const key of page.componentKeys[goName] || []) {
            if (serializeMap[key]) {
                Object.assign(components, serializeMap[key](gos));
            }
        }
        savedData[goName] = components;
    }
    return savedData;
}

// main
function activatePage(page) {
	kb.onClick("save", (btn) => {
		saveJSONToStorage(gameobjectsToJSON(page));
	});
	kb.onClick("load", (btn) => {
		loadJSONFromStorage()
			.then( (page) => activatePage(page) )
			.catch(error => {
				console.error(`An Error occured while trying to load page from storage`,error);
			});
	})

    const dirs = {
        "left": kb.vec2(-1, 0),
        "right": kb.vec2(1, 0),
        "up": kb.vec2(0, -1),
        "down": kb.vec2(0, 1),
    };
    const SPEED = 320;
    for (const dir in dirs) {
        kb.onKeyDown(dir, () => {
            kb.get("player")[0].move(dirs[dir].scale(SPEED));
        });
    }
}

// Load assets then invoke main
AssetLoader.load()
	.then(() => {
		loadlocalPage("page")
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