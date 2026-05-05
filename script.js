// Управление боковым меню
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Управление раскрытием подтем
function toggleSubtopics(event) {
    event.preventDefault();
    const topicLink = event.currentTarget;
    const subtopicsList = topicLink.nextElementSibling;
    
    if (subtopicsList && subtopicsList.classList.contains('subtopics')) {
        topicLink.classList.toggle('expanded');
        subtopicsList.classList.toggle('expanded');
    }
}

// Инициализация редакторов кода
document.addEventListener('DOMContentLoaded', function() {
    const codeEditors = document.querySelectorAll('.code-editor');
    
    codeEditors.forEach(textarea => {
        const mode = textarea.getAttribute('data-mode') || 'text/x-java';
        
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: mode,
            theme: 'dracula',
            lineNumbers: true,
            readOnly: true,
            lineWrapping: false,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            autoCloseBrackets: true,
            matchBrackets: true,
            styleActiveLine: false,
            viewportMargin: Infinity,
            cursorBlinkRate: -1
        });
        
        // Подстраиваем высоту под содержимое
        setTimeout(() => {
            editor.refresh();
            const lineCount = editor.lineCount();
            const lineHeight = editor.defaultTextHeight();
            const height = (lineCount * lineHeight) + 10;
            editor.setSize(null, Math.min(height, 600));
        }, 100);
        
        // Сохраняем ссылку на редактор для кнопки копирования
        textarea.codeMirrorInstance = editor;
    });
    
    // Добавляем кнопки копирования
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        const header = block.querySelector('.code-header');
        const textarea = block.querySelector('.code-editor');
        
        if (header && textarea) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Копировать';
            copyBtn.title = 'Копировать';
            
            copyBtn.addEventListener('click', function() {
                const editor = textarea.codeMirrorInstance;
                const code = editor ? editor.getValue() : textarea.value;
                
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.textContent = 'Копировать';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Ошибка копирования:', err);
                    alert('Не удалось скопировать код');
                });
            });
            
            header.appendChild(copyBtn);
        }
    });
    
    // Добавляем обработчики для раскрытия подтем
    const topicLinks = document.querySelectorAll('.sidebar-nav .topic');
    topicLinks.forEach(link => {
        link.addEventListener('click', toggleSubtopics);
    });
    
    // Автоматически раскрываем ветку с активной страницей
    const activeLink = document.querySelector('.sidebar-nav a.active');
    if (activeLink) {
        // Ищем родительский элемент subtopics
        const parentSubtopics = activeLink.closest('.subtopics');
        if (parentSubtopics) {
            // Находим соответствующую тему (topic)
            const parentTopic = parentSubtopics.previousElementSibling;
            if (parentTopic && parentTopic.classList.contains('topic')) {
                parentTopic.classList.add('expanded');
                parentSubtopics.classList.add('expanded');
            }
        }
    }
});

// Система комментариев
function addComment() {
    const commentText = document.getElementById('comment-text');
    const text = commentText.value.trim();
    
    if (text === '') {
        alert('Напишите комментарий!');
        return;
    }
    
    const comment = {
        author: 'Гость',
        text: text,
        date: new Date().toLocaleString('ru-RU'),
        page: window.location.pathname
    };
    
    // Сохраняем в localStorage
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
    
    // Очищаем поле ввода
    commentText.value = '';
    
    // Перезагружаем комментарии
    loadComments();
}

function loadComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    commentsList.innerHTML = '<p style="color: var(--light-purple); font-style: italic;">Пока нет комментариев. Будьте первым!</p>';
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Обработка Enter в текстовом поле комментариев
document.addEventListener('DOMContentLoaded', function() {
    const commentTextarea = document.getElementById('comment-text');
    if (commentTextarea) {
        commentTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                addComment();
            }
        });
    }
});
