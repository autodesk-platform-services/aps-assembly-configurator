const path = require('path');
const fs = require('fs-extra');

const PORT = process.env.PORT || 3000;
const {
    ENV,
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
    APS_CALLBACK_URL,
    SERVER_SESSION_SECRET
} = process.env;

const CacheFolder = path.join(__dirname, 'cache');
if (!fs.existsSync(CacheFolder)) {
    fs.mkdirSync(CacheFolder);
}

if (!APS_CLIENT_ID || !APS_CLIENT_SECRET || !APS_BUCKET || !APS_CALLBACK_URL || !SERVER_SESSION_SECRET) {
    console.warn('Some of the environment variables are missing:');
    console.warn('APS_CLIENT_ID, APS_CLIENT_SECRET, APS_BUCKET, APS_CALLBACK_URL, SERVER_SESSION_SECRET')
    process.exit(1);
}

module.exports = {
    APS_CLIENT_ID,
    APS_CLIENT_SECRET,
    APS_BUCKET,
    APS_CALLBACK_URL,
    SERVER_SESSION_SECRET,
    PORT,
    INVENTOR_PIPELINE: {
        DESCRIPTION: 'App bundle assembling Inventor parts based on a specific layout.',
        ENGINE: 'Autodesk.Inventor+2022', // Must be 2021 or newer because we're leveraging the recent RFA output feature!
        APPBUNDLE_NAME: 'InventorAssembler',
        APPBUNDLE_ALIAS: 'prod',
        APPBUNDLE_PATH: path.join(__dirname, 'plugins', 'DesignAutomationForInventor_DesignView2', 'Output', 'DesignAutomationForInventor1Plugin.bundle.zip'),
        ACTIVITY_ID: 'Assemble',
        ACTIVITY_ALIAS: 'prod'
    },
    CACHE_FOLDER: CacheFolder,
    inDebugMode: () => ENV === 'dev'
};
