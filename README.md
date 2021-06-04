# Safeway-Frontend

## Deployment

Few commands are required to run in order to build:

```
npm install && npm run build
```

After that you can find static files in `dist` directory. Move them where you want or run http server from that directory.

## Node and NPM versions

During the developement process we were using `node v10.13.0` and `NPM v6.4.1` and it was working fine. It is set in `package.json` and in `.nvmrc`.

Enjoy!

## Project structure

Please make sure you have eslint and prettier installed in order to keep the format unified. Eslint and TypeScript types check is performed on commit.

### Folder structure

- `/src/api` - HTTP API communication layer
- `/src/assets` - assets to be imported by the application, will be either bundled into the .js file or copied to the build folder
- `/src/common` - common UI elements, eventually to be moved to `/src/ui` space
- `/src/features` - redux implementation following the feature-first pattern
- `/src/i18n` - internalization layer
- `/src/screens` - features that are directly connected to the react-router
- `/src/store` - redux store configuration
- `/src/ui` - UI elements to be reused across features and screens
- `/src/utils` - non-React utility modules

### Import aliases

In order to allow easier refactoring and code reference, please use the following aliases:

```js
import X from "@api/index";
import X from "@assets/X"; // or from '@assets/index'
import X from "@common/X";
import X from "@features/X";
import X from "@screens/X";
import X from "@store/index";
import X from "@ui/X";
import X from "@utils/X";
```
