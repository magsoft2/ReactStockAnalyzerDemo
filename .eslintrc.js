module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
			"experimentalObjectRestSpread": true,
			"classes":true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
	"parser": "babel-eslint",
    "plugins": [
		"import",
		"react",
		"jsx-a11y",
		"jest"
    ],
    "rules": {
		"no-console": 1,
		"constructor-super": "error",
		"no-mixed-spaces-and-tabs": [0],
		"no-unused-vars": "off",
		"camelcase": 0,
        "indent": [
            "warn",
            4, 
			{ 
				"SwitchCase": 1,
				"MemberExpression": 1			
			}			
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
	"settings": {
		"import/parser": "babel-eslint",
		"import/resolve": {
			"moduleDirectory": ["node_modules", "src"]
		},
		"import/resolver": {
			"node": {
				"extensions": [
				".js",
				".jsx",
				".json"
				]
			}
		},
		"import/extensions": [
		".js",
		".jsx"
		],
		"import/core-modules": [],
		"import/ignore": [
		"node_modules",
		"\\.(coffee|scss|css|less|hbs|svg|json)$"
		],
		"react": {
			"pragma": "React",
			"version": "15.0"
		},
		"propWrapperFunctions": [
		"forbidExtraProps",
		"exact",
		"Object.freeze"
		]
	}
};