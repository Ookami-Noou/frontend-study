// 全局变量
let currentDirectoryHandle;
let currentFileHandle;
let audioPlayer = document.getElementById('audioPlayer');
let lyricsData = [];
let currentLyricIndex = -1;
let lyricInterval;
let statusMarquee = false;

document.getElementById('selectFolder').addEventListener('click', async () => {
    try {
        // 请求用户选择文件夹
        currentDirectoryHandle = await window.showDirectoryPicker();
        const outputElement = document.getElementById('output');
        outputElement.innerHTML = '<p>正在扫描文件夹...</p>';
        
        // 清空之前的输出
        outputElement.innerHTML = '';
        document.getElementById('player').style.display = 'none';
        updateStatus('');
        
        // 创建根UL元素
        const rootUl = document.createElement('ul');
        rootUl.className = 'root-dir';
        
        // 创建文件夹标题
        const folderTitle = document.createElement('h2');
        folderTitle.textContent = `文件夹: ${currentDirectoryHandle.name}`;
        outputElement.appendChild(folderTitle);
        outputElement.appendChild(rootUl);
        
        // 开始递归处理文件夹
        await processDirectory(currentDirectoryHandle, rootUl, 0);
        
        // 默认展开根目录
        const rootDirElement = rootUl.querySelector('.dir');
        if (rootDirElement) {
            rootDirElement.classList.add('expanded');
        }
        
        updateStatus(`已加载文件夹: ${currentDirectoryHandle.name}`);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            updateStatus('用户取消了选择', 'info');
        } else {
            console.error('发生错误:', error);
            updateStatus(`错误: ${error.message}`, 'error');
        }
    }
});

// 更新状态信息
function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    
    // 清除之前的跑马灯效果
    if (statusMarquee) {
        statusElement.classList.remove('marquee');
        statusElement.innerHTML = '';
        statusMarquee = false;
    }
    
    if (!message) {
        statusElement.textContent = '';
        return;
    }
    
    // 设置样式
    statusElement.style.backgroundColor = type === 'error' ? '#f8d7da' : '#fff3cd';
    statusElement.style.color = type === 'error' ? '#721c24' : '#856404';
    
    // 检查是否需要跑马灯效果
    const tempSpan = document.createElement('span');
    tempSpan.textContent = message;
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    document.body.appendChild(tempSpan);
    
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    
    if (textWidth > statusElement.offsetWidth) {
        statusElement.classList.add('marquee');
        statusElement.innerHTML = `<span>${message}</span>`;
        statusMarquee = true;
    } else {
        statusElement.textContent = message;
    }
}

// 递归处理文件夹
async function processDirectory(directoryHandle, parentUl, indentLevel) {
    // 创建当前文件夹的LI容器
    const dirLi = document.createElement('li');
    dirLi.className = 'dir';
    
    // 创建文件夹名称DIV
    const dirNameDiv = document.createElement('div');
    dirNameDiv.className = 'dir-name';
    dirNameDiv.textContent = directoryHandle.name;
    dirLi.appendChild(dirNameDiv);
    
    // 创建内容容器UL
    const contentUl = document.createElement('ul');
    dirLi.appendChild(contentUl);
    
    // 添加到父元素
    parentUl.appendChild(dirLi);
    
    // 点击文件夹名称切换展开/折叠
    dirNameDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        dirLi.classList.toggle('expanded');
    });
    
    // 获取文件夹中的条目并排序，文件夹在前
    const entries = [];
    for await (const entry of directoryHandle.values()) {
        entries.push(entry);
    }
    
    // 排序：文件夹在前，文件在后
    entries.sort((a, b) => {
        if (a.kind === b.kind) return a.name.localeCompare(b.name);
        return a.kind === 'directory' ? -1 : 1;
    });

    for (const entry of entries) {
        if (entry.kind === 'file') {
            // 处理文件
            const file = await entry.getFile();
            const fileLi = document.createElement('li');
            
            // 根据文件扩展名设置不同的类
            const fileClass = getFileClass(entry.name);
            fileLi.className = fileClass;
            
            // 设置文件显示内容
            fileLi.textContent = `${entry.name} (${formatFileSize(file.size)})`;
            contentUl.appendChild(fileLi);
            
            // 为文件添加点击事件
            fileLi.addEventListener('click', async (e) => {
                e.stopPropagation();
                
                if (fileClass === 'music') {
                    // 如果是音乐文件，播放它
                    await playMusicFile(entry, file, directoryHandle);
                } else {
                    // 其他文件显示基本信息
                    updateStatus(`选中文件: ${entry.name} (${formatFileSize(file.size)})`);
                }
            });
            
        } else if (entry.kind === 'directory') {
            // 处理子文件夹
            await processDirectory(entry, contentUl, indentLevel + 1);
        }
    }
}

