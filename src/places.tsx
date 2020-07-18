import * as React from 'react';
import { View, StyleSheet, FlatList, Image, Text, ViewStyle, TextStyle } from "react-native";
import TouchableWrapper from './TouchableWrapper';
import { prediction, lengthAndOffset } from './types';
import { nanoid } from 'nanoid/non-secure'


// prediction text presentation
export type decorateTextFormat = 'matched' | 'unmatched';
function decorateText(
  text: Array<string>, 
  matched: Array<lengthAndOffset>, 
  style?: suggestionsStyle, 
  format?: decorateTextFormat,
  ){
  let formatted:Array<JSX.Element | string> = JSON.parse(JSON.stringify(text));

  if (format == 'matched') {
    for (let index = 0; index < matched.length; index++) {
      let { offset, length } = matched[index];
      const match = text.slice(offset, offset + length).join('');
      if(text.length != formatted.length) {
        // adjust offset to match the new array length
        offset = offset - (text.length - formatted.length);
      }
      formatted.splice(
        offset, 
        length, 
        <Text key={nanoid()} style={[{fontWeight: 'bold', color: '#121'}, style?.highlightedText]}>{match}</Text>
      );
    }
    return <Text style={[{ color: '#c5c5c5', fontSize: 16 }, style?.suggestedText]}>{formatted}</Text>
  }

  if (format == 'unmatched') {
    for (let index = 0; index < matched.length; index++) {
      let { offset, length } = matched[index];
      const match = text.slice(offset, offset + length).join('');
      if(text.length != formatted.length) {
        // adjust offset to match the new array length
        offset = offset - (text.length - formatted.length);
      }
      formatted.splice(
        offset, 
        length, 
        <Text key={nanoid()} style={[{fontWeight: 'normal', color: '#c5c5c5'}, style?.suggestedText]}>{match}</Text>
      );
    }
    return <Text style={[{ color: '#121', fontSize: 16, fontWeight: "bold" }, style?.highlightedText]}>{formatted}</Text>
  }
  
  return <Text style={[{ color: '#c5c5c5', fontSize: 16 }, style?.suggestedText]}>{text.join('')}</Text>
}

// styling for the suggestions FlatList
export interface suggestionsStyle {
  container?: ViewStyle,
  itemContainer?: ViewStyle,
  suggestedText?: TextStyle,
  highlightedText?: TextStyle,
};

export interface PlacesProps {
  data: Array<prediction>;
  setValue(value: prediction): void;
  suggestionsStyle?: suggestionsStyle;
  icon?: JSX.Element;
  highlight?: decorateTextFormat;
}

export default function Places({ data, setValue, suggestionsStyle, icon, highlight }: PlacesProps) {
  return (
    <View style={[{ 
      position: 'absolute', 
      top: 0, 
      right: 0, 
      left: 0, 
      backgroundColor: '#fff', 
      zIndex: data.length ?  4 : undefined,
      elevation: data.length ? 4 : undefined
      }, suggestionsStyle?.container]}>
      <FlatList
        keyboardShouldPersistTaps='always'
        data={data}
        renderItem={({ item }) => {
          return (
            <TouchableWrapper key={item.id} onPress={() => {
              setValue(item);
              data.length = 0;
            }}>
              <View style={[styles.suggestionItem, suggestionsStyle?.itemContainer]}>
                {icon ?
                  <View style={{ flex: 0.1, justifyContent:"center" }}>
                    {icon}
                  </View>
                  : <></>
                }
                <View style={{ flex: 1 }}>
                  {decorateText(
                    item.description.split(''),
                    item.matched_substrings,
                    suggestionsStyle,
                    highlight
                  )}
               </View>
              </View>
            </TouchableWrapper>
          )}
        }
        ListFooterComponent={
          data.length > 0 ?
            <Image source={require('../assets/powered_by_google.png')} resizeMode='contain' style={{ width: '32%', alignSelf: 'flex-end', marginRight: 10 }} />
            :<></>
        }
        keyExtractor={(item, index) => `${item.id}${index}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionItem: { 
    flex: 1, 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: '#c5c5c5', 
    paddingVertical: 12 
  },
})