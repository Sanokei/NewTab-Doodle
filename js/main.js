// Initialize Kaboom.js
const kb = kaboom({
	global: false,
    loadingScreen: false,
    focus: false,
    width:window.screen.width,
    height:window.screen.height,
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
	
	constructor(pageName) {
		if(pageName == "" || !pageName)
			console.error("pageName cannot be of type null or empty");
		this.pageName = pageName;

		// set new dictornaries 
		this.data = new Object();
		this.gameobjects = new Object();;
	}

	loadPage(pageName = this.pageName) {
		if(pageName == "" || !pageName)
			console.error("pageName cannot be of type null or empty");
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

	/*Instantiate*/

	// Assumes data is already loaded.
	instantiatePage(data = this.data, pageName = this.pageName) {
		if(pageName == "" || !pageName)
			console.error("pageName cannot be of type null or empty");
		if(!data)
		{
			console.warn("Data is never loaded, or coresponding JSON is empty. Attempting to load page now.");
			loadPage(pageName)
		}
	
		for (const [k, v] of Object.entries(data)) {
			this.instantiate(k,v);
		}
		return this;
	}

	instantiate(goName,gameobject) {
		this.gameobjects[goName] =
			kb.make([
				kb.sprite(gameobject["sprite"]),   // sprite() component makes it render as a sprite
				kb.pos(gameobject["pos"]),     // pos() component gives it position, also enables movement
				kb.area(),
				...gameobject["tags"] ?? "",
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
function loadPage(pageName,args = {}) {
	return new Promise((resolve, reject) => {
		kb.scene(pageName, (args) => {
			// Create
			let page = new Page(pageName);
	
			// load
			page.loadPage()
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
		chrome.storage.local.get(pageName, (result) => {
			if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError);
			console.log("Load",pageName , result.save);
			resolve(result.save);
		});
			
	});
}

function gameobjectsToJSON(gos) {
	gos.forEach(elm => {
		console.log(elm);
		console.log(elm.id);
	});
}

kb.scene("test", ({args}) => {
	console.log(args);
	args.forEach(elm => {
		console.log(elm);
		kb.add(elm);
	});
});

function main() {
	kb.onClick("save", (btn) => {
		var allObj = kb.get("*");
		gameobjectsToJSON(allObj);
		// saveJSONToStorage(allObj);
	});
	kb.onClick("load", (btn) => {
		loadJSONFromStorage()
			.then((data) => {
				console.log(data);
				kb.go("test",{args:data})
			})
			.catch(error => {
				console.error(`An Error occured while trying to load page from storage`,error);
			});
		// kb.go("test",{args: kb.get("*", { recursive: true})});
	})
}

// Load assets then invoke main
AssetLoader.load()
	.then(() => {
		loadPage("mainPage")
			.then( main() )
	}) 
	.catch(error => {
		console.error("Error Occured while loading Assets.",error);
	});