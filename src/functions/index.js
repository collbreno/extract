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