// 播放音乐文件
async function playMusicFile(fileHandle, file, directoryHandle) {
    try {
        updateStatus(`正在加载: ${file.name}...`);
        
        // 重置之前的播放状态
        resetMusicPlayer();
        
        // 设置音频源
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
        currentFileHandle = fileHandle;
        
        // 更新UI
        document.getElementById('nowPlaying').textContent = `正在播放: ${file.name}`;
        document.getElementById('player').style.display = 'block';
        
        // 查找并加载LRC歌词文件
        await loadLrcFile(file.name, directoryHandle);
        
        // 高亮当前音乐文件
        document.querySelectorAll('.music').forEach(el => el.classList.remove('playing'));
        const musicElements = document.querySelectorAll('.music');
        for (const el of musicElements) {
            if (el.textContent.includes(file.name)) {
                el.classList.add('playing');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
            }
        }
        
        // 播放音乐
        await audioPlayer.play();
        updateStatus(`正在播放: ${file.name}`);
        
        // 开始歌词同步
        startLyricSync();
        
    } catch (error) {
        console.error('播放音乐出错:', error);
        updateStatus(`无法播放音乐: ${error.message}`, 'error');
    }
}

// 重置音乐播放器
function resetMusicPlayer() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    lyricsData = [];
    currentLyricIndex = -1;
    clearInterval(lyricInterval);
    document.getElementById('lyrics').innerHTML = '';
}

// 加载LRC歌词文件
async function loadLrcFile(musicFileName, directoryHandle) {
    const lrcFileName = musicFileName.replace(/\.[^/.]+$/, "") + '.lrc';
    
    try {
        // 尝试获取LRC文件句柄
        const lrcFileHandle = await directoryHandle.getFileHandle(lrcFileName);
        const lrcFile = await lrcFileHandle.getFile();
        const lrcText = await lrcFile.text();
        
        // 解析LRC歌词
        lyricsData = parseLrc(lrcText);
        displayLyrics();
        
        updateStatus(`已加载歌词文件: ${lrcFileName}`);
    } catch (error) {
        // 没有找到LRC文件
        lyricsData = [];
        document.getElementById('lyrics').innerHTML = '未找到歌词文件';
        console.log(`未找到歌词文件: ${lrcFileName}`);
    }
}

// 解析LRC歌词
function parseLrc(lrcText) {
    const lines = lrcText.split('\n');
    const lyrics = [];
    
    // 正则表达式匹配时间标签和歌词
    const timeTagRegex = /\[(\d+):(\d+)\.(\d+)\]/g;
    
    for (const line of lines) {
        let match;
        let lastIndex = 0;
        let text = '';
        
        while ((match = timeTagRegex.exec(line)) !== null) {
            // 提取时间部分
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const hundredths = parseInt(match[3]);
            const time = minutes * 60 + Math.min(59, seconds) + +(String(hundredths).padEnd(9,'0')) / 1000000000;
            
            // 获取时间标签后的文本
            const tagEnd = match.index + match[0].length;
            if (lastIndex < tagEnd) {
                text = line.substring(tagEnd).trim();
            }
            
            // 添加到歌词数组
            if (text) {
                lyrics.push({ time, text });
            }
            
            lastIndex = timeTagRegex.lastIndex;
        }
    }
    
    // 按时间排序
    lyrics.sort((a, b) => a.time - b.time);
    return lyrics;
}

