# [ new tab ]
A productivity tool that is gamified.

`/pages/*.json`
Loaded assets can be used in a page.

```json
{
    // ...
    // FIXME: it may become an issue later that the name has to be unique.
    "name": { // must be unique. This is the gameobject name.
        "sprite":"name",
        "pos":[0,0],
        "tags":["tag","tag1"] // add tags
    }
    // ...
}
```

`assets.json`
Different types of assets get loaded

```json
{
    "sprites":
    [
        {
            "name": "name", // must be unique.
            "filename": "filepath.png",
            "kwargs": 
            {
                "slice9":
                {
                    "left": 32,
                    "right": 32,
                    "top": 32,
                    "bottom": 32
                }
            }
        }
    // ...
    ],
    "sounds":
    [
        {
            "name": "name",
            "filename": "filepath.mp3",
            "kwargs": 
            {
            // ...
            }
        }
    ]
}
```