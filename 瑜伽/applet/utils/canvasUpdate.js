/**

@author zhangxinxu(.com)

@licence MIT

@description http://www.zhangxinxu.com/wordpress/?p=7362
*/
function letterSpacingText(canvas,ctx,text, x, y, letterSpacing) {

    if (!letterSpacing) {
        return this.fillText(text, x, y);
    }
    
    let arrText = text.split('');
    let align = ctx.textAlign || 'left';
    // 这里仅考虑水平排列
    let originWidth = ctx.measureText(text).width;
    // 应用letterSpacing占据宽度
    let actualWidth = originWidth + letterSpacing * (arrText.length - 1);
    // 根据水平对齐方式确定第一个字符的坐标
    if (align == 'center') {
        x = x - actualWidth / 2;
    } else if (align == 'right') {
        x = x - actualWidth;
    }
    
    // 临时修改为文本左对齐
    ctx.textAlign = 'left';
    // 开始逐字绘制
    arrText.forEach(function (letter) {
    var letterWidth = ctx.measureText(letter).width;
    ctx.fillText(letter, x, y);
    // 确定下一个字符的横坐标
        x = x + letterWidth + letterSpacing;
    });
    // 对齐方式还原
    ctx.textAlign = align;
}

function wrapText (canvas,ctx,text, x, y, maxWidth, lineHeight, ellipsisNum) {
        if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
            return;
        }
        
        if (typeof maxWidth == 'undefined') {
            maxWidth = (canvas && canvas.width) || 300;
        }
        // if (typeof lineHeight == 'undefined') {
        //     lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
        // }
        
        // 字符分隔为数组
        let arrText = text.split('');
        let line = '';
        let i = 0
        let ellipsisLine = ellipsisNum || 6
        console.log('arrText',arrText)
        for (let n = 0; n < arrText.length; n++) {
            let testLine = line + arrText[n];
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                if( i > ellipsisLine ){
                    return
                }
                if(i == ellipsisLine){
                    line = line.substr(0,line.length - 2 ) + '...'
                }
                ctx.fillText(line, x, y);
                i+=1
                line = arrText[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        if(i <= ellipsisLine){
            ctx.fillText(line, x, y);
        }
}
export{
    letterSpacingText,
    wrapText
}