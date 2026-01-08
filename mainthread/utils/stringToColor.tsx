export function stringToHexColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ("00" + value.toString(16)).slice(-2);
    }
    // if its black, convert it to a light color
    if(color === "#000000"){
        color = "#FFFFFF";
    }

    return color;
}

export default stringToHexColor;