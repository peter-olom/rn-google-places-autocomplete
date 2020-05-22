import React from 'react';
import { View, StyleSheet, FlatList, Image, Text, ViewStyle, TextStyle } from "react-native";
import TouchableWrapper from './TouchableWrapper';
import { prediction } from '../types';

// prediction text presentation
export type decorateTextFormat = 'matched' | 'unmatched';
function decorateText(
  text: string, 
  subText: string, 
  style: { main?: TextStyle, sub?: TextStyle }, 
  format?: decorateTextFormat,
  ){
  const t = text.split(subText);
  if(format == 'matched') {
    return <Text style={[{ color: '#c5c5c5', fontSize: 16 }, style.main]}>
    {t[0]}
    <Text style={[{fontWeight: 'bold', color: '#121'}, style.sub]}>{subText}</Text>
    {t[1]}
  </Text>
  }

  if(format == 'unmatched') {
    return <Text style={[{ color: '#c5c5c5', fontSize: 16 }, style.main]}>
    <Text style={[{fontWeight: 'bold', color: '#121'}, style.sub]}>{t[0]}</Text>
    {subText}
    <Text style={[{fontWeight: 'bold', color: '#121'}, style.sub]}>{t[1]}</Text>
  </Text>
  }

  return <Text style={[{ color: '#c5c5c5', fontSize: 16 }, style.main]}>{text}</Text>
}

// styling for the suggestions FlatList
export interface suggestionsStyle {
  container?: ViewStyle,
  itemContainer?: ViewStyle,
  mainText?: TextStyle,
  boldText?: TextStyle,
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
    <View style={[{ position: 'absolute', top: 0, right: 0, left: 0, backgroundColor: '#fff', zIndex: 9 }, suggestionsStyle?.container]}>
      <FlatList
        keyboardShouldPersistTaps='always'
        data={data}
        renderItem={({ item }) => {
          const i = item.matched_substrings[0];
          const s = item.description.slice(i.offset, i.offset+i.length);
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
                    item.description,
                    s,
                    {main: suggestionsStyle?.mainText, sub: suggestionsStyle?.boldText},
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