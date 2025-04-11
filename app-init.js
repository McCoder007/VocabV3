// Direct TTS API key setter
console.log('Directly setting Google TTS API key from app-init.js');
if (typeof googleTTS !== 'undefined') {
    googleTTS.setApiKey('AIzaSyBBe1XfNjodUza5EHDLbs6HTWk8O64b5c8
');
} else {
    console.error('googleTTS not defined yet - will rely on the initialization in index.html');
}