const fs = require('fs');
const path = require('path');

const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

function walkSync(currentDirPath, callback) {
    const fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && name !== 'node_modules' && name !== 'dist' && !name.startsWith('.')) {
            walkSync(filePath, callback);
        }
    });
}

function findEmojis() {
    const results = [];
    ['client/src', 'server/src'].forEach(dir => {
        const fullDir = path.join(__dirname, dir);
        if(!fs.existsSync(fullDir)) return;
        
        walkSync(fullDir, function(filePath) {
            if(!filePath.match(/\.(ts|tsx|js|jsx)$/)) return;
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                const match = line.match(emojiRegex);
                if (match) {
                    // Filter out non-emoji false positives like registered trademark, numbers if any
                    results.push(`${filePath}:${i + 1} -> ${match.join('')} -> ${line.trim()}`);
                }
            });
        });
    });
    fs.writeFileSync('emojis.txt', results.join('\n'));
}

findEmojis();
