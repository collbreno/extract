import Colors from 'react-native-material-color'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export const colorList = [...([
  Colors.RED, Colors.PINK, Colors.PURPLE, Colors.DEEPPRUPLE, Colors.INDIGO, 
  Colors.BLUE,  Colors.LIGHTBLUE, Colors.CYAN, Colors.TEAL, Colors.GREEN, 
  Colors.LIGHTGREEN, Colors.LIME, Colors.YELLOW, Colors.AMBER, Colors.ORANGE, 
  Colors.DEEPORANGE, Colors.BROWN, Colors.BLUEGREY, Colors.GREY
].reduce((acc, color) => [...acc, ...([
  '300', '400', '600', '800', '900',
].map(number => color[number]))], [])), Colors.White, Colors.Black]
  
export const iconList = Object.keys(MaterialCommunityIcons.getRawGlyphMap())

export const formatCash = (value) => `R$ ${(value/100).toFixed(2)}`

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getTextColor(hexColor) {
  const { r,g,b } = hexToRgb(hexColor)
  return ((r*0.299 + g*0.587 + b*0.114) > 186) ? '#000000' :  '#ffffff'
}