// 显示歌词
function displayLyrics() {
    const lyricsContainer = document.getElementById('lyrics');
    lyricsContainer.innerHTML = '';
    
    if (lyricsData.length === 0) {
        lyricsContainer.textContent = '无歌词内容';
        return;
    }
    
    lyricsData.forEach((lyric, index) => {
        const lyricLine = document.createElement('div');
        lyricLine.className = 'lyric-line';
        lyricLine.textContent = lyric.text;
        lyricLine.dataset.index = index;
        lyricsContainer.appendChild(lyricLine);
    });
}

// 开始歌词同步
function startLyricSync() {
    clearInterval(lyricInterval);
    
    lyricInterval = setInterval(() => {
        const currentTime = audioPlayer.currentTime;
        updateLyrics(currentTime);
    }, 33);
}

// 更新歌词高亮
function updateLyrics(currentTime) {
    if (lyricsData.length === 0) return;
    
    // 找到当前时间对应的歌词
    let newIndex = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (lyricsData[i].time <= currentTime) {
            newIndex = i;
        } else {
            break;
        }
    }
    
    // 如果歌词索引变化了，更新UI
    if (newIndex !== currentLyricIndex) {
        currentLyricIndex = newIndex;
        
        const lyricLines = document.querySelectorAll('.lyric-line');
        lyricLines.forEach((line, index) => {
            if (index === currentLyricIndex) {
                line.classList.add('current');
                // 滚动到当前歌词
                line.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                line.classList.remove('current');
            }
        });
    }
}

// 根据文件名获取对应的CSS类
function getFileClass(filename) {
    const lowerName = filename.toLowerCase();
    const lastDot = lowerName.lastIndexOf('.');
    let suffix;
    if (lastDot == -1) {
        suffix = '';
    } else {
        suffix = lowerName.substr(lastDot);
    }
    switch (suffix) {
        case '.mp3':
        case '.wav':
        case '.flac':
        case '.aac':
        case '.ogg':
        case '.m4a':
        case '.m4b':
        case '.g711a':
        case '.g711u':
            return 'music';
        case '.txt':
        case '.md':
        case '.csv':
        case '.json':
        case ".xml":
        case '.html':
        case '.css':
        case '.js':
        case '.lrc':
        case '.java':
        case '.py':
        case '.go':
        case '.ts':
        case '.sass':
        case '.scss':
        case '.less':
        case '.ini':
        case '.dart':
        case '.yaml':
        case '.pom':
        case '.gitignore':
        case '.c':
        case '.h':
        case '.cpp':
        case '.hpp':
        case '.kt':
        case '.kts':
        case '.propertise':
        case '.pro':
        case '.log':
        case '.doc':
        case '.docx':
        case '.xls':
        case '.xlsx':
        case '.pdf':
        case '.gradle':
        case '.swift':
        case '.cs':
        case '.odt':
        case '.rtf':
        case '.ods':
        case '.odp':
        case '.wxml':
        case '.wxss':
        case '.php':
        case '.vue':
        case '.jsp':
        case '.sql':
            return 'text';
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
        case '.bmp':
        case '.svg':
        case '.webp':
        case '.jfif':
            return 'image';
        case '.zip':
        case '.rar':
        case '.7z':
        case '.tar':
        case '.gz':
            return 'archive';
        case '.exe':
        case '.bat':
        case '.sh':
        case '.msi':
        case '.app':
        case '.apk':
            return 'executable';
        case '.mp4':
        case '.avi':
        case '.mkv':
        case '.mov':
        case '.wmv':
        default:
            return 'file';
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 音频播放结束时清理
audioPlayer.addEventListener('ended', () => {
    document.querySelectorAll('.music.playing').forEach(el => el.classList.remove('playing'));
    clearInterval(lyricInterval);
});

// 窗口大小变化时检查状态栏是否需要跑马灯效果
window.addEventListener('resize', () => {
    const statusElement = document.getElementById('status');
    if (statusElement.textContent && !statusMarquee) {
        const tempSpan = document.createElement('span');
        tempSpan.textContent = statusElement.textContent;
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        document.body.appendChild(tempSpan);
        
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        if (textWidth > statusElement.offsetWidth && !statusMarquee) {
            const message = statusElement.textContent;
            statusElement.classList.add('marquee');
            statusElement.innerHTML = `<span>${message}</span>`;
            statusMarquee = true;
        }
    }
});