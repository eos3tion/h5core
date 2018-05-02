namespace jy {
    const copyDiv = document.createElement("div");
    const doc = document;
    const de = doc.documentElement;
    /**
     * 拷贝到剪贴板中
     * 
     * @author gushuai
     * @export
     * @param {string} str 
     * @returns 
     */
    export function doCopy(str: string) {
        de.appendChild(copyDiv);
        copyDiv.innerText = str;
        let selection = getSelection();
        let range = doc.createRange();
        range.selectNodeContents(copyDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        let val = doc.execCommand("copy");
        de.removeChild(copyDiv);
        return val;
    }
}