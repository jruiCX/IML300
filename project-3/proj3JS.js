document.addEventListener('DOMContentLoaded', function() {
    const texts = document.querySelectorAll('.text');
    let currentIndex = 0;
    
    console.log('找到的文字段落数量:', texts.length);
    
    // 为每个文字内容添加点击事件
    texts.forEach(text => {
        text.addEventListener('click', function() {
            console.log('点击了文字，当前索引:', currentIndex);
            
            // 隐藏当前文字
            texts[currentIndex].classList.remove('active');
            
            // 计算下一段文字的索引
            currentIndex = (currentIndex + 1) % texts.length;
            
            // 显示下一段文字
            texts[currentIndex].classList.add('active');
            
            console.log('切换到新索引:', currentIndex);
        });
    });
});